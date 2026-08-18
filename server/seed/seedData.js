import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

dotenv.config();

const products = [
  {
    name: "Air Runner Pro",
    brand: "Nike",
    category: "running",
    description: "Lightweight running shoe with responsive cushioning for daily training.",
    price: 6999,
    discountPrice: 5999,
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"],
    sizes: [
      { size: 7, stock: 10 },
      { size: 8, stock: 15 },
      { size: 9, stock: 12 },
      { size: 10, stock: 8 },
    ],
    isFeatured: true,
  },
  {
    name: "UltraBoost Street",
    brand: "Adidas",
    category: "casual",
    description: "All-day comfort sneaker with boost midsole and knit upper.",
    price: 8999,
    discountPrice: 0,
    images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600"],
    sizes: [
      { size: 6, stock: 5 },
      { size: 7, stock: 9 },
      { size: 8, stock: 11 },
      { size: 9, stock: 7 },
    ],
    isFeatured: true,
  },
  {
    name: "Classic Oxford",
    brand: "Clarks",
    category: "formal",
    description: "Premium leather Oxford shoes, perfect for office and formal occasions.",
    price: 4999,
    discountPrice: 0,
    images: ["https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600"],
    sizes: [
      { size: 8, stock: 6 },
      { size: 9, stock: 8 },
      { size: 10, stock: 4 },
    ],
  },
  {
    name: "TrailBlaze GTX",
    brand: "Salomon",
    category: "sports",
    description: "Waterproof trail running shoe built for rugged terrain.",
    price: 10999,
    discountPrice: 9499,
    images: ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600"],
    sizes: [
      { size: 8, stock: 3 },
      { size: 9, stock: 6 },
      { size: 10, stock: 5 },
      { size: 11, stock: 2 },
    ],
    isFeatured: true,
  },
  {
    name: "Beach Slide Sandal",
    brand: "Puma",
    category: "sandals",
    description: "Comfortable slide sandals, ideal for casual summer wear.",
    price: 1499,
    discountPrice: 0,
    images: ["https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600"],
    sizes: [
      { size: 7, stock: 20 },
      { size: 8, stock: 18 },
      { size: 9, stock: 15 },
    ],
  },
  {
    name: "Timber Chukka Boot",
    brand: "Timberland",
    category: "boots",
    description: "Durable leather boots for outdoor and everyday wear.",
    price: 12999,
    discountPrice: 10999,
    images: ["https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600"],
    sizes: [
      { size: 8, stock: 4 },
      { size: 9, stock: 6 },
      { size: 10, stock: 3 },
    ],
  },
];

const seed = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Cart.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const admin = await User.create({
      name: "Admin User",
      email: "admin@shoestore.com",
      password: "admin123",
      role: "admin",
    });

    const demoUser = await User.create({
      name: "Demo User",
      email: "user@shoestore.com",
      password: "user1234",
      role: "user",
      addresses: [
        {
          fullName: "Demo User",
          phone: "9999999999",
          line1: "123 MG Road",
          city: "Bengaluru",
          state: "Karnataka",
          postalCode: "560001",
          country: "India",
          isDefault: true,
        },
      ],
    });

    await Product.insertMany(products);

    console.log("✅ Seed data inserted successfully");
    console.log(`Admin login: ${admin.email} / admin123`);
    console.log(`Demo user login: ${demoUser.email} / user1234`);
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seed();
