<<<<<<< HEAD

# StepUp — Full-Stack MERN Shoe Store

A complete, real-world e-commerce project built with MongoDB, Express, React, and Node.js.

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

=======

# shoe-store

A full‑stack e‑commerce web app built with the MERN stack. Features include product browsing, shopping cart, user authentication, and order management. Designed with a responsive UI and scalable backend to demonstrate practical skills in modern web development.

> > > > > > > 9b672b6fd78dd906debe516048c49464f529a761
