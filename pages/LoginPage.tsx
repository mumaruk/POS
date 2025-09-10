
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { Zap } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.Cashier);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      login(name, role);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bolt-dark p-4">
      <div className="absolute inset-0 bg-grid-bolt-dark-3/[0.2] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <Card className="w-full max-w-sm z-10">
        <div className="flex flex-col items-center mb-8">
          <Zap className="text-bolt-accent mb-2" size={48} />
          <h1 className="text-3xl font-black text-white">BOLT POS</h1>
          <p className="text-bolt-gray">Sign in to continue</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-bolt-light mb-2">
              Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-bolt-light mb-2">
              Role
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole(UserRole.Cashier)}
                className={`p-4 rounded-lg border-2 text-center transition-all ${
                  role === UserRole.Cashier ? 'border-bolt-accent bg-bolt-accent/10' : 'border-bolt-dark-3 hover:border-bolt-accent/50'
                }`}
              >
                Cashier
              </button>
              <button
                type="button"
                onClick={() => setRole(UserRole.Admin)}
                className={`p-4 rounded-lg border-2 text-center transition-all ${
                  role === UserRole.Admin ? 'border-bolt-accent bg-bolt-accent/10' : 'border-bolt-dark-3 hover:border-bolt-accent/50'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full !py-3 !text-base" disabled={!name.trim()}>
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
