import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, Edit2, Trash2, Save } from 'lucide-react';
import AdminOverviewTab from '../components/AdminTabs/AdminOverviewTab';
import AdminSettingsTab from '../components/AdminTabs/AdminSettingsTab';
import AdminTestimonialsTab from '../components/AdminTabs/AdminTestimonialsTab';
import AdminFAQTab from '../components/AdminTabs/AdminFAQTab';
import AdminContentTab from '../components/AdminTabs/AdminContentTab';
import AdminUsersTab from '../components/AdminTabs/AdminUsersTab';

export default function AdminPage() {
  const navigate = useNavigate();
  const { user, fetchAllUsers } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAllUsers();
  }, []);

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-semibold">Access Denied</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'settings', label: 'Platform Settings' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'faq', label: 'FAQ' },
    { id: 'content', label: 'Content Editor' },
    { id: 'users', label: 'Users' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-600">Platform Control Center</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-4 font-medium text-sm whitespace-nowrap transition border-b-2 ${
                  activeTab === tab.id
                    ? 'border-brand text-brand'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && <AdminOverviewTab />}
        {activeTab === 'settings' && <AdminSettingsTab />}
        {activeTab === 'testimonials' && <AdminTestimonialsTab />}
        {activeTab === 'faq' && <AdminFAQTab />}
        {activeTab === 'content' && <AdminContentTab />}
        {activeTab === 'users' && <AdminUsersTab />}
      </div>
    </div>
  );
}
