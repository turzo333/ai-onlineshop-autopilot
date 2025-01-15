import React, { useEffect, useState } from 'react';
import { BarChart, DollarSign, ShoppingBag, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: number;
}

function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="bg-emerald-100 p-3 rounded-lg">
          {icon}
        </div>
        <span className={cn(
          "text-sm font-medium",
          trend > 0 ? "text-green-600" : "text-red-600"
        )}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      </div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        // Fetch total revenue and orders
        const { data: ordersData } = await supabase
          .from('orders')
          .select('total');
        
        const totalRevenue = ordersData?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
        const totalOrders = ordersData?.length || 0;
        
        // Fetch total customers
        const { count: totalCustomers } = await supabase
          .from('customer_profiles')
          .select('*', { count: 'exact', head: true });

        // Calculate average order value
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        setStats({
          totalRevenue,
          totalOrders,
          totalCustomers: totalCustomers || 0,
          averageOrderValue,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={<DollarSign className="h-6 w-6 text-emerald-600" />}
          trend={12}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toString()}
          icon={<ShoppingBag className="h-6 w-6 text-emerald-600" />}
          trend={8}
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers.toString()}
          icon={<Users className="h-6 w-6 text-emerald-600" />}
          trend={23}
        />
        <StatCard
          title="Average Order Value"
          value={`$${stats.averageOrderValue.toFixed(2)}`}
          icon={<BarChart className="h-6 w-6 text-emerald-600" />}
          trend={-4}
        />
      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Orders
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Order ID
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Order rows will be populated here */}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular Products */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Popular Products
          </h2>
          <div className="space-y-4">
            {/* Product items will be populated here */}
          </div>
        </div>
      </div>
    </div>
  );
}