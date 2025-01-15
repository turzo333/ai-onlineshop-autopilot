import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '../../store/auth';
import { cn } from '../../lib/utils';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function SidebarLink({ to, icon, children }: SidebarLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors",
        isActive
          ? "bg-emerald-600 text-white"
          : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
      )}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { signOut } = useAuthStore();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-emerald-600">Admin Panel</h1>
        </div>
        <nav className="mt-8 px-2 space-y-2">
          <SidebarLink to="/admin" icon={<LayoutDashboard className="h-5 w-5" />}>
            Dashboard
          </SidebarLink>
          <SidebarLink to="/admin/orders" icon={<ShoppingCart className="h-5 w-5" />}>
            Orders
          </SidebarLink>
          <SidebarLink to="/admin/products" icon={<Package className="h-5 w-5" />}>
            Products
          </SidebarLink>
          <SidebarLink to="/admin/customers" icon={<Users className="h-5 w-5" />}>
            Customers
          </SidebarLink>
          <SidebarLink to="/admin/settings" icon={<Settings className="h-5 w-5" />}>
            Settings
          </SidebarLink>
          <button
            onClick={() => signOut()}
            className="flex items-center space-x-2 px-4 py-2 w-full text-left text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}