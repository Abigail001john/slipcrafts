import React, { useState, useEffect } from 'react';
import { Lock, AlertTriangle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';
import { useAppContext } from '../context/AppContext';

export default function ProfilePage() {
  const { user, profile, receipts, updateProfile, changePassword, deleteAccount, logout, config } = useAppContext();
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '' });
  const [passwordData, setPasswordData] = useState({ new: '', confirm: '' });
  const [changingPass, setChangingPass] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const brand = config?.brand_color || '#f8812d';

  useEffect(() => {
    if (profile) setFormData({ name: profile.name || '' });
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!formData.name.trim()) { toast.error('Name cannot be empty'); return; }
    setSaving(true);
    const result = await updateProfile({ name: formData.name.trim() });
    setSaving(false);
    if (result.success) { toast.success('Profile updated!'); setEditMode(false); }
    else toast.error(result.message || 'Failed to update profile');
  };

  const handleChangePassword = async () => {
    if (!passwordData.new || !passwordData.confirm) { toast.error('Please fill in all fields'); return; }
    if (passwordData.new !== passwordData.confirm) { toast.error('Passwords do not match'); return; }
    if (passwordData.new.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setChangingPass(true);
    const result = await changePassword(passwordData.new);
    setChangingPass(false);
    if (result.success) { toast.success('Password changed successfully!'); setPasswordData({ new: '', confirm: '' }); }
    else toast.error(result.message || 'Failed to change password');
  };

  const handleDeleteAccount = async () => {
    const result = await deleteAccount();
    if (result.success) { toast.success('Account deleted'); window.location.href = '/'; }
    else toast.error(result.message || 'Failed to delete account');
  };

  const memberSince = profile?.created_at ? new Date(profile.created_at) : null;

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        {/* Avatar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4" style={{ backgroundColor: brand }}>
              {(profile?.name || user?.email || 'U').charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{profile?.name || 'User'}</h2>
            <p className="text-gray-600 mt-1">{user?.email}</p>
            <div className="mt-3 px-4 py-1.5 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: brand }}>
              {profile?.is_admin ? '👑 Admin' : '🎯 Member'}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <p className="text-xs text-gray-500 font-medium mb-1">Points</p>
            <p className="text-2xl font-bold text-gray-900">{profile?.points || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <p className="text-xs text-gray-500 font-medium mb-1">Receipts</p>
            <p className="text-2xl font-bold text-gray-900">{receipts.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <p className="text-xs text-gray-500 font-medium mb-1">Referrals</p>
            <p className="text-2xl font-bold text-gray-900">{profile?.referral_count || 0}</p>
          </div>
        </div>

        {memberSince && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 text-sm text-gray-600">
            <span className="font-medium">Member since:</span> {memberSince.toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' })}
          </div>
        )}

        {/* Referral Code */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Your Referral Code</h3>
          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
            <span className="font-mono text-lg font-bold text-gray-900 tracking-widest flex-1">{profile?.referral_code || '—'}</span>
            <button
              onClick={() => { navigator.clipboard.writeText(profile?.referral_code || ''); toast.success('Copied!'); }}
              className="text-xs px-3 py-1.5 rounded font-medium text-white"
              style={{ backgroundColor: brand }}
            >Copy</button>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
            <button onClick={() => setEditMode(!editMode)} className="text-sm font-medium" style={{ color: brand }}>
              {editMode ? 'Cancel' : 'Edit'}
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                disabled={!editMode}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-600 focus:outline-none focus:ring-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input type="email" value={user?.email || ''} disabled className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed" />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
            </div>
            {editMode && (
              <button onClick={handleSaveProfile} disabled={saving} className="w-full px-6 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg active:scale-95 mt-6 disabled:opacity-50" style={{ backgroundColor: brand }}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Lock size={20} style={{ color: brand }} /> Change Password
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
              <input type="password" value={passwordData.new} onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))} placeholder="Enter new password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
              <input type="password" value={passwordData.confirm} onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))} placeholder="Confirm new password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2" />
            </div>
            <button onClick={handleChangePassword} disabled={changingPass} className="w-full px-6 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg active:scale-95 disabled:opacity-50" style={{ backgroundColor: brand }}>
              {changingPass ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 rounded-xl border-2 border-red-200 p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle size={24} className="text-red-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-900 mb-2">Danger Zone</h3>
              <p className="text-sm text-red-700 mb-4">Deleting your account is permanent. All data will be lost.</p>
              <button onClick={() => setDeleteModalOpen(true)} className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Delete Account</h3>
              <button onClick={() => setDeleteModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                <AlertTriangle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900">Are you absolutely sure?</p>
                  <p className="text-sm text-red-700 mt-1">This cannot be undone. All receipts and data will be permanently deleted.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setDeleteModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">Cancel</button>
                <button onClick={handleDeleteAccount} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">Delete Forever</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
