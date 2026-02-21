🍽️ SB Foods – OrderOnTheGo

A Full Stack Multi-Role Food Ordering Web Application

📌 Project Overview

SB Foods (OrderOnTheGo) is a full-stack food ordering platform that connects:

👨‍💼 Admin

🧑‍🍳 Restaurant Partners

🧑‍💻 Customers

The system allows customers to browse restaurants and dishes, add items to cart, place orders, and track order status.
Restaurants can manage menu items and orders.
Admins control users, restaurants, and approvals.

🏗️ Tech Stack
Frontend

React.js

React Router

Axios

CSS (Custom styling)

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT Authentication

👥 User Roles & Modules
👨‍💼 Admin Module (First 5 Screens)
🔐 Admin Login

Login as Admin

Secure role-based authentication

📊 Admin Dashboard

Displays:

Total Users

Active Restaurants

Total Orders

Pending Approvals

👥 User Management

View all registered users

See user roles

View account status (Active)

🏪 Restaurant Management

View all restaurant partners

Approve new restaurant registrations

View restaurant location & status

✅ Restaurant Approval System

Newly registered restaurants appear under Pending Approvals

Admin can Approve them

Once approved, restaurant becomes active

🧑‍💻 Customer Module (Next 8 Screens)
📝 Customer Registration

Name

Email

Role (Customer)

Password

Address

🔐 Customer Login

Login as Customer

JWT-based authentication

🏠 Customer Dashboard

Browse categories

View popular restaurants

View popular dishes

Add items to cart

🛒 Add to Cart

Add items

Alert confirmation (“Added to cart”)

Increase / Decrease quantity

Remove items

🧾 Cart Page

Items summary

Delivery fee

Final bill calculation

Delivery address

Payment Method:

Cash on Delivery

Online Payment

✅ Order Placement

Order success confirmation

Order stored in database

📦 My Orders

View order history

Order ID

Amount

Order Status:

Pending

Preparing

Out for Delivery

Delivered

Cancel Order (if not delivered)

❌ Cancel Order

Cancelled orders show status as “Cancelled”

🧑‍🍳 Restaurant Module (Last 5 Screens)
🔐 Restaurant Login

Login as Restaurant

Must be approved by Admin

⏳ Waiting for Approval

If not approved → Cannot access dashboard

Shows waiting message

📊 Restaurant Dashboard

Displays:

Total Menu Items

Active Orders

Store Status (Active)

🍲 Manage Items

Add new item:

Item Name

Price

Image URL

Description

Edit item

Disable item

Delete item

View availability status

📦 Manage Orders

View all orders received

Update order status:

Pending

Preparing

Out for Delivery

Delivered

Cancel order

🔄 System Workflow

Restaurant registers

Admin approves restaurant

Customer registers

Customer places order

Restaurant receives order

Restaurant updates order status

Customer tracks order

📂 Project Structure
ORDER_ON_TO_GO/
│
├── client/                         # React Frontend (Vite)
│   │
│   ├── node_modules/
│   ├── public/
│   │
│   ├── src/
│   │   │
│   │   ├── api/
│   │   │   └── api.js              # Axios configuration
│   │   │
│   │   ├── assets/
│   │   │   └── react.svg
│   │   │
│   │   ├── components/             # Reusable UI Components
│   │   │
│   │   ├── pages/
│   │   │   │
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AllOrders.jsx
│   │   │   │   ├── AllProducts.jsx
│   │   │   │   ├── AllRestaurants.jsx
│   │   │   │   └── AllUsers.jsx
│   │   │   │
│   │   │   ├── customer/
│   │   │   │   ├── Cart.jsx
│   │   │   │   ├── FoodList.jsx
│   │   │   │   ├── MyOrders.jsx
│   │   │   │   ├── UserDashboard.jsx
│   │   │   │   └── UserProfile.jsx
│   │   │   │
│   │   │   ├── restaurant/
│   │   │   │   ├── ManageItems.jsx
│   │   │   │   ├── ManageOrders.jsx
│   │   │   │   ├── RestaurantDashboard.jsx
│   │   │   │   └── RestaurantManage.jsx
│   │   │
│   │   ├── App.jsx                 # Main routing file
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── README.md
│
│
├── server/                         # Node.js + Express Backend
│   │
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   │
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── foodController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   ├── restaurantController.js
│   │   └── userController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verification
│   │   └── roleMiddleware.js       # Role-based access control
│   │
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Cart.js
│   │   ├── Food.js
│   │   ├── Order.js
│   │   ├── Restaurant.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── foodRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── restaurantRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── node_modules/
│   ├── .env
│   ├── index.js                    # Main server entry
│   ├── package.json
│   └── package-lock.json
│
│
├── RAZORPAY_SETUP.md               # Payment integration guide
├── README.md
└── Order_On_The_Go-main.zip
⚙️ How To Run The Project
🗄 Step 1: Install MongoDB

Install MongoDB locally
Make sure MongoDB is running:

mongod

Or use MongoDB Compass.

🚀 Step 2: Run Backend

Go to server folder:

