import React, { useState, useEffect } from 'react';
import { Copy, Check, Users, Zap, Gift } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';
import { useAppContext } from '../context/AppContext';

export default function ReferralPage() {
  const { profile, config, fetchReferrals } = useAppContext();
  const [copied, setCopied] = useState(false);
  const [referredUsers, setReferredUsers] = useState([]);
  const brand = config?.brand_color || '#f8812d';

  const referralLink = `${window.location.origin}/register?ref=${profile?.referral_code || ''}`;

  useEffect(() => {
    if (profile?.referral_code) {
      fetchReferrals(profile.referral_code).then(setReferredUsers);
    }
  }, [profile?.referral_code]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard!');
  };

  const shareLinks = [
    {
      name: 'WhatsApp', icon: '💬',
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(`Join SlipCraft and get free points! ${referralLink}`)}`),
    },
    {
      name: 'Twitter/X', icon: '𝕏',
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out SlipCraft! ${referralLink}`)}`),
    },
    {
      name: 'Telegram', icon: '✈️',
      action: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('Join SlipCraft!')}`),
    },
    {
      name: 'Facebook', icon: 'f',
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`),
    },
  ];

  const totalEarned = (profile?.referral_count || 0) * (config?.referral_bonus || 20);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Referral Program</h1>
          <p className="text-gray-600">Earn <strong>{config?.referral_bonus || 20} points</strong> for every friend you invite!</p>
        </div>

        {/* Referral Link Card */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 p-8 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Your Referral Link</h2>
          <p className="text-sm text-gray-600 mb-4">Share this link and earn {config?.referral_bonus || 20} bonus points per signup</p>
          <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-orange-200">
            <input type="text" value={referralLink} readOnly className="flex-1 bg-transparent text-sm text-gray-900 font-mono focus:outline-none min-w-0" />
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-all hover:shadow-md active:scale-95 flex-shrink-0"
              style={{ backgroundColor: brand }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-600 font-medium">Your code:</span>
            <span className="font-mono font-bold text-lg tracking-widest" style={{ color: brand }}>{profile?.referral_code || '—'}</span>
          </div>
        </div>

        {/* Social Share */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Share on Social Media</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {shareLinks.map((link) => (
              <button
                key={link.name}
                onClick={link.action}
                className="flex flex-col items-center gap-3 px-4 py-4 rounded-lg border border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-colors"
              >
                <span className="text-2xl">{link.icon}</span>
                <span className="text-sm font-medium text-gray-900">{link.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { icon: Users, label: 'Total Referrals', value: profile?.referral_count || 0, color: brand, bg: '#fff7ed' },
            { icon: Zap, label: 'Points Earned', value: `${totalEarned} pts`, color: '#10b981', bg: '#f0fdf4' },
            { icon: Gift, label: 'Per Referral', value: `${config?.referral_bonus || 20} pts`, color: '#3b82f6', bg: '#eff6ff' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: bg }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <p className="text-sm text-gray-600 font-medium">{label}</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">{value}</p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">How It Works</h3>
          <div className="space-y-4">
            {[
              { step: 1, title: 'Share Your Link', desc: 'Share your unique referral link with friends and family' },
              { step: 2, title: 'They Sign Up', desc: 'Your friends register using your referral link or code' },
              { step: 3, title: 'You Earn Points', desc: `You get ${config?.referral_bonus || 20} bonus points added instantly` },
              { step: 4, title: 'Redeem Points', desc: 'Use earned points to generate receipts for free' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 text-sm" style={{ backgroundColor: brand }}>{step}</div>
                <div>
                  <p className="font-semibold text-gray-900">{title}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Referred Users Table */}
        {referredUsers.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Referred Users ({referredUsers.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {referredUsers.map((u, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{u.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(u.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
