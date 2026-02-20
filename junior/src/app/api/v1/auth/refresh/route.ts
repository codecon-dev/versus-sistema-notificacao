import { supabase } from '@/lib/supabase';
import { response } from '@/utils/response';

export async function POST(request: Request) {
  try {
    const refresh_token = request.headers
      .get('cookie')
      ?.split('; ')
      ?.find((c) => c.startsWith('sb-refresh-token='))
      ?.split('=')[1];

    if (!refresh_token)
      return response.badRequest('Missing refresh_token', null);

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token,
    });

    if (error || !data.session) {
      return response.unauthorized(
        error?.message || 'Failed to refresh session',
        null,
        error
      );
    }

    const res = response.ok('Session refreshed successfully');

    res.cookies.set('sb-access-token', data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: data.session.expires_in,
    });

    res.cookies.set('sb-refresh-token', data.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 dias
    });

    return res;
  } catch (err) {
    return response.internalError('Unexpected server error.', null, err);
  }
}
