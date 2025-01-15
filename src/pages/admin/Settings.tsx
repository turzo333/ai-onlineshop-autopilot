import React, { useState, useEffect } from 'react';
import { Save, Mail, Globe, DollarSign, Clock, Bell, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';

interface StoreSettings {
  store_name: string;
  contact_email: string;
  currency: string;
  timezone: string;
  order_prefix: string;
  notification_email: string;
  enable_inventory_alerts: boolean;
  low_stock_threshold: number;
  enable_order_notifications: boolean;
  enable_customer_reviews: boolean;
  maintenance_mode: boolean;
}

const defaultSettings: StoreSettings = {
  store_name: 'EcoShop',
  contact_email: '',
  currency: 'USD',
  timezone: 'UTC',
  order_prefix: 'ECO-',
  notification_email: '',
  enable_inventory_alerts: true,
  low_stock_threshold: 5,
  enable_order_notifications: true,
  enable_customer_reviews: true,
  maintenance_mode: false,
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const { data, error } = await supabase
          .from('store_settings')
          .select('*')
          .single();

        if (error) throw error;
        if (data) {
          setSettings({ ...defaultSettings, ...data });
        }
      } catch (err) {
        console.error('Error loading settings:', err);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('store_settings')
        .upsert(settings);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* General Settings */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Globe className="h-5 w-5 text-gray-400 mr-2" />
                General Settings
              </h2>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={settings.store_name}
                    onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={settings.contact_email}
                    onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="AUD">AUD ($)</option>
                    <option value="CAD">CAD ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timezone
                  </label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Order Settings */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                Order Settings
              </h2>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order Number Prefix
                  </label>
                  <input
                    type="text"
                    value={settings.order_prefix}
                    onChange={(e) => setSettings({ ...settings, order_prefix: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notification Email
                  </label>
                  <input
                    type="email"
                    value={settings.notification_email}
                    onChange={(e) => setSettings({ ...settings, notification_email: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Bell className="h-5 w-5 text-gray-400 mr-2" />
                Notification Settings
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Inventory Alerts</h3>
                    <p className="text-sm text-gray-500">
                      Get notified when products are running low on stock
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enable_inventory_alerts}
                      onChange={(e) => setSettings({ ...settings, enable_inventory_alerts: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className={cn(
                      "w-11 h-6 bg-gray-200 rounded-full peer",
                      "peer-checked:after:translate-x-full peer-checked:after:border-white",
                      "after:content-[''] after:absolute after:top-0.5 after:left-[2px]",
                      "after:bg-white after:border-gray-300 after:border after:rounded-full",
                      "after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"
                    )} />
                  </label>
                </div>

                {settings.enable_inventory_alerts && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Low Stock Threshold
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={settings.low_stock_threshold}
                      onChange={(e) => setSettings({ ...settings, low_stock_threshold: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Order Notifications</h3>
                    <p className="text-sm text-gray-500">
                      Receive notifications for new orders
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enable_order_notifications}
                      onChange={(e) => setSettings({ ...settings, enable_order_notifications: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className={cn(
                      "w-11 h-6 bg-gray-200 rounded-full peer",
                      "peer-checked:after:translate-x-full peer-checked:after:border-white",
                      "after:content-[''] after:absolute after:top-0.5 after:left-[2px]",
                      "after:bg-white after:border-gray-300 after:border after:rounded-full",
                      "after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"
                    )} />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Shield className="h-5 w-5 text-gray-400 mr-2" />
                Advanced Settings
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Customer Reviews</h3>
                    <p className="text-sm text-gray-500">
                      Allow customers to leave product reviews
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enable_customer_reviews}
                      onChange={(e) => setSettings({ ...settings, enable_customer_reviews: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className={cn(
                      "w-11 h-6 bg-gray-200 rounded-full peer",
                      "peer-checked:after:translate-x-full peer-checked:after:border-white",
                      "after:content-[''] after:absolute after:top-0.5 after:left-[2px]",
                      "after:bg-white after:border-gray-300 after:border after:rounded-full",
                      "after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"
                    )} />
                  </label>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Maintenance Mode</h3>
                    <p className="text-sm text-gray-500">
                      Temporarily disable the store for maintenance
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.maintenance_mode}
                      onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className={cn(
                      "w-11 h-6 bg-gray-200 rounded-full peer",
                      "peer-checked:after:translate-x-full peer-checked:after:border-white",
                      "after:content-[''] after:absolute after:top-0.5 after:left-[2px]",
                      "after:bg-white after:border-gray-300 after:border after:rounded-full",
                      "after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"
                    )} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 p-4 bg-green-50 text-green-600 rounded-lg">
            Settings saved successfully!
          </div>
        )}

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className={cn(
              "flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-lg",
              "hover:bg-emerald-700 transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Save className="h-5 w-5" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}