import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, MapPin, Calendar, Package } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { CustomerProfile, Order, OrderItem } from '../../lib/types';
import { cn } from '../../lib/utils';

interface CustomerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
}

interface ExtendedOrder extends Order {
  items: OrderItem[];
}

export default function CustomerProfileModal({ isOpen, onClose, customerId }: CustomerProfileModalProps) {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<ExtendedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'notes'>('overview');

  useEffect(() => {
    async function fetchCustomerData() {
      try {
        // Fetch customer profile
        const { data: customerData } = await supabase
          .from('customer_profiles')
          .select('*')
          .eq('id', customerId)
          .single();

        if (customerData) {
          setCustomer(customerData);
        }

        // Fetch customer orders
        const { data: ordersData } = await supabase
          .from('orders')
          .select(`
            *,
            items:order_items (
              *,
              product:products (*)
            )
          `)
          .eq('user_id', customerData.user_id)
          .order('created_at', { ascending: false });

        if (ordersData) {
          setOrders(ordersData as ExtendedOrder[]);
        }
      } catch (error) {
        console.error('Error fetching customer data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (isOpen && customerId) {
      fetchCustomerData();
    }
  }, [isOpen, customerId]);

  const handleUpdateNotes = async (notes: string) => {
    try {
      const { error } = await supabase
        .from('customer_profiles')
        .update({ notes })
        .eq('id', customerId);

      if (error) throw error;

      setCustomer(prev => prev ? { ...prev, notes } : null);
    } catch (error) {
      console.error('Error updating notes:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : customer ? (
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-1/3 bg-gray-50 p-6 border-r">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Customer Profile
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                    <span className="text-3xl font-bold text-emerald-600">
                      {customer.full_name?.charAt(0) || '?'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {customer.full_name}
                  </h3>
                  <span className={cn(
                    "inline-block px-2 py-1 rounded-full text-sm font-medium mt-2",
                    {
                      'bg-purple-100 text-purple-800': customer.segment === 'vip',
                      'bg-blue-100 text-blue-800': customer.segment === 'regular',
                      'bg-gray-100 text-gray-800': customer.segment === 'inactive'
                    }
                  )}>
                    {customer.segment?.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-5 w-5 mr-2" />
                    <span>{customer.user_id}</span>
                  </div>
                  {customer.phone && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-5 w-5 mr-2" />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                  {customer.address && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{customer.address}</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>Joined {new Date(customer.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Orders</span>
                    <span className="font-medium">{customer.total_orders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Spent</span>
                    <span className="font-medium">${customer.total_spent.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Order</span>
                    <span className="font-medium">
                      {customer.last_login ? new Date(customer.last_login).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              {/* Tabs */}
              <div className="border-b">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={cn(
                      "py-4 px-1 border-b-2 font-medium text-sm",
                      activeTab === 'overview'
                        ? "border-emerald-500 text-emerald-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    )}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={cn(
                      "py-4 px-1 border-b-2 font-medium text-sm",
                      activeTab === 'orders'
                        ? "border-emerald-500 text-emerald-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    )}
                  >
                    Orders
                  </button>
                  <button
                    onClick={() => setActiveTab('notes')}
                    className={cn(
                      "py-4 px-1 border-b-2 font-medium text-sm",
                      activeTab === 'notes'
                        ? "border-emerald-500 text-emerald-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    )}
                  >
                    Notes
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6 flex-1 overflow-y-auto">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                          Average Order Value
                        </h4>
                        <p className="text-2xl font-bold text-gray-900">
                          ${(customer.total_spent / customer.total_orders || 0).toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                          Orders This Month
                        </h4>
                        <p className="text-2xl font-bold text-gray-900">
                          {orders.filter(order => 
                            new Date(order.created_at).getMonth() === new Date().getMonth()
                          ).length}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                          Last Activity
                        </h4>
                        <p className="text-2xl font-bold text-gray-900">
                          {customer.last_login 
                            ? new Date(customer.last_login).toLocaleDateString()
                            : 'Never'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              Order #{order.id.slice(0, 8)}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={cn(
                            "px-2 py-1 rounded-full text-sm font-medium",
                            {
                              'bg-yellow-100 text-yellow-800': order.status === 'pending',
                              'bg-blue-100 text-blue-800': order.status === 'processing',
                              'bg-purple-100 text-purple-800': order.status === 'shipped',
                              'bg-green-100 text-green-800': order.status === 'delivered',
                              'bg-red-100 text-red-800': order.status === 'cancelled'
                            }
                          )}>
                            {order.status}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center">
                              <Package className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="flex-1">{item.product.name}</span>
                              <span className="text-gray-500">
                                {item.quantity} × ${Number(item.price).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t flex justify-between">
                          <span className="font-medium">Total</span>
                          <span className="font-bold">${Number(order.total).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}

                    {orders.length === 0 && (
                      <div className="text-center py-12">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No orders yet</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div>
                    <textarea
                      value={customer.notes || ''}
                      onChange={(e) => handleUpdateNotes(e.target.value)}
                      placeholder="Add notes about this customer..."
                      className="w-full h-64 p-4 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-500">Customer not found</p>
          </div>
        )}
      </div>
    </div>
  );
}