import { get } from '@/providers/api';
import axios from 'axios';

export interface IUser {
  id: string;
  name: string;
  role: 'admin' | 'public';
  is_active: boolean;
  created_at: string;
}

const getUsers = async (): Promise<IUser[]> => {
  try {
    const res = await get('users');

    return res.data?.data ?? [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching users:', error.message);
      throw new Error(error.response?.data?.message ?? 'Failed to fetch users');
    } else {
      console.error('Unexpected error fetching users:', error);
      throw new Error('Unexpected error');
    }
  }
};

export default getUsers;
