'use client';
import { useState } from 'react';
import Link from 'next/link';
import '../../styles/completeProfile.scss';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);

    const handleSend = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setIsEmailSent(true);
            } else {
                alert('Failed to send email. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="section_complete_profile">
            <div className="container">
                {!isEmailSent ? (
                    <div className="scp_box">
                        <h2>Forgot Password</h2>
                        <h5>Please input your email</h5>
                        <div className="form_box">
                            <span>Email</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="button_wrapper">
                            <button className="green_btn" onClick={handleSend}>
                                Send
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="scp_box">
                        <h2>Check your email</h2>
                        <div className="fp_text">
                            <p>We already sent the reset password link to</p>
                            <strong>{email}</strong>
                            <p>Please check your inbox and spam folder.</p>
                            <div className="button_wrapper">
                                <button className="green_btn">
                                    <Link href="/">Okay</Link>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
