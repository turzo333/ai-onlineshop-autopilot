import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="max-w-lg mx-auto text-center py-12">
      <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Order Placed Successfully!
      </h1>
      <p className="text-gray-600 mb-8">
        Thank you for your order. We'll send you a confirmation email with your order details.
      </p>
      <button
        onClick={() => navigate('/')}
        className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
      >
        Continue Shopping
      </button>
    </div>
  );
}