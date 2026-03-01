import React, { createContext, useState, useCallback, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';

export const AppContext = createContext();

const defaultConfig = {
  platform_name: 'SlipCraft',
  tagline: 'Generate Professional Receipts Instantly',
  support_email: 'support@slipcraft.net',
  admin_email: 'admin@slipcraft.net',
  brand_color: '#f8812d',
  bank_slip_cost: 10,
  email_receipt_cost: 5,
  referral_bonus: 20,
  signup_bonus: 50,
  total_users: 1240,
  total_receipts: 45800,
  uptime: '99.9%',
  privacy_policy: 'We take your privacy seriously. SlipCraft collects minimal data necessary to provide our services.',
  terms_of_service: 'By using SlipCraft, you agree to use the platform for lawful purposes only.',
  about_us: 'SlipCraft is a professional receipt generation platform.',
};

export function AppContextProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [profile, setProfileState] = useState(null);
  const [config, setConfigState] = useState(defaultConfig);
  const [receipts, setReceiptsState] = useState([]);
  const [faqs, setFaqsState] = useState([]);
  const [testimonials, setTestimonialsState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);

  // ── Auth listener ──────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserState(session.user);
        fetchProfile(session.user.id);
        fetchReceipts(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserState(session.user);
        fetchProfile(session.user.id);
        fetchReceipts(session.user.id);
      } else {
        setUserState(null);
        setProfileState(null);
        setReceiptsState([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Fetch platform config, FAQs, testimonials (public) ────────
  useEffect(() => {
    fetchConfig();
    fetchFaqs();
    fetchTestimonials();
  }, []);

  async function fetchConfig() {
    const { data, error } = await supabase
      .from('platform_config')
      .select('*')
      .eq('id', 1)
      .single();
    if (data && !error) setConfigState(data);
  }

  async function fetchFaqs() {
    const { data } = await supabase
      .from('faqs')
      .select('*')
      .order('order_index', { ascending: true });
    if (data) setFaqsState(data);
  }

  async function fetchTestimonials() {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });
    if (data) setTestimonialsState(data);
  }

  async function fetchProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (data && !error) setProfileState(data);
    setLoading(false);
  }

  async function fetchReceipts(userId) {
    const { data } = await supabase
      .from('receipts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (data) setReceiptsState(data);
  }

  // ── Fetch all users (admin only) ──────────────────────────────
  async function fetchAllUsers() {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setAllUsers(data);
    return data || [];
  }

  // ── Login ──────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, message: error.message };
    return { success: true, user: data.user };
  }, []);

  // ── Register ───────────────────────────────────────────────────
  const register = useCallback(async (name, email, password, referralCode = '') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          referred_by: referralCode || null,
        },
      },
    });
    if (error) return { success: false, message: error.message };
    return { success: true, user: data.user };
  }, []);

  // ── Logout ─────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  // ── Add Receipt ────────────────────────────────────────────────
  const addReceipt = useCallback(async (receiptData) => {
    if (!user || !profile) return null;

    const cost = receiptData.type === 'bank'
      ? config.bank_slip_cost
      : config.email_receipt_cost;

    if (profile.points < cost) {
      return { error: 'Insufficient points' };
    }

    // Insert receipt
    const { data: receipt, error: receiptError } = await supabase
      .from('receipts')
      .insert([{ user_id: user.id, type: receiptData.type, data: receiptData }])
      .select()
      .single();

    if (receiptError) return { error: receiptError.message };

    // Deduct points
    const newPoints = profile.points - cost;
    await supabase
      .from('profiles')
      .update({ points: newPoints })
      .eq('id', user.id);

    // Log transaction
    await supabase
      .from('points_transactions')
      .insert([{
        user_id: user.id,
        type: 'spend',
        amount: -cost,
        description: `Generated ${receiptData.type === 'bank' ? 'bank slip' : 'email receipt'}`,
      }]);

    // Update local state
    setProfileState(prev => ({ ...prev, points: newPoints }));
    setReceiptsState(prev => [receipt, ...prev]);

    return receipt;
  }, [user, profile, config]);

  // ── Update Profile ─────────────────────────────────────────────
  const updateProfile = useCallback(async (updates) => {
    if (!user) return { success: false, message: 'Not authenticated' };
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    if (error) return { success: false, message: error.message };
    setProfileState(data);
    return { success: true, profile: data };
  }, [user]);

  // ── Update Config (admin) ──────────────────────────────────────
  const updateConfig = useCallback(async (updates) => {
    const { data, error } = await supabase
      .from('platform_config')
      .update(updates)
      .eq('id', 1)
      .select()
      .single();
    if (error) return { success: false, message: error.message };
    setConfigState(data);
    return { success: true };
  }, []);

  // ── FAQ CRUD (admin) ───────────────────────────────────────────
  const addFaq = useCallback(async (faq) => {
    const { data, error } = await supabase.from('faqs').insert([faq]).select().single();
    if (error) return { success: false, message: error.message };
    setFaqsState(prev => [...prev, data]);
    return { success: true, data };
  }, []);

  const updateFaq = useCallback(async (id, updates) => {
    const { data, error } = await supabase.from('faqs').update(updates).eq('id', id).select().single();
    if (error) return { success: false, message: error.message };
    setFaqsState(prev => prev.map(f => f.id === id ? data : f));
    return { success: true, data };
  }, []);

  const deleteFaq = useCallback(async (id) => {
    const { error } = await supabase.from('faqs').delete().eq('id', id);
    if (error) return { success: false, message: error.message };
    setFaqsState(prev => prev.filter(f => f.id !== id));
    return { success: true };
  }, []);

  // ── Testimonial CRUD (admin) ───────────────────────────────────
  const addTestimonial = useCallback(async (testimonial) => {
    const { data, error } = await supabase.from('testimonials').insert([testimonial]).select().single();
    if (error) return { success: false, message: error.message };
    setTestimonialsState(prev => [...prev, data]);
    return { success: true, data };
  }, []);

  const updateTestimonial = useCallback(async (id, updates) => {
    const { data, error } = await supabase.from('testimonials').update(updates).eq('id', id).select().single();
    if (error) return { success: false, message: error.message };
    setTestimonialsState(prev => prev.map(t => t.id === id ? data : t));
    return { success: true, data };
  }, []);

  const deleteTestimonial = useCallback(async (id) => {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) return { success: false, message: error.message };
    setTestimonialsState(prev => prev.filter(t => t.id !== id));
    return { success: true };
  }, []);

  // ── Admin: adjust user points ──────────────────────────────────
  const adjustUserPoints = useCallback(async (userId, delta, description = 'Admin adjustment') => {
    const targetUser = allUsers.find(u => u.id === userId);
    if (!targetUser) return { success: false, message: 'User not found' };
    const newPoints = Math.max(0, targetUser.points + delta);
    const { error } = await supabase.from('profiles').update({ points: newPoints }).eq('id', userId);
    if (error) return { success: false, message: error.message };
    await supabase.from('points_transactions').insert([{
      user_id: userId,
      type: delta > 0 ? 'purchase' : 'spend',
      amount: delta,
      description,
    }]);
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, points: newPoints } : u));
    return { success: true };
  }, [allUsers]);

  // ── Change Password ────────────────────────────────────────────
  const changePassword = useCallback(async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { success: false, message: error.message };
    return { success: true };
  }, []);

  // ── Delete Account ─────────────────────────────────────────────
  const deleteAccount = useCallback(async () => {
    if (!user) return { success: false, message: 'Not authenticated' };
    // Delete profile (cascade will handle receipts/transactions)
    await supabase.from('profiles').delete().eq('id', user.id);
    await supabase.auth.signOut();
    return { success: true };
  }, [user]);

  // ── Referral data ──────────────────────────────────────────────
  async function fetchReferrals(referralCode) {
    const { data } = await supabase
      .from('profiles')
      .select('name, email, created_at, points')
      .eq('referred_by', referralCode)
      .order('created_at', { ascending: false });
    return data || [];
  }

  const value = {
    // Auth
    user,
    profile,
    loading,
    login,
    register,
    logout,
    changePassword,
    deleteAccount,
    // Config
    config,
    updateConfig,
    fetchConfig,
    // Receipts
    receipts,
    addReceipt,
    fetchReceipts: () => user && fetchReceipts(user.id),
    // Profile
    updateProfile,
    // Admin
    allUsers,
    fetchAllUsers,
    adjustUserPoints,
    // FAQs
    faqs,
    addFaq,
    updateFaq,
    deleteFaq,
    fetchFaqs,
    // Testimonials
    testimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    fetchTestimonials,
    // Referrals
    fetchReferrals,
    // Legacy compat shims
    setConfig: updateConfig,
    setUser: setProfileState,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppContextProvider');
  }
  return context;
}
