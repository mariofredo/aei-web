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
            const response = await fetch("https://aei-api.superfk.co/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                const token = data.data.token;
                // Simpan token ke Cookies hanya di sisi klien
                if (typeof window !== "undefined") {
                    Cookies.set("token", token, { secure: true, expires: 7 });
                }

                alert("Login successful!");
                // Redirect ke halaman dashboard atau lainnya
                window.location.href = "/";
            } else {
                alert(data.message || "Failed to login.");
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
