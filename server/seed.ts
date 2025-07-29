import { db } from './db';
import { products } from './db/schema';

const sampleProducts = [
  {
    name: "Premium Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 199.99,
    category: "Electronics",
    image: "https://img.heroui.chat/image/fashion?w=300&h=300&u=headphones1",
    stock: 15,
    isAvailable: true
  },
  {
    name: "Wireless Keyboard",
    description: "Compact wireless keyboard with backlight",
    price: 79.99,
    category: "Electronics",
    image: "https://img.heroui.chat/image/fashion?w=300&h=300&u=keyboard1",
    stock: 8,
    isAvailable: true
  },
  {
    name: "Summer T-Shirt",
    description: "Comfortable cotton t-shirt for summer",
    price: 24.99,
    category: "Clothing",
    image: "https://img.heroui.chat/image/clothing?w=300&h=300&u=tshirt1",
    stock: 20,
    isAvailable: true
  },
  {
    name: "Running Shoes",
    description: "Lightweight running shoes with excellent grip",
    price: 89.99,
    category: "Footwear",
    image: "https://img.heroui.chat/image/shoes?w=300&h=300&u=shoes1",
    stock: 12,
    isAvailable: true
  },
  {
    name: "Coffee Maker",
    description: "Automatic coffee maker with timer",
    price: 129.99,
    category: "Home",
    image: "https://img.heroui.chat/image/furniture?w=300&h=300&u=coffee1",
    stock: 5,
    isAvailable: true
  },
  {
    name: "Winter Jacket",
    description: "Warm winter jacket with waterproof material",
    price: 149.99,
    category: "Clothing",
    image: "https://img.heroui.chat/image/clothing?w=300&h=300&u=jacket1",
    stock: 7,
    isAvailable: true
  },
];

async function seed() {
  console.log('🌱 Seeding database...');
  
  // Clear existing products
  await db.delete(products);
  
  // Insert sample products
  await db.insert(products).values(sampleProducts);
  
  console.log('✅ Database seeded successfully!');
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
}); 