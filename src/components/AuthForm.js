// Authentication Form Component
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';

const AuthForm = ({ onAuthSuccess, onBack, isLoading = false }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.displayName) {
        newErrors.displayName = 'Display name is required';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onAuthSuccess({
        isLogin,
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName
      });
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      displayName: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-slate-400">
            {isLogin ? 'Sign in to continue learning' : 'Join LinguaAI to start your language journey'}
          </p>
        </div>

        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="mb-6 flex items-center text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display Name (Register only) */}
          {!isLogin && (
            <div>
              <label htmlFor="displayName" className="block text-white font-medium mb-2">
                Display Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className={`w-full p-4 rounded-xl bg-slate-700/50 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.displayName ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="Enter your display name"
                />
                <User className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              </div>
              {errors.displayName && (
                <p className="text-red-400 text-sm mt-1">{errors.displayName}</p>
              )}
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-white font-medium mb-2">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full p-4 rounded-xl bg-slate-700/50 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-slate-600'
                }`}
                placeholder="Enter your email"
              />
              <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-white font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full p-4 rounded-xl bg-slate-700/50 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.password ? 'border-red-500' : 'border-slate-600'
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password (Register only) */}
          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="block text-white font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full p-4 rounded-xl bg-slate-700/50 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.confirmPassword ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="Confirm your password"
                />
                <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 ${
              isLoading
                ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
              </>
            ) : (
              <>
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Dev Bypass Button */}
          <button
            type="button"
            onClick={() => onAuthSuccess({ devBypass: true })}
            className="w-full py-3 mt-3 rounded-xl bg-slate-700/50 text-purple-300 font-medium hover:bg-slate-600 hover:text-pink-400 transition-colors"
          >
            Continue without login
          </button>

        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center">
          <p className="text-slate-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={toggleMode}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
