import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';
import { User, Mail, Lock, Eye, EyeOff, Check } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register: registerUser, config } = useAppContext();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      referralCode: searchParams.get('ref') || '',
      agreeTerms: false,
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const password = watch('password');
  const brand = config?.brand_color || '#f8812d';

  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) setValue('referralCode', refCode);
  }, [searchParams, setValue]);

  const onSubmit = async (data) => {
    try {
      const result = await registerUser(data.name, data.email, data.password, data.referralCode);
      if (result.success) {
        toast.success('Account created! Welcome to SlipCraft 🎉');
        navigate('/dashboard');
      } else {
        toast.error(result.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: brand }}>
                SC
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{config?.platform_name || 'SlipCraft'}</h2>
                <p className="text-xs text-gray-500">Receipt Manager</p>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join SlipCraft and get {config?.signup_bonus || 50} free points!</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register('name', {
                    required: 'Full name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  })}
                  className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition"
                />
              </div>
              {errors.name && <p className="text-red-500 text-sm mt-1.5">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' },
                  })}
                  className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1.5">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters' },
                  })}
                  className="w-full pl-11 pr-11 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1.5">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                  className="w-full pl-11 pr-11 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition"
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1.5">{errors.confirmPassword.message}</p>}
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Password requirements:</p>
              <ul className="space-y-1">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 flex-shrink-0" style={{ color: password?.length >= 8 ? brand : '#d1d5db' }} />
                  <span className={password?.length >= 8 ? 'text-gray-700' : 'text-gray-400'}>At least 8 characters</span>
                </li>
              </ul>
            </div>

            {/* Referral Code */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Referral Code (Optional)</label>
              <input
                type="text"
                placeholder="Enter referral code"
                {...register('referralCode')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition uppercase"
              />
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('agreeTerms', { required: 'You must agree to the terms and conditions' })}
                className="w-4 h-4 border-gray-300 rounded cursor-pointer mt-1 flex-shrink-0"
                style={{ accentColor: brand }}
              />
              <span className="text-sm text-gray-700">
                I agree to the{' '}
                <Link to="/terms" className="font-semibold transition" style={{ color: brand }}>terms and conditions</Link>
              </span>
            </label>
            {errors.agreeTerms && <p className="text-red-500 text-sm -mt-3">{errors.agreeTerms.message}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: brand }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold transition" style={{ color: brand }}>Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
