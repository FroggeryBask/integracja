// app/login/LoginForm.jsx
'use client';

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
    credentials?: string; 
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const sessionError = searchParams.get('error') === 'SessionRequired';

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    // Email validation
    if (!email) {
      newErrors.email = 'Email jest wymagany';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Proszę podać poprawny adres email';
    }
    
    // Password validation
    if (!password) {
      newErrors.password = 'Hasło jest wymagane';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validate form before submission
  if (!validateForm()) {
    return;
  }
  
  setIsLoading(true);
  setErrors({});

  try {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      // Handle specific error messages
      if (result.error.includes('CredentialsSignin')) {
        setErrors({ 
          credentials: 'Niepoprawne dane logowania. Spróbuj ponownie.',
          email: ' ', // Empty space to highlight the field
          password: ' ' // Empty space to highlight the field
        });
      } else {
        setErrors({ form: 'Cos poszlo nie tak. Spróbuj ponownie później.' });
      }
    } else {
      // Redirect on successful login
      router.push(searchParams.get('callbackUrl') || '/home');
      router.refresh();
    }
  } catch (error) {
    setErrors({ form: 'Nieoczekiwany błąd. Spróbuj ponownie.' });
  } finally {
    setIsLoading(false);
  }
};
  return (
    <div className="h-min mb-40">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
          Zaloguj się
        </h2>
      </div>

      {(errors.form || sessionError) && (
        <div className={`rounded-md ${sessionError ? 'bg-yellow-50' : 'bg-red-50'} p-4 mt-4`}>
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon 
                className={`h-5 w-5 ${sessionError ? 'text-yellow-400' : 'text-red-400'}`} 
                aria-hidden="true" 
              />
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${sessionError ? 'text-yellow-800' : 'text-red-800'}`}>
                {sessionError ? 'Musisz się zalogować, aby móc korzystać ze strony' : errors.form}
              </h3>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-2 rounded-md shadow-sm">
          <div>
            <label htmlFor="email" className="sr-only">
              Adres e-mail
            </label>
            <input
  id="email"
  name="email"
  type="email"
  autoComplete="email"
  required
  value={email}
 // For email input
onChange={(e) => {
  setEmail(e.target.value);
  if (errors.email || errors.credentials) {
    setErrors(prev => ({ 
      ...prev, 
      email: undefined, 
      credentials: undefined 
    }));
  }
}}

  className={`relative block w-full rounded-md border-0 py-3 px-3 text-gray-900 ring-1 ring-inset ${
  errors.email !== undefined || errors.credentials ? 'ring-red-600' : 'ring-gray-300'
} placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
 placeholder="Email address"
/>
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Hasło
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              
// For password input
onChange={(e) => {
  setPassword(e.target.value);
  if (errors.password || errors.credentials) {
    setErrors(prev => ({ 
      ...prev, 
      password: undefined, 
      credentials: undefined 
    }));
  }
}}
 className={`relative block w-full rounded-md border-0 py-3 px-3 text-gray-900 ring-1 ring-inset ${
  errors.password !== undefined || errors.credentials ? 'ring-red-600' : 'ring-gray-300'
} placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
placeholder="Hasło"
            />
            {errors.email && (
  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
)}

{errors.password && (
  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
)}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`group relative flex w-full justify-center rounded-md bg-indigo-600 py-3 px-4 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
             Logowanie...
            </span>
          ) : (
            <span>Zaloguj się</span>
          )}
        </button>


        {/* Credentials error message below the button */}
        {errors.credentials && (
  <div className="rounded-md bg-red-50 p-4">
    <div className="flex">
      <div className="flex-shrink-0">
        <ExclamationTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
      </div>
      <div className="ml-3">
        <h3 className="text-sm font-medium text-red-800">
          {errors.credentials}
        </h3>
      </div>
    </div>
  </div>
)}
      </form>
    </div>
  );
}