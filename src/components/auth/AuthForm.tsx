import React, { useState } from 'react';
import { Heart, Mail, Lock, User, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { login, register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      let success = false;
      
      if (isLogin) {
        success = await login(email, password);
        if (!success) {
          setError('Invalid email or password');
        }
      } else {
        if (!username.trim()) {
          setError('Username is required');
          return;
        }
        success = await register(email, password, username);
        if (!success) {
          setError('User already exists with this email or username');
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-purple-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full mb-4 shadow-lg">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Kawaii Trade</h1>
          <p className="text-pink-600 font-medium flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4" />
            Share the cuteness
            <Sparkles className="w-4 h-4" />
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-pink-200">
          <div className="flex bg-pink-100 rounded-2xl p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                isLogin
                  ? 'bg-white text-pink-600 shadow-md'
                  : 'text-pink-500 hover:text-pink-600'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                !isLogin
                  ? 'bg-white text-pink-600 shadow-md'
                  : 'text-pink-500 hover:text-pink-600'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-pink-50 border border-pink-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent placeholder-pink-400"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 w-5 h-5" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-pink-50 border border-pink-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent placeholder-pink-400"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 w-5 h-5" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-pink-50 border border-pink-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent placeholder-pink-400"
                required
                minLength={6}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl border border-red-200">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white py-4 rounded-2xl font-medium hover:from-pink-500 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-pink-600 text-sm mt-6">
            {isLogin ? "New to Kawaii Trade?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-pink-500 hover:text-pink-600 ml-1 underline"
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