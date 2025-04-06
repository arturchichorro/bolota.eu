'use client';

import { useState } from 'react';
import { Button } from '../ui/button';

export const SubscriberForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [validationError, setValidationError] = useState('');
  const messageId = 'subscription-message';
  const errorId = 'email-error';

  // Email validation regex
  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  // Separate API call function for better organization
  const subscribeUser = async (email: string) => {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    let data = { message: '' };
    try {
      data = await res.json();
    } catch {
      data.message = 'No response from server';
    }

    return { 
      success: res.ok, 
      message: data.message || (res.ok ? 'Thanks for subscribing!' : 'Something went wrong.') 
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous messages
    setMessage('');
    setValidationError('');
    
    // Validate email format before submission
    if (!validateEmail(email)) {
      setValidationError('Please enter a valid email address');
      return;
    }

    setStatus('loading');

    try {
      const result = await subscribeUser(email);
      
      if (result.success) {
        setStatus('success');
        setMessage(result.message);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(result.message);
      }
    } catch (err) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex flex-col gap-3 max-w-sm mx-auto"
      aria-live="polite"
    >

        <div className="flex flex-row gap-3">
        <input
            id="email"
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            aria-describedby={validationError ? errorId : undefined}
            aria-invalid={!!validationError}
        />

        {validationError && (
            <p id={errorId} className="text-warning text-xs mt-1">
            {validationError}
            </p>
        )}
      
        <Button
            type="submit"
            disabled={status === 'loading'}
            variant="secondary"
            aria-busy={status === 'loading'}
            >
            {status === 'loading' ? (
                <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Subscribing...
                </>
            ) : (
                'Subscribe'
            )}
        </Button>
        </div>
      
      {message && (
        <p 
          id={messageId} 
          className={`text-sm ${status === 'error' ? 'text-red-500' : 'text-green-600'}`}
          role="status"
        >
          {message}
        </p>
      )}
    </form>
  );
};