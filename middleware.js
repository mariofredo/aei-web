import { NextResponse } from 'next/server';

// Middleware untuk mengarahkan pengguna yang belum login ke halaman login
export function middleware(req) {
    const token = req.cookies.get('token'); // Ambil token dari cookie

    // Jika token tidak ada dan user mencoba mengakses halaman dashboard, redirect ke login
    if (!token && req.nextUrl.pathname.startsWith('/')) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Jika token ada dan user mencoba mengakses halaman login/register, redirect ke dashboard
    if (token && ['/login', '/register'].includes(req.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next(); // Lanjutkan ke halaman yang diminta
}

// Konfigurasi matcher untuk halaman yang perlu middleware
export const config = {
    matcher: ['/', '/login', '/register'], // Tentukan halaman-halaman yang menggunakan middleware
};
