📌 Campus Cartel

Campus Cartel is a ReactJS, Node.js, and Firebase-powered platform where students can buy and sell second-hand products at affordable prices. Built by a student, for students, this marketplace enables sellers to list, edit, and manage their products seamlessly through a dedicated dashboard.
🚀 Features
📌 Buy & Sell – Students can list used products and browse listings.

🛒 Seller Dashboard – Edit or remove product listings anytime.

🔥 Firebase Authentication – Secure user login and sign-up.

🏷️ Product Categories – Organized listings for a smooth experience.

📸 Image Uploads – Sellers can add product images.

🔍 Clean & Responsive UI – Optimized for mobile and desktop.

🛠️ Tech Stack
Frontend: ReactJS
Backend: Node.js
Database: Firebase (Firestore)
Hosting: Vercel

Campus-Cartel/
│── backend/
│   │── .vercel/
│   │── .env
│   │── .gitignore
│   │── server.js
│   │── serviceAccountKey.js
│
│── frontend/
│   │── .vercel/
│   │── build/
│   │── node_modules/
│   │── public/
│   │── src/
│   │   │── Images/
│   │   │── .gitignore
│   │   │── App.css
│   │   │── App.js
│   │   │── App.test.js
│   │   │── Cart.js
│   │   │── FirebaseConfig.js
│   │   │── Home.js
│   │   │── index.css
│   │   │── index.js
│   │   │── Login.js
│   │   │── logo.svg
│   │   │── logo.webp
│   │   │── ProductPage.js
│   │   │── Products.js
│   │   │── ProfilePage.js
│   │   │── reportWebVitals.js
│   │   │── Reset.js
│   │   │── Sell.js
│   │   │── setupTests.js
│   │   │── SignUp.js
│
│── .gitignore
│── package-lock.json
│── package.json
│── README.md
│── node_modules/
│── .gitignore
│── package-lock.json
│── package.json

🌍 Deployment
Vercel: https://frontend-jwtm86dpm-prahaladhs-projects.vercel.app/

⚡ Installation & Setup
1. Clone the Repository
git clone https://github.com/Prahaladh39/Campus-Cartel.git
cd Campus-Cartel
2. Install Dependencies
# Install backend dependencies
cd backend
npm install
# Install frontend dependencies
cd ../frontend
npm install

3. Configure Firebase
Create a Firebase project at Firebase Console.
Enable Firestore and Authentication (Email/Password).
Add the Firebase config details inside FirebaseConfig.js.

4. Run the Project
# Start backend server
cd backend
node server.js
# Start frontend
cd ../frontend
npm start

5. Deploy to Vercel
cd backend
vercel
cd ../frontend
vercel
🤝 Contributing
Feel free to fork, raise issues, or submit pull requests!

📞 Contact
For any queries or collaboration, connect with me on https://www.linkedin.com/in/slnprahaladh/
