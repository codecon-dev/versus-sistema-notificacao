'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from './login-form';

const Login = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#404040] relative overflow-hidden">
      {/* Background tech pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(#ea6524 1px, transparent 1px), linear-gradient(90deg, #ea6524 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-[#ea6524]/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#ea6524]/10 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-4">
        <Card className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 overflow-hidden">
          <CardHeader className="relative bg-gradient-to-br from-[#404040] to-[#505050] pt-8 pb-6">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ea6524]/20 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#ea6524]/10 rounded-full blur-xl" />

            <CardTitle className="flex flex-col items-center relative z-10">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-white">
                  Bem-vindo de volta
                </h1>
                <div className="flex items-center justify-center gap-2">
                  <div className="h-1 w-8 bg-[#ea6524] rounded-full" />
                  <p className="text-sm text-gray-300">Entre com sua conta</p>
                  <div className="h-1 w-8 bg-[#ea6524] rounded-full" />
                </div>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8">
            <LoginForm />
          </CardContent>

          {/* Footer decorative bar */}
          <div className="h-2 bg-gradient-to-r from-[#404040] via-[#ea6524] to-[#404040]" />
        </Card>

        {/* Security badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-300">
          <svg
            className="w-4 h-4 text-[#ea6524]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>Conexão segura e criptografada</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
