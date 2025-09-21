'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Kids Science Tutor Login Page
 * Simple login with kid name and 4-digit PIN
 * Creates new kid if doesn't exist, redirects to reading page
 */
export default function LoginPage() {
  const [kidName, setKidName] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!kidName.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setError('PIN must be exactly 4 digits');
      return;
    }

    setIsLoading(true);

    try {
      // Check if kid exists or create new one
      const response = await fetch('/api/kids/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: kidName.trim(),
          pin: pin,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const { kid, isNewKid } = await response.json();
      
      // Show welcome message for new kids
      if (isNewKid) {
        alert(`Welcome ${kid.name}! Your account has been created. Remember your PIN: ${pin}`);
      }

      // Redirect to reading page
      router.push(`/read/${kid.id}`);
      
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 4) {
      setPin(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🧪</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Kids Science Tutor
          </h1>
          <p className="text-gray-600">
            Let's learn amazing science together!
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Kid Name Input */}
          <div>
            <label htmlFor="kidName" className="block text-sm font-medium text-gray-700 mb-2">
              What's your name?
            </label>
            <input
              id="kidName"
              type="text"
              value={kidName}
              onChange={(e) => setKidName(e.target.value)}
              placeholder="Enter your first name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              disabled={isLoading}
              autoComplete="given-name"
            />
          </div>

          {/* PIN Input */}
          <div>
            <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
              Your 4-digit PIN
            </label>
            <input
              id="pin"
              type="password"
              value={pin}
              onChange={handlePinChange}
              placeholder="••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-center tracking-widest"
              disabled={isLoading}
              maxLength={4}
              autoComplete="current-password"
            />
            <p className="text-xs text-gray-500 mt-1">
              New here? Just pick a 4-digit PIN to remember!
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 text-lg"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Logging in...
              </div>
            ) : (
              'Start Learning! 🚀'
            )}
          </button>
        </form>

        {/* Info Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              What you'll learn today:
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div className="flex items-center">
                <span className="mr-1">🪐</span>
                Planets & Space
              </div>
              <div className="flex items-center">
                <span className="mr-1">🌋</span>
                Earth Science
              </div>
              <div className="flex items-center">
                <span className="mr-1">🦎</span>
                Animals & Nature
              </div>
              <div className="flex items-center">
                <span className="mr-1">⚙️</span>
                How Things Work
              </div>
            </div>
          </div>
        </div>

        {/* Parent Note */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            <span className="font-medium">For Parents:</span> This app tracks reading progress and quiz scores. 
            All data is stored locally for your child's privacy.
          </p>
        </div>
      </div>
    </div>
  );
}
