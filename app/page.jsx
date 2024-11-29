'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        // Cek apakah token ada di cookies
        const token = Cookies.get('token');

        // Jika token tidak ada, redirect ke halaman login
        if (!token) {
            router.push('/login');
        }
    }, [router]);

    return (
        <div>
            <h1>Welcome to the Home Page</h1>
            <p>If you see this, you're logged in.</p>
        </div>
    );
}
