import { supabase } from '@/lib/supabase';
import { response } from '@/utils/response';

// [BACKLOG]
// TODO: Refresh token to cookies

export async function POST(request: Request) {
  try {
    const { access_token } = await request.json();
    if (!access_token) {
      return response.badRequest('Missing access_token', null);
    }

    const { data, error } = await supabase.auth.getUser(access_token);

    if (error || !data.user)
      return response.unauthorized('Invalid token', null, error);

    return response.ok('User verified successfully', {
      user: data.user,
      access_token,
    });
  } catch (err) {
    return response.internalError('Unexpected server error.', null, err);
  }
}
