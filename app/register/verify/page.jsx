'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef, Suspense } from 'react';
import Cookies from 'js-cookie';

function VerifyEmail() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [verificationStatus, setVerificationStatus] = useState(null);

    const hasFetched = useRef(false); // Flag untuk melacak apakah API sudah dipanggil

    useEffect(() => {
        if (!token) {
            setError('Token is missing.');
            setLoading(false);
            return;
        }

        if (hasFetched.current) return; // Jika sudah dipanggil, hentikan

        hasFetched.current = true; // Tandai bahwa API sudah dipanggil

        const verifyEmail = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/register-verify?token=${token}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json();

                if (response.ok) {
                    setVerificationStatus('Email verified successfully!');
                    router.push('/login');
                } else {
                    setError(data.message || "Verification failed.");
                }
            } catch (error) {
                console.error("Error during email verification:", error);
                setError("An error occurred while verifying the email.");
            } finally {
                setLoading(false);
            }
        };

        verifyEmail();
    }, [token, router]);

    return (
        <div className="verify-email">
            {loading ? (
                <p>Verifying...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <p>{verificationStatus}</p>
            )}
        </div>
    );
}

export default function VerifyEmailInfo(){
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <VerifyEmail />
        </Suspense>
    );
}