import { response } from '@/utils/response';

export async function POST() {
  try {
    const res = response.ok('Session refreshed successfully');

    res.cookies.set('sb-access-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });

    res.cookies.set('sb-refresh-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });

    return res;
  } catch (err) {
    return response.internalError('Unexpected server error.', null, err);
  }
}
