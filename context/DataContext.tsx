
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Product, Sale, CartItem } from '../types';
import { MOCK_PRODUCTS, MOCK_SALES } from '../constants';

interface DataContextType {
  products: Product[];
  sales: Sale[];
  addProduct: (product: Omit<Product, 'id' | 'imageUrl'>) => void;
  updateProduct: (updatedProduct: Product) => void;
  deleteProduct: (productId: string) => void;
  processSale: (cart: CartItem[], cashierId: string) => void;
  getProductById: (productId: string) => Product | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [sales, setSales] = useState<Sale[]>(MOCK_SALES);

  const addProduct = (productData: Omit<Product, 'id' | 'imageUrl'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      imageUrl: `https://picsum.photos/seed/${Date.now()}/400/300`,
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev =>
      prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const processSale = (cart: CartItem[], cashierId: string) => {
    // Update stock
    setProducts(prevProducts => {
      const newProducts = [...prevProducts];
      cart.forEach(cartItem => {
        const productIndex = newProducts.findIndex(p => p.id === cartItem.id);
        if (productIndex !== -1) {
          newProducts[productIndex].stock -= cartItem.quantity;
        }
      });
      return newProducts;
    });

    // Create new sale record
    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      items: cart,
      total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
      date: new Date().toISOString(),
      cashierId,
    };
    setSales(prevSales => [...prevSales, newSale]);
  };

  const getProductById = (productId: string) => {
    return products.find(p => p.id === productId);
  }

  return (
    <DataContext.Provider value={{ products, sales, addProduct, updateProduct, deleteProduct, processSale, getProductById }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
