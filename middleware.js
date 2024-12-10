import {NextResponse} from 'next/server';
export function middleware(req) {
  const token = req.cookies.get('token')?.value; // Ambil token dari cookies
  const isProfileCompleted = req.cookies.get('is_profile_completed')?.value; // Ambil value
  const {pathname} = req.nextUrl; // Path saat ini

  console.log(token, 'token');
  // Jika tidak ada token
  if (!token && pathname !== '/login' && pathname !== '/register') {
    console.log('No token found, redirecting to /login');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Jika token ditemukan

  if (token) {
    // Cek apakah profil belum selesai
    if (
      isProfileCompleted === 'false' &&
      pathname !== '/register/complete-profile'
    ) {
      return NextResponse.redirect(
        new URL('/register/complete-profile', req.url)
      );
    }

    // Jika profil selesai

    if (
      isProfileCompleted === 'true' &&
      ['/login', '/register', '/register/complete-profile'].includes(pathname)
    ) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next(); // Lanjutkan ke halaman tujuan
}

// Konfigurasi matcher middleware
export const config = {
  matcher: ['/', '/login', '/register', '/register/complete-profile'],
};
