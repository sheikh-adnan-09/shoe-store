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
    description:
      "Lightweight running shoes for daily training and comfortable long-distance runs.",
    price: 6999,
    discountPrice: 5999,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&h=1600&q=90",
    ],
    sizes: [
      { size: 7, stock: 10 },
      { size: 8, stock: 15 },
      { size: 9, stock: 12 },
      { size: 10, stock: 8 },
    ],
    isFeatured: true,
  },
  {
    name: "StreetFlex Sneakers",
    brand: "Adidas",
    category: "casual",
    description:
      "Versatile everyday sneakers with a modern design for casual outfits.",
    price: 5999,
    discountPrice: 4499,
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1600&h=1600&q=90",
    ],
    sizes: [
      { size: 6, stock: 8 },
      { size: 7, stock: 12 },
      { size: 8, stock: 14 },
      { size: 9, stock: 9 },
    ],
    isFeatured: true,
  },
  {
    name: "Executive Oxford",
    brand: "Clarks",
    category: "formal",
    description:
      "Elegant lace-up shoes suitable for office wear and formal occasions.",
    price: 4999,
    discountPrice: 3999,
    images: [
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1600&h=1600&q=90",
    ],
    sizes: [
      { size: 7, stock: 5 },
      { size: 8, stock: 8 },
      { size: 9, stock: 10 },
      { size: 10, stock: 6 },
    ],
  },
  {
    name: "Mountain Trail Shoes",
    brand: "Salomon",
    category: "sports",
    description:
      "Outdoor-inspired shoes designed for hiking trails and rugged adventures.",
    price: 10999,
    discountPrice: 9499,
    images: [
      "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1600&h=1600&q=90",
    ],
    sizes: [
      { size: 7, stock: 4 },
      { size: 8, stock: 7 },
      { size: 9, stock: 6 },
      { size: 10, stock: 3 },
    ],
    isFeatured: true,
  },
  {
    name: "Beach Slide Sandal",
    brand: "Puma",
    category: "sandals",
    description:
      "Comfortable slide sandals for casual summer wear and everyday use.",
    price: 1499,
    discountPrice: 999,
    images: [
      "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=1600&h=1600&q=90",
    ],
    sizes: [
      { size: 7, stock: 20 },
      { size: 8, stock: 18 },
      { size: 9, stock: 15 },
      { size: 10, stock: 10 },
    ],
  },
  {
    name: "Urban Chukka Boots",
    brand: "Timberland",
    category: "boots",
    description:
      "Rugged ankle boots for casual outfits and outdoor-inspired styling.",
    price: 12999,
    discountPrice: 10999,
    images: [
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=1600&h=1600&q=90",
    ],
    sizes: [
      { size: 7, stock: 4 },
      { size: 8, stock: 6 },
      { size: 9, stock: 5 },
      { size: 10, stock: 3 },
    ],
  },
  {
    name: "Classic Canvas Low",
    brand: "Converse",
    category: "casual",
    description:
      "Canvas-style low-top sneakers for everyday outfits and weekend outings.",
    price: 3499,
    discountPrice: 2799,
    images: [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1600&h=1600&q=90",
    ],
    sizes: [
      { size: 6, stock: 8 },
      { size: 7, stock: 10 },
      { size: 8, stock: 12 },
      { size: 9, stock: 7 },
    ],
  },
  {
    name: "Court Classic Sneakers",
    brand: "Reebok",
    category: "casual",
    description:
      "Clean court-inspired sneakers for jeans, casual clothing, and daily wear.",
    price: 3999,
    discountPrice: 3199,
    images: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1600&h=1600&q=90",
    ],
    sizes: [
      { size: 6, stock: 7 },
      { size: 7, stock: 11 },
      { size: 8, stock: 13 },
      { size: 9, stock: 8 },
    ],
  },
  {
    name: "Performance Trainers",
    brand: "Asics",
    category: "running",
    description:
      "Sporty trainers designed for running, walking, and regular workouts.",
    price: 7499,
    discountPrice: 6299,
    images: [
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1600&h=1600&q=90",
    ],
    sizes: [
      { size: 7, stock: 9 },
      { size: 8, stock: 14 },
      { size: 9, stock: 11 },
      { size: 10, stock: 6 },
    ],
  },
  {
    name: "Retro Lifestyle Sneakers",
    brand: "New Balance",
    category: "casual",
    description: "Retro-inspired everyday sneakers with a sporty silhouette.",
    price: 7999,
    discountPrice: 6799,
    images: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1600&h=1600&q=90",
    ],
    sizes: [
      { size: 7, stock: 6 },
      { size: 8, stock: 10 },
      { size: 9, stock: 12 },
      { size: 10, stock: 5 },
    ],
    isFeatured: true,
  },
  {
    name: "Smart Derby Shoes",
    brand: "Clarks",
    category: "formal",
    description:
      "Classic derby-style footwear for business meetings and formal events.",
    price: 5499,
    discountPrice: 4599,
    images: [
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1600&h=1600&q=90",
    ],
    sizes: [
      { size: 7, stock: 6 },
      { size: 8, stock: 9 },
      { size: 9, stock: 8 },
      { size: 10, stock: 4 },
    ],
  },
  {
    name: "Lightweight Knit Trainers",
    brand: "Skechers",
    category: "sports",
    description:
      "Flexible trainer-style footwear for walking and everyday fitness.",
    price: 4999,
    discountPrice: 3999,
    images: [
      "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=1600&h=1600&q=90",
    ],
    sizes: [
      { size: 7, stock: 8 },
      { size: 8, stock: 12 },
      { size: 9, stock: 10 },
      { size: 10, stock: 6 },
    ],
  },
  {
    name: "Comfort Flip-Flops",
    brand: "Generic",
    category: "sandals",
    description:
      "Simple lightweight flip-flops for holidays and relaxed everyday wear.",
    price: 799,
    discountPrice: 599,
    images: [
      "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=1600&h=1600&q=90",
    ],
    sizes: [
      { size: 7, stock: 16 },
      { size: 8, stock: 20 },
      { size: 9, stock: 14 },
      { size: 10, stock: 9 },
    ],
  },
  {
    name: "Outdoor Leather Boots",
    brand: "Woodland",
    category: "boots",
    description:
      "Sturdy outdoor-inspired boots for everyday adventures and casual styling.",
    price: 4999,
    discountPrice: 4199,
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1600&h=1600&q=90",
    ],
    sizes: [
      { size: 7, stock: 4 },
      { size: 8, stock: 7 },
      { size: 9, stock: 5 },
      { size: 10, stock: 3 },
    ],
  },
  {
    name: "Minimal White Sneakers",
    brand: "Adidas",
    category: "casual",
    description:
      "Minimal low-top sneakers that pair easily with everyday outfits.",
    price: 4499,
    discountPrice: 3599,
    images: [
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1600&h=1600&q=90",
    ],
    sizes: [
      { size: 6, stock: 9 },
      { size: 7, stock: 13 },
      { size: 8, stock: 15 },
      { size: 9, stock: 7 },
    ],
  },
  {
    name: "Gym Training Shoes",
    brand: "Nike",
    category: "sports",
    description:
      "Athletic training shoes for gym sessions and general fitness routines.",
    price: 6499,
    discountPrice: 5299,
    images: [
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1600&h=1600&q=90",
    ],
    sizes: [
      { size: 7, stock: 7 },
      { size: 8, stock: 12 },
      { size: 9, stock: 9 },
      { size: 10, stock: 5 },
    ],
  },
  {
    name: "Classic Leather Loafers",
    brand: "Generic",
    category: "formal",
    description:
      "Slip-on loafers for smart casual outfits, office wear, and dinners.",
    price: 4299,
    discountPrice: 3499,
    images: [
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&w=1600&h=1600&q=90",
    ],
    sizes: [
      { size: 7, stock: 5 },
      { size: 8, stock: 8 },
      { size: 9, stock: 7 },
      { size: 10, stock: 4 },
    ],
  },
  {
    name: "Street Style Sneakers",
    brand: "Puma",
    category: "casual",
    description:
      "Bold streetwear-inspired sneakers for casual and everyday styling.",
    price: 3999,
    discountPrice: 2999,
    images: [
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=1600&h=1600&q=90",
    ],
    sizes: [
      { size: 6, stock: 6 },
      { size: 7, stock: 10 },
      { size: 8, stock: 11 },
      { size: 9, stock: 8 },
    ],
  },
  {
    name: "Road Running Shoes",
    brand: "Asics",
    category: "running",
    description:
      "Comfort-focused running shoes for road jogging and daily fitness.",
    price: 5799,
    discountPrice: 4699,
    images: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1600&h=1600&q=90",
    ],
    sizes: [
      { size: 7, stock: 8 },
      { size: 8, stock: 11 },
      { size: 9, stock: 10 },
      { size: 10, stock: 6 },
    ],
  },
  {
    name: "Adventure Hiking Boots",
    brand: "Generic",
    category: "boots",
    description:
      "Outdoor-inspired hiking boots for exploring trails and weekend adventures.",
    price: 4599,
    discountPrice: 3799,
    images: [
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1600&h=1600&q=90",
    ],
    sizes: [
      { size: 7, stock: 4 },
      { size: 8, stock: 7 },
      { size: 9, stock: 5 },
      { size: 10, stock: 3 },
    ],
    isFeatured: true,
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
