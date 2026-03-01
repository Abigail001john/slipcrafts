import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  FilePlus,
  Clock,
  Users,
  User,
  Shield,
  LogOut,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function DashboardLayout({ children }) {
  const { user, profile, logout } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Overview', path: '/dashboard' },
    { icon: FilePlus, label: 'Generate Receipt', path: '/dashboard/generate' },
    { icon: Clock, label: 'History', path: '/dashboard/history' },
    { icon: Users, label: 'Referral', path: '/dashboard/referral' },
    { icon: User, label: 'Profile', path: '/dashboard/profile' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-50" style={{ fontFamily: 'Nunito, sans-serif' }}>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b">
          <Link to="/" className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: '#f8812d' }}
            >
              SC
            </div>
            <span className="text-xl font-bold text-gray-900">SlipCraft</span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                style={
                  isActive(item.path)
                    ? { color: '#f8812d' }
                    : {}
                }
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}

          {profile?.is_admin && (
            <Link
              to="/admin"
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/admin')
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              style={
                isActive('/admin')
                  ? { color: '#f8812d' }
                  : {}
              }
            >
              <Shield size={20} />
              <span className="font-medium">Admin</span>
            </Link>
          )}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t p-4 space-y-4">
          <div className="px-2">
            <p className="text-sm font-medium text-gray-900">{profile?.name || user?.email}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
            <p className="text-xs font-semibold mt-2" style={{ color: '#f8812d' }}>
              {profile?.points?.toLocaleString() || 0} Points
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b md:hidden">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-gray-600"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-900">
                {user?.points?.toLocaleString() || 0} pts
              </span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden bg-white border-t">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors border-t-2 ${
                    isActive(item.path)
                      ? 'border-orange-600'
                      : 'border-transparent'
                  }`}
                  style={
                    isActive(item.path)
                      ? { color: '#f8812d' }
                      : { color: '#999' }
                  }
                >
                  <Icon size={20} />
                  <span className="text-xs font-medium mt-1">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