cd server
npm install
npm start

Server runs on:

http://localhost:5000
💻 Step 3: Run Frontend

Open new terminal:

cd client
npm install
npm run dev

Frontend runs on:

http://localhost:5173
🔐 Sample Test Credentials
👨‍💼 Admin

Email: admin@test.com

Password:admin123
Role: Admin

🧑‍💻 Customer

Email: bob@cust.com

Password: Bob@123
Role: Customer

🧑‍🍳 Restaurant

Email: resto@cafe.com

Password: Rest@123
Role: Restaurant

🔑 Key Features

✔️ Role-Based Authentication
✔️ JWT Security
✔️ Admin Approval System
✔️ Dynamic Order Tracking
✔️ Cart & Billing System
✔️ Real-time Status Updates
✔️ Restaurant Menu Management
✔️ Order Cancellation
✔️ Responsive UI

📸 Screenshots
👨‍💼 Admin Module

Admin Login
<img width="1920" height="1080" alt="admin login" src="https://github.com/user-attachments/assets/de156f58-7230-4b75-a62b-ef50809eea5a" />

Admin Dashboard
<img width="1920" height="1080" alt="admin Dashboard" src="https://github.com/user-attachments/assets/9c10a41b-5b76-43e7-8fa7-2c892c0c4920" />

Manage Users
<img width="1920" height="1080" alt="Manage users" src="https://github.com/user-attachments/assets/2ebc53d2-1514-4bb0-969a-0f9da8ca99e1" />

Manage Restaurants
<img width="1920" height="1080" alt="Manage Restaurants" src="https://github.com/user-attachments/assets/0c178642-f2db-452b-9452-1a34ec4237ba" />

Restaurant Approval
<img width="1920" height="1080" alt="new rest approved" src="https://github.com/user-attachments/assets/075ece4f-07f3-41a7-a1e9-aa7522e11b45" />

🧑‍💻 Customer Module

Register
<img width="1920" height="1080" alt="customer register" src="https://github.com/user-attachments/assets/41ed9248-0514-4ffb-8859-c2439268c60e" />

Login
<img width="1920" height="1080" alt="customer login" src="https://github.com/user-attachments/assets/107ae91f-fca0-4f92-b435-e9327cd6e711" />

Dashboard
<img width="1920" height="1080" alt="customer Dashboard" src="https://github.com/user-attachments/assets/70c35d49-689e-4a9b-b5b0-5a8c497b76af" />

Add to Cart
<img width="1920" height="1080" alt="customer added to cart" src="https://github.com/user-attachments/assets/9306b6a4-fa90-40db-920c-a6cf3cdef46c" />

Cart Page
<img width="1920" height="1080" alt="cart" src="https://github.com/user-attachments/assets/d733e56d-82b4-4349-a42d-1159c908664f" />

Order Success
<img width="1920" height="1080" alt="order placed success" src="https://github.com/user-attachments/assets/f5da97c9-bf28-4e79-8b96-01a99b4e2b94" />

My Orders
<img width="1920" height="1080" alt="My orders staus" src="https://github.com/user-attachments/assets/abe7d263-5678-4c13-8db1-e0ecc32dbd9c" />

Cancel Order
<img width="1920" height="1080" alt="cancelled order" src="https://github.com/user-attachments/assets/6a11f57f-fdf5-4b9b-a552-045adff27057" />

🧑‍🍳 Restaurant Module

Restaurant Login
<img width="1920" height="1080" alt="restaurant login" src="https://github.com/user-attachments/assets/1f1f0623-d47a-4c6a-bd2e-204b17915eee" />

Restaurant Register
<img width="1920" height="1009" alt="image" src="https://github.com/user-attachments/assets/88a79f41-dfc5-47e6-b55d-7aba14a545d0" />

Waiting for Approval
<img width="1920" height="1080" alt="waiting for approval " src="https://github.com/user-attachments/assets/1664dccd-9f2f-40b6-a020-9a8edcfb8afa" />

Restaurant Dashboard
<img width="1920" height="1080" alt="Restaurant Dashboard" src="https://github.com/user-attachments/assets/547ddc58-193a-4eef-b0e7-fbee7fba8282" />

Manage Items
<img width="1920" height="1080" alt="Manage Items" src="https://github.com/user-attachments/assets/8e62a464-389b-4148-af55-1a6aab9f84f4" />

Manage Orders
<img width="1920" height="1080" alt="Manage order" src="https://github.com/user-attachments/assets/94864a61-f6c3-40c5-aec7-78366b800ed3" />

(Insert your screenshots here in GitHub)

🎯 Learning Outcomes

This project demonstrates:

Full Stack Development

Role-Based Access Control

REST API Design

MongoDB Schema Design

JWT Authentication

State Management in React

Order Lifecycle Management

📌 Future Improvements

Payment Gateway Integration (Razorpay/Stripe)

Email Notifications

Admin Analytics Dashboard

Image Upload via Cloudinary

Pagination & Filters

Deployment (Render + Vercel)

👨‍💻 Developed By

Abhi 🚀
Full Stack Developer
