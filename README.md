# shoe-store

A full‑stack e‑commerce web app built with the MERN stack. Features include product browsing, shopping cart, user authentication, and order management. Designed with a responsive UI and scalable backend to demonstrate practical skills in modern web development.

# StepUp — Full-Stack MERN Shoe Store

A complete, real-world e-commerce project built with MongoDB, Express, React, and Node.js.

Deployment : Frontend-Vercel, Backend-Render and Database-MongoDB Atlas.

Live On Vercel : https://shoe-store-alpha-eight.vercel.app/

## Features

**Customer-facing**

- Product browsing with search, category/brand filters, sorting, pagination
- Product detail pages with size-based stock, quantity selector, and reviews/ratings
- User registration & login (JWT auth), forgot/reset password, profile editing, change password
- Persistent server-side cart (add/update/remove/clear)
- Address book (multiple addresses, set default)
- Multi-step checkout: address selection → payment method → payment
- Stripe card payments (via Stripe Elements) and Cash on Delivery
- Order history and detailed order tracking with status (pending → processing → shipped → delivered)

**Admin panel** (role-protected)

- Dashboard: revenue, order counts, recent orders, low-stock alerts
- Product management: create/edit/delete, manage sizes & stock per size
- Order management: view all orders, update status (auto-restocks on cancellation)
- User management: view all users, promote/demote admin role, block/unblock accounts

**Real-world engineering details**

- JWT auth with bcrypt password hashing
- Role-based middleware (`protect`, `admin`)
- Stripe **webhook** as the source of truth for payment confirmation (never trusts the frontend alone)
- Stock re-validated at checkout time, decremented on order, restocked on cancellation
- Centralized error handling, rate limiting on auth routes, helmet + CORS
- Order line items are snapshotted (name/price/image at time of purchase), not live references

## Project Structure

```
shoe-store/
├── server/          # Express API
│   ├── config/       # MongoDB connection
│   ├── models/       # User, Product, Cart, Order (Mongoose)
│   ├── middleware/    # auth (JWT + role check), error handling
│   ├── controllers/   # business logic per resource
│   ├── routes/        # Express routers
│   ├── seed/          # sample data seeder
│   └── server.js       # app entry point
└── client/          # React (Vite) app
    └── src/
        ├── api/         # axios instance
        ├── context/     # Auth & Cart React context
        ├── components/  # Navbar, ProductCard, route guards, Stripe form
        └── pages/       # all pages incl. admin/
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- MongoDB running locally, or a free MongoDB Atlas cluster
- A free Stripe account (test mode) — only needed for card payments; COD works without it

### 1. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env`:

- `MONGO_URI` — your local or Atlas connection string
- `JWT_SECRET` — any long random string
- `STRIPE_SECRET_KEY` — from your Stripe dashboard (test mode key starts with `sk_test_`)
- `STRIPE_WEBHOOK_SECRET` — see the Stripe webhook section below

Seed the database with sample products and demo accounts:

```bash
npm run seed
```

Start the server:

```bash
npm run dev
```

API runs on `http://localhost:5000`.

### 2. Frontend setup

```bash
cd client
npm install
cp .env.example .env
```

Edit `.env` and add your Stripe **publishable** key (`pk_test_...`).

Start the dev server:

```bash
npm run dev
```

App runs on `http://localhost:5173` (Vite proxies `/api` calls to the backend automatically — see `vite.config.js`).

### 3. Stripe webhook (for card payments to be marked "paid")

Online Payment is yet pending to be implemented, like we can use RazorPay for payment...

If you skip Online Payment setup entirely, **Cash on Delivery still works end-to-end** without any configuration.

## Suggested Next Steps (for going further)

- Add product image upload (Cloudinary/S3) instead of pasting image URLs in the admin form
- Add email notifications (order confirmation, password reset) via Nodemailer + a transactional email service
- Add a wishlist feature
- Add order invoice PDF generation
- Deploy: backend to Render/Railway, frontend to Vercel/Netlify, database on MongoDB Atlas
- Add automated tests (Jest + Supertest for API, React Testing Library for frontend)

## Tech Stack

- **Frontend:** React 18, React Router, Tailwind CSS, Axios, Stripe Elements, React Toastify
- **Backend:** Express, Mongoose, JWT, bcryptjs, Stripe SDK, Helmet, express-rate-limit
- **Database:** MongoDB
