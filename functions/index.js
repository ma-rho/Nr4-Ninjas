
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");
const cors = require("cors")({ origin: true });

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Get PayPal credentials from Firebase environment configuration
// In your terminal, run:
// firebase functions:config:set paypal.client_id="YOUR_SANDBOX_CLIENT_ID"
// firebase functions:config:set paypal.client_secret="YOUR_SANDBOX_CLIENT_SECRET"
const { client_id, client_secret } = functions.config().paypal;
const PAYPAL_API_BASE = "https://api.sandbox.paypal.com";

/**
 * Generates and caches a PayPal API access token.
 */
let paypalAuthToken = null;
const getPayPalAccessToken = async () => {
    if (paypalAuthToken && paypalAuthToken.expires > Date.now()) {
        return paypalAuthToken.token;
    }

    if (!client_id || !client_secret) {
        throw new Error("PayPal credentials are not configured in Firebase.");
    }

    const auth = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
    const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${auth}`,
        },
        body: "grant_type=client_credentials",
    });

    if (!response.ok) {
        const error = await response.json();
        console.error("Failed to get PayPal access token:", error);
        throw new Error("Failed to authenticate with PayPal.");
    }

    const data = await response.json();
    paypalAuthToken = {
        token: data.access_token,
        expires: Date.now() + (data.expires_in - 300) * 1000,
    };
    return paypalAuthToken.token;
};

/**
 * =================================================================
 *                        CREATE ORDER ENDPOINT
 * =================================================================
 * - Validates cart items against Firestore.
 * - Calculates the total amount on the server to prevent manipulation.
 * - Creates a PayPal order with the correct amount and currency.
 * - Includes 3D Secure configuration required for GBP transactions.
 */
exports.createOrder = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        if (req.method !== "POST") {
            return res.status(405).send("Method Not Allowed");
        }

        try {
            const { cart } = req.body;
            if (!cart || !Array.isArray(cart) || cart.length === 0) {
                return res.status(400).json({ error: "Cart data is missing or invalid." });
            }

            // --- Secure Price Calculation ---
            // Fetch product prices from Firestore to build a secure list of items.
            const serverItems = await Promise.all(cart.map(async (clientItem) => {
                const productRef = db.collection("merch").doc(clientItem.id);
                const doc = await productRef.get();
                if (!doc.exists) {
                    throw new Error(`Product with ID ${clientItem.id} not found.`);
                }
                const productData = doc.data();
                return {
                    name: productData.name,
                    quantity: String(clientItem.quantity),
                    unit_amount: {
                        currency_code: "GBP",
                        value: productData.price.toFixed(2),
                    },
                };
            }));

            const totalValue = serverItems.reduce((sum, item) => {
                return sum + (parseFloat(item.unit_amount.value) * parseInt(item.quantity, 10));
            }, 0).toFixed(2);

            const accessToken = await getPayPalAccessToken();

            const payload = {
                intent: "CAPTURE",
                purchase_units: [{
                    amount: {
                        currency_code: "GBP",
                        value: totalValue,
                        breakdown: {
                            item_total: { currency_code: "GBP", value: totalValue },
                        },
                    },
                    items: serverItems,
                }],
                payment_source: {
                    card: {
                        experience_context: {
                            payment_method_preference: "SCA_WHEN_REQUIRED",
                        },
                    },
                },
            };

            const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                console.error("Failed to create PayPal order:", data);
                return res.status(response.status).json(data);
            }
            
            // Return only the order ID to the client
            res.status(200).json({ id: data.id });

        } catch (error) {
            console.error("Error in createOrder function:", error);
            res.status(500).json({ error: error.message });
        }
    });
});

/**
 * =================================================================
 *                       CAPTURE ORDER ENDPOINT
 * =================================================================
 * - Captures the payment for a previously created order.
 * - This is called from the onApprove callback on the client.
 */
exports.captureOrder = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        if (req.method !== "POST") {
            return res.status(405).send("Method Not Allowed");
        }
        
        try {
            const { orderID } = req.body;
            if (!orderID) {
                return res.status(400).json({ error: "Order ID is required." });
            }

            const accessToken = await getPayPalAccessToken();
            const url = `${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`;

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
            });

            const data = await response.json();
            
            if (!response.ok) {
                 console.error("Failed to capture PayPal order:", data);
                 return res.status(response.status).json(data);
            }

            // Return the full capture details to the client
            res.status(200).json(data);

        } catch (error) {
            console.error("Error in captureOrder function:", error);
            res.status(500).json({ error: error.message });
        }
    });
});
