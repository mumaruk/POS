
import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { CartItem, Product } from '../types';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Search, Plus, Minus, X, Printer } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


const Receipt: React.FC<{ cart: CartItem[]; total: number; onDone: () => void }> = ({ cart, total, onDone }) => {
    const receiptRef = React.useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        if (receiptRef.current) {
            html2canvas(receiptRef.current, { backgroundColor: '#13151A' }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                const imgProps= pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save("receipt.pdf");
            });
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-bolt-dark-2 border border-bolt-dark-3 rounded-2xl shadow-lg w-full max-w-sm">
                <div ref={receiptRef} className="p-6 text-bolt-light">
                    <h2 className="text-2xl font-bold text-center mb-4">Receipt</h2>
                    <p className="text-center text-sm text-bolt-gray mb-6">Date: {new Date().toLocaleString()}</p>
                    <div className="space-y-2 border-t border-b border-dashed border-bolt-dark-3 py-4">
                        {cart.map(item => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span>{item.name} x{item.quantity}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between font-bold text-xl mt-4">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>
                <div className="p-4 flex gap-4">
                    <Button onClick={handlePrint} className="w-full flex justify-center items-center gap-2" variant="secondary"><Printer size={16}/>Print/Download</Button>
                    <Button onClick={onDone} className="w-full">Done</Button>
                </div>
            </div>
        </div>
    );
};


const DashboardPage: React.FC = () => {
  const { products, processSale } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showReceipt, setShowReceipt] = useState(false);

  const filteredProducts = useMemo(() =>
    products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [products, searchTerm]
  );

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, amount: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
      ).filter(item => item.quantity > 0)
    );
  };
  
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const cartTotal = useMemo(() =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  );

  const handleCheckout = () => {
    if (cart.length > 0 && user) {
      processSale(cart, user.id);
      setShowReceipt(true);
    }
  };

  const handleDone = () => {
    setCart([]);
    setShowReceipt(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-4rem)]">
      {showReceipt && <Receipt cart={cart} total={cartTotal} onDone={handleDone} />}
      <div className="lg:col-span-2 flex flex-col">
        <h1 className="text-3xl font-bold mb-6">New Sale</h1>
        <div className="relative mb-6">
          <Input
            type="text"
            placeholder="Search products..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-bolt-gray" size={20} />
        </div>
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                onClick={() => product.stock > 0 && addToCart(product)}
                className={`relative p-4 bg-bolt-dark-2 rounded-xl border border-bolt-dark-3 cursor-pointer transition-transform transform hover:-translate-y-1 ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <img src={product.imageUrl} alt={product.name} className="w-full h-32 object-cover rounded-lg mb-4" />
                <h3 className="font-semibold text-sm">{product.name}</h3>
                <p className="text-bolt-accent font-bold">${product.price.toFixed(2)}</p>
                <p className={`text-xs ${product.stock > 10 ? 'text-bolt-gray' : 'text-red-500'}`}>{product.stock} in stock</p>
                {product.stock === 0 && <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl"><span className="font-bold text-white">OUT OF STOCK</span></div>}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Card className="flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Cart</h2>
        <div className="flex-1 overflow-y-auto -mr-4 pr-4 space-y-4">
            {cart.length === 0 ? (
                <p className="text-bolt-gray text-center mt-8">Cart is empty</p>
            ) : (
                cart.map(item => (
                    <div key={item.id} className="flex items-center gap-4">
                        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md"/>
                        <div className="flex-1">
                            <p className="font-semibold text-sm">{item.name}</p>
                            <p className="text-xs text-bolt-gray">${item.price.toFixed(2)}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <button onClick={() => updateQuantity(item.id, -1)} className="p-1 rounded-full bg-bolt-dark-3"><Minus size={12}/></button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} className="p-1 rounded-full bg-bolt-dark-3"><Plus size={12}/></button>
                            </div>
                        </div>
                        <div className="text-right">
                           <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                           <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-400 mt-1"><X size={16}/></button>
                        </div>
                    </div>
                ))
            )}
        </div>
        <div className="mt-auto pt-6 border-t border-bolt-dark-3">
          <div className="flex justify-between font-bold text-2xl">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <Button onClick={handleCheckout} disabled={cart.length === 0} className="w-full mt-4 !py-3 !text-base">
            Checkout
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
