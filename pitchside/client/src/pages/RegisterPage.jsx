import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register: signup } = useAuth();
  const nav = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (values) => {
    try {
      await signup(values);
      toast.success('Welcome to PitchSide!');
      nav('/favorites', { replace: true });
    } catch (e) {
      toast.error(e.userMessage || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card p-6">
        <h1 className="font-display text-2xl font-bold text-chalk-900">Create account</h1>
        <p className="text-chalk-500 mt-1 mb-5 text-sm">Pick favorite teams, follow your competitions.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-chalk-700 mb-1">Name</label>
            <input
              id="name"
              autoComplete="name"
              className="w-full px-3 py-2 rounded-lg border border-chalk-200 focus:border-pitch-500 focus:ring-2 focus:ring-pitch-200 outline-none"
              {...register('name', { required: 'Name required', minLength: { value: 2, message: 'Too short' } })}
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-chalk-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="w-full px-3 py-2 rounded-lg border border-chalk-200 focus:border-pitch-500 focus:ring-2 focus:ring-pitch-200 outline-none"
              {...register('email', {
                required: 'Email required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
              })}
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-chalk-700 mb-1">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              className="w-full px-3 py-2 rounded-lg border border-chalk-200 focus:border-pitch-500 focus:ring-2 focus:ring-pitch-200 outline-none"
              {...register('password', {
                required: 'Password required',
                minLength: { value: 6, message: 'At least 6 characters' },
              })}
            />
            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="text-sm text-chalk-500 mt-4 text-center">
          Already registered? <Link to="/login" className="text-pitch-700 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
