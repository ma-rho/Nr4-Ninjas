# NR4 Ninjas

This is a web application for the NR4 Ninjas, a DJ collective. The app is built with Next.js and Firebase and includes features for event promotion, merchandise sales, and showcasing the group's talent.

## Core Features

- **Event Listing:** Displays a list of upcoming events with details like date, location, and description. Data is fetched from Firestore.
- **Ticket Link Integration:** Events can be linked to external ticketing platforms for easy ticket purchases.
- **Merch Shop:** A merchandise shop with product listings, including images, sizes, and prices. Product data is stored in Firebase.
- **PayPal Checkout:** Secure payment processing for merchandise purchases is handled by PayPal.
- **Photo Gallery:** A gallery to showcase event photos, with images stored in Firebase Storage and displayed in a masonry layout.
- **DJ Profiles:** Individual profiles for each DJ with their bio, photos, social media links, and booking information. All data is managed in Firestore.
- **Newsletter Signup:** A feature to collect user emails for marketing purposes.
- **Admin Dashboard:** A secure, private area for administrators to manage the website's content. This includes:
    - Adding, updating, and deleting events.
    - Managing merchandise inventory.
    - Uploading and organizing photos for the gallery.
    - Editing DJ profiles.
- **Authentication:** The admin dashboard is protected using Firebase Authentication, ensuring that only authorized users can access and modify the site's data.

## Tech Stack

- **Framework:** Next.js
- **Styling:** Tailwind CSS
- **Database:** Firestore
- **Authentication:** Firebase Authentication
- **Storage:** Firebase Storage
- **Deployment:** Firebase App Hosting
- **Payment Processing:** PayPal

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/ma-rho/Nr4-Ninjas.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Set up your environment variables by creating a `.env.local` file in the root of the project. You will need to add your Firebase project configuration here.

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. Run the development server
   ```sh
   npm run dev
   ```

Now, you can open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Accessing the Admin Dashboard

To access the admin features, you will need to create a user account through your Firebase project's Authentication console. Once you have created a user, you can log in through the application's admin login page.
