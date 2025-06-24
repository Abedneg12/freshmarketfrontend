'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import ILogin from './type';
import { Formik, Form, Field, FormikProps } from 'formik';
import { useAppDispatch } from '@/lib/redux/hooks';
import { onLogin } from '@/lib/redux/features/authSlices';
import { showSuccess, showError, showLoading } from '@/utils/toast'; // Importing the toast utils
import Link from 'next/link';
import { loginSchema } from './schema';
import { apiUrl } from '@/pages/config';
import { AiOutlineClose } from 'react-icons/ai';
import toast from 'react-hot-toast';

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessages, setErrorMessages] = useState<{ email?: string; password?: string }>({});

  const initialValue: ILogin = {
    email: '',
    password: '',
  };

  const login = async (values: ILogin) => {
    const toastId = showLoading('Logging in...'); // Show loading toast

    try {
      const { data } = await axios.post(`${apiUrl}/auth/login`, values);

      // If no token is returned, throw an error
      if (!data.token) throw new Error('Token not received');

      // Construct the user state object to dispatch to Redux
      const stateUser = {
        user: {
          id: data.user.id,
          email: data.user.email,
          first_name: data.user.first_name,
          last_name: data.user.last_name,
          status_role: data.user.status_role,
          profile_pict: data.user.profile_pict,
          referal_code: data.user.referal_code,
          point: data.user.point,
          is_verified: data.user.is_verified,
        },
        token: data.token, // Including the token to store in Redux
      };

      // Dispatch the login action to update Redux state
      dispatch(onLogin(stateUser)); // Pass the user and token to Redux

      showSuccess('Login successful!'); // Show success toast
      router.push('/'); // Redirect to the home page after login

    } catch (err: any) {
      const statusCode = err?.response?.status;
      const errorMessage = err?.response?.data?.message || 'Login failed, please try again.';

      // Handle specific error codes
      if (statusCode === 404) {
        setErrorMessages((prev) => ({ ...prev, email: 'Unregistered email' }));
      } else if (statusCode === 401) {
        setErrorMessages((prev) => ({ ...prev, password: 'Incorrect password' }));
      } else {
        setErrorMessages((prev) => ({ ...prev, general: errorMessage }));
      }

      showError(errorMessage); // Show error toast
    } finally {
      setLoading(false);
      toast.dismiss(toastId); // Dismiss the loading toast
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 px-4">
      <Formik
        initialValues={initialValue}
        validationSchema={loginSchema}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          await login(values);
          resetForm();
          setSubmitting(false);
        }}
      >
        {(props: FormikProps<ILogin>) => {
          const { touched, errors, setFieldError } = props;

          return (
            <Form className="flex flex-col gap-5 w-full max-w-md bg-white p-10 rounded-2xl shadow-md relative">
              {/* Close Button */}
              <button
                type="button"
                className="absolute top-4 right-4 text-xl text-slate-400 hover:text-blue-500 transition"
                onClick={() => router.push('/')}
              >
                <AiOutlineClose />
              </button>

              <h2 className="text-2xl font-semibold text-slate-800 mb-4">Welcome Back</h2>

              <div className="flex flex-col w-full">
                <label className="text-sm font-medium text-slate-700 mb-1">E-Mail:</label>
                <Field
                  type="text"
                  name="email"
                  className="border border-slate-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md p-2 h-10 w-full bg-white text-slate-800 placeholder-slate-400 outline-none transition-all"
                  onFocus={() => {
                    setErrorMessages((prev) => ({ ...prev, email: '' }));
                    setFieldError('email', '');
                  }}
                />
                {touched.email && errors.email && (
                  <div className="text-red-600 text-xs mt-1">{errors.email}</div>
                )}
                {errorMessages.email && (
                  <div className="text-red-600 text-xs mt-1">{errorMessages.email}</div>
                )}
              </div>

              <div className="flex flex-col w-full">
                <label className="text-sm font-medium text-slate-700 mb-1">Password:</label>
                <div className="relative w-full">
                  <Field
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="border border-slate-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md p-2 h-10 w-full bg-white text-slate-800 placeholder-slate-400 outline-none transition-all"
                    onFocus={() => {
                      setErrorMessages((prev) => ({ ...prev, password: '' }));
                      setFieldError('password', '');
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-blue-500 hover:underline"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <div className="text-red-600 text-xs mt-1">{errors.password}</div>
                )}
                {errorMessages.password && (
                  <div className="text-red-600 text-xs mt-1">{errorMessages.password}</div>
                )}
              </div>

              <button
                type="submit"
                className="mt-2 p-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-all disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <p className="text-sm text-center text-slate-600 mt-4">
                Don't have an account?{' '}
                <Link href="/register" className="text-blue-600 hover:underline">
                  Sign Up Here
                </Link>
              </p>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
