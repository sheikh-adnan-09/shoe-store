import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

dotenv.config();

const products = [
  {
    name: "Velocity Runner",
    brand: "Nike",
    category: "running",
    description:
      "Lightweight running shoes designed for everyday training and comfortable long-distance runs.",
    price: 6999,
    discountPrice: 5499,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=90",
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
      "Modern everyday sneakers with a versatile silhouette for casual outfits and city walks.",
    price: 5999,
    discountPrice: 4499,
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1600&q=90",
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
      "Classic lace-up formal shoes with an elegant design for office wear and special occasions.",
    price: 4999,
    discountPrice: 3999,
    images: [
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1600&q=90",
    ],
    sizes: [
      { size: 7, stock: 5 },
      { size: 8, stock: 8 },
      { size: 9, stock: 10 },
      { size: 10, stock: 6 },
    ],
  },
  {
    name: "Mountain Trail Pro",
    brand: "Salomon",
    category: "sports",
    description:
      "Rugged outdoor-inspired footwear for trail adventures and active weekends.",
    price: 10999,
    discountPrice: 9499,
    images: [
      "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1600&q=90",
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
      "Easy-to-wear slide sandals for relaxed summer days and everyday comfort.",
    price: 1499,
    discountPrice: 999,
    images: [
      "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=1600&q=90",
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
      "Timeless ankle-high boots with a rugged-inspired look for everyday outfits.",
    price: 12999,
    discountPrice: 10999,
    images: [
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=1600&q=90",
    ],
    sizes: [
      { size: 7, stock: 4 },
      { size: 8, stock: 6 },
      { size: 9, stock: 5 },
      { size: 10, stock: 3 },
    ],
    isFeatured: true,
  },
  {
    name: "Classic Canvas Low",
    brand: "Converse",
    category: "casual",
    description:
      "Versatile canvas-style low-top sneakers for casual wear and weekend outings.",
    price: 3499,
    discountPrice: 2799,
    images: [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1600&q=90",
    ],
    sizes: [
      { size: 6, stock: 8 },
      { size: 7, stock: 10 },
      { size: 8, stock: 12 },
      { size: 9, stock: 7 },
    ],
  },
  {
    name: "Court Classic White",
    brand: "Reebok",
    category: "casual",
    description:
      "Clean court-inspired sneakers that pair effortlessly with jeans and everyday clothing.",
    price: 3999,
    discountPrice: 3199,
    images: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1600&q=90",
    ],
    sizes: [
      { size: 6, stock: 7 },
      { size: 7, stock: 11 },
      { size: 8, stock: 13 },
      { size: 9, stock: 8 },
    ],
    isFeatured: true,
  },
  {
    name: "Sprint Performance",
    brand: "Asics",
    category: "running",
    description:
      "Sporty running shoes with a cushioned design for regular workouts and daily movement.",
    price: 7499,
    discountPrice: 6299,
    images: [
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1600&q=90",
    ],
    sizes: [
      { size: 7, stock: 9 },
      { size: 8, stock: 14 },
      { size: 9, stock: 11 },
      { size: 10, stock: 6 },
    ],
  },
  {
    name: "Retro Court Sneakers",
    brand: "New Balance",
    category: "casual",
    description:
      "Retro-inspired sneakers with a sporty profile for comfortable everyday styling.",
    price: 7999,
    discountPrice: 6799,
    images: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1600&q=90",
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
    name: "Premium Derby Shoes",
    brand: "Clarks",
    category: "formal",
    description:
      "Refined derby-style footwear for business meetings, formal events, and office outfits.",
    price: 5499,
    discountPrice: 4599,
    images: [
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1600&q=90",
    ],
    sizes: [
      { size: 7, stock: 6 },
      { size: 8, stock: 9 },
      { size: 9, stock: 8 },
      { size: 10, stock: 4 },
    ],
  },
  {
    name: "Active Knit Trainer",
    brand: "Skechers",
    category: "sports",
    description:
      "Flexible knit-style trainers for everyday walking, light workouts, and active lifestyles.",
    price: 4999,
    discountPrice: 3999,
    images: [
      "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=1600&q=90",
    ],
    sizes: [
      { size: 7, stock: 8 },
      { size: 8, stock: 12 },
      { size: 9, stock: 10 },
      { size: 10, stock: 6 },
    ],
  },
  {
    name: "Everyday Comfort Slides",
    brand: "Puma",
    category: "sandals",
    description:
      "Minimal open-toe slides designed for relaxed indoor and outdoor everyday wear.",
    price: 1299,
    discountPrice: 899,
    images: [
      "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=1600&q=90",
    ],
    sizes: [
      { size: 7, stock: 16 },
      { size: 8, stock: 20 },
      { size: 9, stock: 14 },
      { size: 10, stock: 9 },
    ],
  },
  {
    name: "Heritage Leather Boots",
    brand: "Timberland",
    category: "boots",
    description:
      "Classic outdoor-inspired boots with a sturdy silhouette for casual styling.",
    price: 11999,
    discountPrice: 9999,
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1600&q=90",
    ],
    sizes: [
      { size: 7, stock: 3 },
      { size: 8, stock: 5 },
      { size: 9, stock: 6 },
      { size: 10, stock: 4 },
    ],
  },
  {
    name: "Minimal White Low-Tops",
    brand: "Adidas",
    category: "casual",
    description:
      "Simple low-top sneakers with a clean aesthetic for everyday casual outfits.",
    price: 4499,
    discountPrice: 3599,
    images: [
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1600&q=90",
    ],
    sizes: [
      { size: 6, stock: 9 },
      { size: 7, stock: 13 },
      { size: 8, stock: 15 },
      { size: 9, stock: 7 },
    ],
    isFeatured: true,
  },
  {
    name: "Gym Training Pro",
    brand: "Nike",
    category: "sports",
    description:
      "Training-inspired athletic shoes for gym sessions and everyday exercise routines.",
    price: 6499,
    discountPrice: 5299,
    images: [
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1600&q=90",
    ],
    sizes: [
      { size: 7, stock: 7 },
      { size: 8, stock: 12 },
      { size: 9, stock: 9 },
      { size: 10, stock: 5 },
    ],
  },
  {
    name: "Smart Office Loafers",
    brand: "Clarks",
    category: "formal",
    description:
      "Slip-on loafer-inspired shoes for office wear, dinners, and smart casual occasions.",
    price: 4299,
    discountPrice: 3499,
    images: [
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1600&q=90",
    ],
    sizes: [
      { size: 7, stock: 5 },
      { size: 8, stock: 8 },
      { size: 9, stock: 7 },
      { size: 10, stock: 4 },
    ],
  },
  {
    name: "Color Pop Street Sneakers",
    brand: "Puma",
    category: "casual",
    description:
      "Bold sporty sneakers with a colorful look for modern streetwear outfits.",
    price: 3999,
    discountPrice: 2999,
    images: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1600&q=90",
    ],
    sizes: [
      { size: 6, stock: 6 },
      { size: 7, stock: 10 },
      { size: 8, stock: 11 },
      { size: 9, stock: 8 },
    ],
  },
  {
    name: "Lightweight Jogging Shoes",
    brand: "Asics",
    category: "running",
    description:
      "Lightweight athletic footwear for jogging, walking, and regular fitness activities.",
    price: 5799,
    discountPrice: 4699,
    images: [
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1600&q=90",
    ],
    sizes: [
      { size: 7, stock: 8 },
      { size: 8, stock: 11 },
      { size: 9, stock: 10 },
      { size: 10, stock: 6 },
    ],
  },
  {
    name: "Weekend Adventure Boots",
    brand: "Woodland",
    category: "boots",
    description:
      "Rugged casual boot-inspired footwear for weekend outings and outdoor-inspired looks.",
    price: 4999,
    discountPrice: 4199,
    images: [
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=1600&q=90",
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
