import React, { useState } from 'react';
import { X, Send, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';

interface EmailCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSegment: string;
  recipientCount: number;
}

export default function EmailCampaignModal({ 
  isOpen, 
  onClose, 
  selectedSegment,
  recipientCount 
}: EmailCampaignModalProps) {
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    previewText: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Log the campaign in activity_logs
      const { error: logError } = await supabase
        .from('activity_logs')
        .insert([{
          action: 'email_campaign_sent',
          details: {
            segment: selectedSegment,
            subject: formData.subject,
            recipientCount
          }
        }]);

      if (logError) throw logError;

      // In a real application, you would integrate with an email service here
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setFormData({ subject: '', content: '', previewText: '' });
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              New Email Campaign
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Recipients Summary */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-emerald-600 mr-2" />
              <div>
                <p className="font-medium text-emerald-900">
                  {recipientCount} Recipients
                </p>
                <p className="text-sm text-emerald-700">
                  Segment: {selectedSegment === 'all' ? 'All Customers' : selectedSegment}
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 text-green-600 rounded-lg">
              Campaign sent successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject Line
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter a compelling subject line"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preview Text
              </label>
              <input
                type="text"
                value={formData.previewText}
                onChange={(e) => setFormData({ ...formData, previewText: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Brief preview text that appears in email clients"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Write your email content here..."
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg",
                  "hover:bg-emerald-700 transition-colors",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <Send className="h-4 w-4" />
                <span>{loading ? 'Sending...' : 'Send Campaign'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}