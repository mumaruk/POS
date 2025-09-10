
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { LayoutDashboard, Package, BarChart3, BrainCircuit, LogOut, Zap } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', icon: LayoutDashboard, text: 'Dashboard', roles: [UserRole.Admin, UserRole.Cashier] },
    { to: '/inventory', icon: Package, text: 'Inventory', roles: [UserRole.Admin] },
    { to: '/reports', icon: BarChart3, text: 'Reports', roles: [UserRole.Admin] },
    { to: '/ai-insights', icon: BrainCircuit, text: 'AI Insights', roles: [UserRole.Admin] },
  ];

  return (
    <aside className="w-64 bg-bolt-dark-2 flex flex-col p-4 border-r border-bolt-dark-3">
      <div className="flex items-center gap-2 mb-10 p-2">
        <Zap className="text-bolt-accent" size={32} />
        <h1 className="text-2xl font-black text-white">BOLT POS</h1>
      </div>
      <nav className="flex-1 flex flex-col gap-2">
        {navLinks.filter(link => link.roles.includes(user!.role)).map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-bolt-light hover:bg-bolt-dark-3 ${
                isActive ? 'bg-bolt-accent text-white shadow-lg' : ''
              }`
            }
          >
            <link.icon size={20} />
            <span className="font-semibold">{link.text}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto">
        <div className="p-3 mb-4 border-t border-bolt-dark-3">
            <p className="text-sm font-semibold text-white">{user?.name}</p>
            <p className="text-xs text-bolt-gray">{user?.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-bolt-light hover:bg-red-600/20 hover:text-red-400 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-semibold">Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
