'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef, Suspense } from 'react';
import '../../../styles/verifyEmail.scss';
import Link from 'next/link';

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
        <div className="section_verify_email">
            <div className="svm_box">
                {loading ? (
                    <div className="loader"></div>
                ) : error ? (
                    <div className='svm_error'>
                        <h4>Verification Failed</h4>
                        <p>Verification link is expired, click button below to resend the verification link</p>
                        <button className='green_btn'><Link href="/register">Register</Link></button>
                    </div>
                ) : (
                    <div className='svm_success'>
                        <h4>Success!</h4>
                        <p>Email verification success, your account is created already</p>
                        <button className='green_btn'><Link href="/login">Login</Link></button>
                    </div>
                )}
            </div>
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