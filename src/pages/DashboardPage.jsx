import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Zap, FileText, Users, Coins } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAppContext } from '../context/AppContext';

export default function DashboardPage() {
  const { user, profile, receipts, config } = useAppContext();

  const recentReceipts = receipts.slice(0, 5);
  const brand = config?.brand_color || '#f8812d';

  const stats = [
    {
      icon: Coins,
      label: 'Points Balance',
      value: (profile?.points || 0).toLocaleString(),
      color: brand,
    },
    {
      icon: FileText,
      label: 'Receipts Generated',
      value: receipts.length,
      color: '#3b82f6',
    },
    {
      icon: Users,
      label: 'Referrals Made',
      value: profile?.referral_count || 0,
      color: '#10b981',
    },
    {
      icon: TrendingUp,
      label: 'Referral Bonus Earned',
      value: `${(profile?.referral_count || 0) * (config?.referral_bonus || 20)} pts`,
      color: '#f59e0b',
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-8">
        {/* Welcome Banner */}
        <div
          className="rounded-2xl text-white p-8 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${brand} 0%, #ff9d4e 100%)` }}
        >
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, {profile?.name || user?.email?.split('@')[0] || 'User'}!
            </h1>
            <p className="text-white/90 text-lg">
              You have <strong>{(profile?.points || 0).toLocaleString()} points</strong> — keep generating receipts!
            </p>
          </div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}>
                    <Icon size={24} style={{ color: stat.color }} />
                  </div>
                </div>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Recent Receipts & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Receipts Table */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Recent Receipts</h2>
              <Link to="/history" className="text-sm font-medium" style={{ color: brand }}>View all →</Link>
            </div>
            {recentReceipts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Sender/From</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReceipts.map((receipt) => {
                      const d = receipt.data || receipt;
                      return (
                        <tr key={receipt.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {new Date(receipt.created_at || receipt.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${brand}20`, color: brand }}>
                              {receipt.type === 'bank' ? 'Bank Slip' : 'Email Receipt'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {receipt.type === 'bank' ? d.senderName : d.fromName}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            {receipt.type === 'bank' ? `₦${Number(d.amount || 0).toLocaleString()}` : '—'}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {receipt.type === 'bank' ? (
                              <span
                                className="px-3 py-1 rounded-full text-xs font-medium"
                                style={{
                                  backgroundColor: d.status === 'Successful' ? '#10b98120' : '#ef444420',
                                  color: d.status === 'Successful' ? '#10b981' : '#ef4444',
                                }}
                              >
                                {d.status}
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#3b82f620', color: '#3b82f6' }}>
                                Sent
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-6 py-12 text-center">
                <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 font-medium">No receipts yet</p>
                <p className="text-gray-500 text-sm mt-1">Generate your first receipt to get started</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/generate-receipt"
                  className="block w-full px-4 py-3 rounded-lg font-medium text-white text-center transition-all hover:shadow-lg active:scale-95"
                  style={{ backgroundColor: brand }}
                >
                  Generate Bank Slip
                </Link>
                <Link
                  to="/generate-receipt"
                  className="block w-full px-4 py-3 rounded-lg font-medium text-white text-center transition-all hover:shadow-lg active:scale-95"
                  style={{ backgroundColor: '#3b82f6' }}
                >
                  Generate Email Slip
                </Link>
                <Link
                  to="/history"
                  className="block w-full px-4 py-3 rounded-lg font-medium border-2 border-gray-200 text-gray-900 text-center transition-colors hover:bg-gray-50"
                >
                  View History
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
              <Zap size={28} style={{ color: brand }} className="mb-3" />
              <h4 className="font-bold text-gray-900 mb-2">Pro Tip</h4>
              <p className="text-sm text-gray-700">
                Refer friends and earn <strong>{config?.referral_bonus || 20} bonus points</strong> for every signup!
              </p>
              <Link to="/referral" className="text-sm font-semibold mt-3 inline-block" style={{ color: brand }}>
                Share referral link →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
