import { NextResponse } from 'next/server';

// Middleware to handle authentication-based routing
export function middleware(req) {
    const token = req.cookies.get('token'); // Retrieve token from cookies
    const { pathname } = req.nextUrl; // Extract pathname from the request

    // Redirect unauthenticated users trying to access protected routes
    if (!token && pathname === '/') {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Redirect authenticated users away from login/register pages
    if (token && ['/login', '/register'].includes(pathname)) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next(); // Proceed to the requested page
}

// Configure matcher for applying middleware to specific routes
export const config = {
    matcher: ['/', '/login', '/register'], // Apply middleware only to these routes
};