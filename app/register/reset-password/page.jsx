'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef, Suspense } from 'react';
import '../../../styles/completeProfile.scss';

function ResetPassword() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');
    const hasFetched = useRef(false);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isResetSuccessful, setIsResetSuccessful] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            setError('Token is missing.');
            setLoading(false);
            return;
        }

        if (!hasFetched.current) {
            // Token validation or additional checks can go here if needed
            hasFetched.current = true;
            setLoading(false);
        }
    }, [token]);

    const handleResetPassword = async () => {
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, password }),
            });

            if (response.ok) {
                setIsResetSuccessful(true);
            } else {
                alert('Failed to reset password. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return (
            <div className="error">
                <h2>Error</h2>
                <p>{error}</p>
                <button className="green_btn" onClick={() => router.push('/')}>
                    Go to Home
                </button>
            </div>
        );
    }

    return (
        <div className="section_complete_profile">
            <div className="container">
                {!isResetSuccessful ? (
                    <div className="scp_box">
                        <h2>Reset Password</h2>
                        <div className="form_box">
                            <span>New Password</span>
                            <div className="password_field">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your new password"
                                />
                                <button
                                    className={showPassword ? 'active' : ''}
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>
                        <div className="form_box">
                            <span>Confirm Password</span>
                            <div className="password_field">
                                <input
                                    className={showPassword ? 'active' : ''}
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>
                        <div className="button_wrapper">
                            <button className="green_btn" onClick={handleResetPassword}>
                                Send
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="scp_box">
                        <h2>Password Reset Successful</h2>
                        <p>Your password has been successfully reset.</p>
                        <div className="button_wrapper">
                            <button className="green_btn" onClick={() => router.push('/')}>
                                Go to Login
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ResetPasswordInfo() {
    return (
      <Suspense fallback={<div className="loader center"></div>}>
        <ResetPassword />
      </Suspense>
    );
}