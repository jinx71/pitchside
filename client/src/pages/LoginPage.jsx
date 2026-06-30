import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/favorites';

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { email: 'fan@pitchside.dev', password: 'password123' },
  });

  const onSubmit = async (values) => {
    try {
      await login(values);
      toast.success('Welcome back!');
      nav(from, { replace: true });
    } catch (e) {
      toast.error(e.userMessage || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card p-6">
        <h1 className="font-display text-2xl font-bold text-chalk-900">Log in</h1>
        <p className="text-chalk-500 mt-1 mb-5 text-sm">
          Sign in to save favorite teams and competitions.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-chalk-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="w-full px-3 py-2 rounded-lg border border-chalk-200 focus:border-pitch-500 focus:ring-2 focus:ring-pitch-200 outline-none"
              {...register('email', { required: 'Email required' })}
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-chalk-700 mb-1">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="w-full px-3 py-2 rounded-lg border border-chalk-200 focus:border-pitch-500 focus:ring-2 focus:ring-pitch-200 outline-none"
              {...register('password', { required: 'Password required' })}
            />
            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="text-sm text-chalk-500 mt-4 text-center">
          New here? <Link to="/register" className="text-pitch-700 font-medium hover:underline">Create an account</Link>
        </p>
        <p className="text-xs text-chalk-400 mt-3 text-center">
          Demo: <code>fan@pitchside.dev</code> / <code>password123</code> (after <code>npm run seed</code>)
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
