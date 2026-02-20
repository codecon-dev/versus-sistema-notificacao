import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { LoginFormSchema } from '@/app/(public)/login/login-form';
import { post } from '@/providers/api';
import axios from 'axios';

const doLogin = async (
  data: LoginFormSchema,
  router: AppRouterInstance
): Promise<number> => {
  try {
    const res = await post('auth', {
      body: {
        email: data.email,
        password: data.password,
      },
    });

    const role = res.data?.data?.user?.role;

    if (role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/public');
    }

    return 200;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error during authentication:', error.message);
      return error.response?.status || 500;
    } else {
      console.error('Unexpected error during authentication:', error);
      return 500;
    }
  }
};

export default doLogin;
