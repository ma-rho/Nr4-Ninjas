import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import SuccessClient from "./SuccessClient";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id: string };
}) {
  if (!searchParams.session_id) {
    redirect("/");
  }

  // Retrieve the session from Stripe to verify payment
  const session = await stripe.checkout.sessions.retrieve(searchParams.session_id);
  const customerName = session.customer_details?.name || "Customer";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-green-100">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Payment Successful!</h1>
        <p className="text-gray-600 mt-2">
          Thank you, <span className="font-semibold">{customerName}</span>. 
          A professional invoice has been sent to your email.
        </p>
        
        {/* This hidden component handles the cart clearing logic */}
        <SuccessClient />

        <a 
          href="/" 
          className="mt-8 inline-block bg-[#635bff] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#534bc3] transition-colors"
        >
          Return to Store
        </a>
      </div>
    </div>
  );
}
