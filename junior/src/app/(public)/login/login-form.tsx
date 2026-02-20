'use client';

import React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import doLogin from '@/services/auth/doLogin';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { toast } from 'sonner';

const loginFormSchema = z.object({
  email: z.string().email('Email inválido').nonempty('Email é obrigatório'),
  password: z.string().nonempty('Senha é obrigatória'),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;

// Ícones SVG inline
const EmailIcon = () => (
  <svg
    className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const LockIcon = () => (
  <svg
    className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const LoginIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
    />
  </svg>
);

const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const LoginForm = () => {
  const router: AppRouterInstance = useRouter();

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (data: LoginFormSchema) => {
    const status = await doLogin(data, router);

    if (status === 401) {
      form.setError('password', {
        type: 'manual',
        message: 'Email ou senha inválidos',
      });
      form.setValue('password', '');
      form.setFocus('password');

      toast.warning('Erro de autenticação', {
        description: () => (
          <p className="text-zinc-400">Email ou senha inválidos</p>
        ),
        position: 'bottom-center',
        duration: 5000,
        action: {
          label: 'Fechar',
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    } else if (status === 500) {
      form.setError('password', {
        type: 'manual',
        message: 'Erro interno do servidor',
      });

      toast.warning('Erro interno', {
        description: () => (
          <p className="text-zinc-400">Erro ao tentar conectar ao servidor</p>
        ),
        position: 'bottom-center',
        duration: 5000,
        action: {
          label: 'Fechar',
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    } else if (status === 200) {
      toast.success('Usuário logado com sucesso!', {
        duration: 5000,
        action: {
          label: 'Fechar',
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    } else {
      form.setError('password', {
        type: 'manual',
        message: 'Erro desconhecido',
      });
      toast.warning('Erro desconhecido', {
        position: 'bottom-center',
        duration: 5000,
        action: {
          label: 'Fechar',
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-5">
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-[#404040]">
                Email
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <EmailIcon />
                  <Input
                    {...field}
                    type="email"
                    placeholder="seu@email.com"
                    disabled={isSubmitting}
                    className="pl-11 h-12 rounded-xl border-2 border-gray-200 
                             focus:border-[#ea6524] focus:ring-2 focus:ring-[#ea6524]/20
                             transition-all duration-300 bg-gray-50 focus:bg-white
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs font-medium" />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm font-semibold text-[#404040]">
                  Senha
                </FormLabel>
                <button
                  type="button"
                  className="text-xs text-[#ea6524] hover:text-[#d45a1f] 
                           font-medium transition-colors duration-200"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <FormControl>
                <div className="relative">
                  <LockIcon />
                  <Input
                    {...field}
                    type="password"
                    placeholder="••••••••"
                    disabled={isSubmitting}
                    className="pl-11 h-12 rounded-xl border-2 border-gray-200 
                             focus:border-[#ea6524] focus:ring-2 focus:ring-[#ea6524]/20
                             transition-all duration-300 bg-gray-50 focus:bg-white
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs font-medium" />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-[#ea6524] text-white hover:bg-[#d45a1f] 
                   rounded-xl font-semibold text-base shadow-lg shadow-[#ea6524]/30
                   hover:shadow-xl hover:shadow-[#ea6524]/40 transition-all 
                   duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                   disabled:opacity-50 disabled:cursor-not-allowed 
                   disabled:hover:scale-100 disabled:shadow-none
                   flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner />
              <span>Entrando...</span>
            </>
          ) : (
            <>
              <LoginIcon />
              <span>Entrar</span>
            </>
          )}
        </Button>

        {/* Divider */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-4 text-gray-500 font-medium">
              Precisa de ajuda?
            </span>
          </div>
        </div>

        {/* Help section */}
        <div
          className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 
                      border border-gray-100 text-center"
        >
          <p className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <button
              type="button"
              className="text-[#ea6524] hover:text-[#d45a1f] font-semibold 
                       transition-colors duration-200 hover:underline"
            >
              Entre em contato
            </button>
          </p>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
