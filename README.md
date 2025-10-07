🛍️ NeoKart – Full-Stack eCommerce Platform
## 🚀 Project Overview

**NeoKart** is a full-featured **eCommerce web application** built to provide a seamless online shopping experience.

It allows users to browse products, manage carts, make secure payments, and track their orders — all through a clean, responsive, and modern interface.

The app is built using **React.js (Frontend)**, **Spring Boot (Backend)**, and **MS SQL Server** as the database.

It integrates **Stripe** for payment processing, **Twilio** for OTP verification, and **Google OAuth** for secure authentication.

## 🧠 Features

### 🛒 User Features

- User registration & login with **Google OAuth**
- Browse & search products with **filters and sorting**
- **Add to Cart**, **Wishlist**, and **Checkout**
- **Order tracking** and order history
- **Secure payments** via **Stripe**
- **OTP verification** using **Twilio**
- Real-time notifications & toast messages

### 🧑‍💼 Admin Features

- Admin dashboard for **product and order management**
- Create, update, or delete products
- Manage categories, users, and inventory
- View and track all customer orders
- Analyze sales data and performance

### 📦 Other Highlights

- Modern UI with **React + Tailwind CSS**
- **Responsive** for both desktop and mobile
- Smooth transitions using **Framer Motion**
- **RESTful APIs** between frontend and backend
- **JWT Authentication** for secure sessions
- Optimized code structure with modular design

---

## 🧰 Tech Stack

### 🖥️ Frontend

- React.js
- Tailwind CSS
- Axios
- Framer Motion
- React Hot Toast

### ⚙️ Backend

- Java Spring Boot
- Spring Security + JWT
- Spring Data JPA
- Lombok

### 🗄️ Database

- Microsoft SQL Server

### 🔗 Integrations

- Stripe – Secure online payments
- Twilio – OTP verification
- Google OAuth 2.0 – Login with Google

---

## 🏗️ Architecture Overview

NeoKart follows an **N-tier architecture** with clear separation of concerns:

1. **Frontend (React.js)** – User Interface
2. **Backend (Spring Boot)** – API & Business Logic
3. **Database (SQL Server)** – Persistent Data Storage
4. **External Services** – Stripe, Twilio, Google OAuth

---

## ⚙️ Installation & Setup

### 🧩 Prerequisites

Make sure you have the following installed:

- Node.js & npm
- Java 17+
- Maven
- MS SQL Server
  
 🖥️ Frontend Setup
 # Navigate to frontend folder
cd neokart-frontend

# Install dependencies
npm install

# Run development server
npm start
