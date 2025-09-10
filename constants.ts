
import { Product, Sale } from "./types";

export const MOCK_PRODUCTS: Product[] = [
  { id: 'prod-1', name: 'Nitro Cold Brew', category: 'Coffee', price: 5.50, stock: 30, imageUrl: 'https://picsum.photos/seed/coffee1/400/300' },
  { id: 'prod-2', name: 'Iced Matcha Latte', category: 'Tea', price: 6.00, stock: 25, imageUrl: 'https://picsum.photos/seed/tea1/400/300' },
  { id: 'prod-3', name: 'Croissant', category: 'Pastry', price: 3.75, stock: 40, imageUrl: 'https://picsum.photos/seed/pastry1/400/300' },
  { id: 'prod-4', name: 'Espresso', category: 'Coffee', price: 3.00, stock: 100, imageUrl: 'https://picsum.photos/seed/coffee2/400/300' },
  { id: 'prod-5', name: 'Avocado Toast', category: 'Food', price: 8.50, stock: 15, imageUrl: 'https://picsum.photos/seed/food1/400/300' },
  { id: 'prod-6', name: 'Blueberry Muffin', category: 'Pastry', price: 3.50, stock: 5, imageUrl: 'https://picsum.photos/seed/pastry2/400/300' },
  { id: 'prod-7', name: 'Chai Latte', category: 'Tea', price: 5.25, stock: 30, imageUrl: 'https://picsum.photos/seed/tea2/400/300' },
  { id: 'prod-8', name: 'Bottled Water', category: 'Drinks', price: 2.00, stock: 50, imageUrl: 'https://picsum.photos/seed/water/400/300' },
];

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);

export const MOCK_SALES: Sale[] = [
    { id: 'sale-1', items: [{...MOCK_PRODUCTS[0], quantity: 2}, {...MOCK_PRODUCTS[2], quantity: 1}], total: 14.75, date: today.toISOString(), cashierId: 'user-1' },
    { id: 'sale-2', items: [{...MOCK_PRODUCTS[1], quantity: 1}], total: 6.00, date: today.toISOString(), cashierId: 'user-1' },
    { id: 'sale-3', items: [{...MOCK_PRODUCTS[4], quantity: 1}, {...MOCK_PRODUCTS[3], quantity: 1}], total: 11.50, date: yesterday.toISOString(), cashierId: 'user-1' },
    { id: 'sale-4', items: [{...MOCK_PRODUCTS[6], quantity: 2}], total: 10.50, date: yesterday.toISOString(), cashierId: 'user-1' },
    { id: 'sale-5', items: [{...MOCK_PRODUCTS[5], quantity: 5}], total: 17.50, date: lastWeek.toISOString(), cashierId: 'user-1' },
    { id: 'sale-6', items: [{...MOCK_PRODUCTS[0], quantity: 3}, {...MOCK_PRODUCTS[2], quantity: 2}], total: 24.00, date: lastWeek.toISOString(), cashierId: 'user-1' },
];
