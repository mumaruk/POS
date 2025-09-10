
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Product } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { Plus, Edit, Trash2 } from 'lucide-react';

const ProductForm: React.FC<{ product?: Product; onSave: (product: Omit<Product, 'id' | 'imageUrl'> | Product) => void; onCancel: () => void; }> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(product ? { ...product, ...formData } : formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
      <Input name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
      <Input name="price" type="number" step="0.01" placeholder="Price" value={formData.price} onChange={handleChange} required />
      <Input name="stock" type="number" placeholder="Stock" value={formData.stock} onChange={handleChange} required />
      <div className="flex justify-end gap-4">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}

const InventoryPage: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  const openAddModal = () => {
    setEditingProduct(undefined);
    setIsModalOpen(true);
  };
  
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(undefined);
  };

  const handleSave = (productData: Omit<Product, 'id' | 'imageUrl'> | Product) => {
    if ('id' in productData) {
      updateProduct(productData);
    } else {
      addProduct(productData);
    }
    closeModal();
  };
  
  const handleDelete = (productId: string) => {
    if(window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <Button onClick={openAddModal} className="flex items-center gap-2">
          <Plus size={20} /> Add Product
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <Card key={product.id} className="flex flex-col">
            <div className="relative">
              <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-4" />
              {product.stock <= 10 && (
                <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Low Stock
                </div>
              )}
            </div>
            <h2 className="text-lg font-bold">{product.name}</h2>
            <p className="text-bolt-gray text-sm mb-2">{product.category}</p>
            <div className="flex justify-between items-center mt-auto pt-4">
                <div>
                    <p className="font-bold text-xl text-bolt-accent">${product.price.toFixed(2)}</p>
                    <p className="text-sm">{product.stock} units</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => openEditModal(product)} className="p-2 rounded-md bg-bolt-dark-3 hover:bg-bolt-accent transition-colors"><Edit size={16}/></button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 rounded-md bg-bolt-dark-3 hover:bg-red-600 transition-colors"><Trash2 size={16}/></button>
                </div>
            </div>
          </Card>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingProduct ? 'Edit Product' : 'Add New Product'}>
        <ProductForm product={editingProduct} onSave={handleSave} onCancel={closeModal} />
      </Modal>
    </>
  );
};

export default InventoryPage;
