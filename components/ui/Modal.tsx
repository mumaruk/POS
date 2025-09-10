
import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-bolt-dark-2 border border-bolt-dark-3 rounded-2xl shadow-lg w-full max-w-md m-4 relative animate-fade-in-up">
        <div className="flex justify-between items-center p-4 border-b border-bolt-dark-3">
          <h2 className="text-xl font-bold text-bolt-light">{title}</h2>
          <button onClick={onClose} className="text-bolt-gray hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
