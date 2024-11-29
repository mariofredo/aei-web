'use client';
import { useState } from "react";
import Cookies from "js-cookie";
import { SlickSlider } from "@/components";
import '../../styles/auth.scss';
import Link from "next/link";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Please fill in all fields.");
            return;
        }

        setLoading(true);

        const payload = {
            email,
            password,
        };

        try {
            // Panggil API login
            const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const loginData = await loginResponse.json();

            if (loginResponse.ok) {
                const token = loginData.data.token;

                // Simpan token ke Cookies
                if (typeof window !== "undefined") {
                    Cookies.set("token", token, { secure: true, expires: 7 });
                }

                // Panggil API untuk cek status profil
                const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/register-step-2`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`, // Sertakan token dalam header
                    },
                });

                const profileData = await profileResponse.json();

                if (profileResponse.ok && profileData.data.isProfileComplete) {
                    alert("Login successful!");
                    window.location.href = "/";
                } else {
                    alert("Please complete your profile.");
                    window.location.href = "/register/complete-profile";
                }
            } else {
                alert(loginData.message || "Failed to login.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section_login">
            <div className="container">
                <div className="banner_slider">
                    <SlickSlider />
                </div>
                <div className="section_form">
                    <div className="sf_box">
                        <h3><span>Login</span> Your Account</h3>
                        <div className="form_box">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form_box">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className="show_pass"></div>
                        </div>
                        <div className="form_box">
                            <div className="remember_box">
                                <input type="checkbox" id="remember" />
                                <label htmlFor="remember">Remember me</label>
                            </div>
                            <Link className="forgot_password" href="#">Forgot Password?</Link>
                        </div>
                        <div className="button_wrapper">
                            <button
                                className="green_btn"
                                onClick={handleLogin}
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                            <Link className="create_acc_btn" href="/register">Create Account</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
