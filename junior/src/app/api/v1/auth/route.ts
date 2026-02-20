import { supabase } from '@/lib/supabase';
import { response } from '@/utils/response';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return response.badRequest('Missing email or password', null);
    }

    // 1️⃣ Login no Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user || !data.session) {
      return response.unauthorized(error?.message ?? 'Login failed');
    }

    // 2️⃣ Buscar role na tabela pública users
    const { data: userProfile, error: userError } = await supabase
      .from('users')
      .select('id, name, role, is_active')
      .eq('id', data.user.id)
      .single();

    if (userError || !userProfile) {
      return response.unauthorized('User profile not found');
    }

    if (!userProfile.is_active) {
      return response.unauthorized('User is inactive');
    }

    // 3️⃣ Criar resposta
    const res = response.ok('Logged in successfully', {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: userProfile.name,
        role: userProfile.role,
      },
      access_token: data.session.access_token,
    });

    // 4️⃣ Cookies
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
