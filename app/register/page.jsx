'use client';
import { useState } from "react";
import Cookies from "js-cookie"; // Menggunakan js-cookie
import { ModalVerificationCode, SlickSlider } from "@/components";
import '../../styles/auth.scss';
import Link from "next/link";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); 
    const [agreement, setAgreement] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false); // Untuk popup
    const [resendDisabled, setResendDisabled] = useState(true); // Menonaktifkan tombol resend awalnya
    const [showPassword, setShowPassword] = useState(false); // State untuk mengontrol visibility password
    const [showConfirmPassword, setShowConfirmPassword] = useState(""); // State untuk confirm password
    const [timer, setTimer] = useState(30); // Timer untuk countdown

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState); // Toggle visibility
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prevState) => !prevState); // Toggle visibility
    };

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            alert("Please fill all the fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        if (!agreement) {
            alert("You must agree to the terms and conditions.");
            return;
        }

        setLoading(true);

        const payload = {
            email,
            password,
        };

        try {
            const response = await fetch("https://aei-api.superfk.co/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) { 
                //alert("Account created successfully!");
                
                // Tampilkan popup setelah berhasil registrasi
                setShowPopup(true);

                // Mulai timer setelah popup ditampilkan
                setResendDisabled(true);
                startTimer();
            } else {
                alert(data.message || "Failed to register.");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    const startTimer = () => {
        const countdown = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(countdown); // Stop timer
                    setResendDisabled(false); // Enable resend button
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleResendOTP = async () => {
        // Show a message indicating the resend is in progress (Optional)
        console.log("Resend OTP in progress...");
    
        try {
            // Send the API request to resend the OTP
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/email-verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email, // Send the email address to resend OTP
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                // On success, reset the timer and disable resend button again
                alert("OTP resent successfully!");
                setTimer(30); // Reset the timer to 30 seconds
                setResendDisabled(true); // Disable the button until the timer is finished
                startTimer(); // Start the timer again
    
                // Optionally, show a success message (you can use a modal or toast)
                alert("A new OTP has been sent to your email!");
            } else {
                // Handle failure (invalid response or other errors)
                console.error("Failed to resend OTP:", data.message);
                alert(data.message || "Failed to resend OTP. Please try again.");
            }
        } catch (error) {
            // Handle any errors that occur during the fetch call
            console.error("Error while resending OTP:", error);
            alert("An error occurred while resending the OTP. Please try again.");
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
                        <h3><span>Create</span> Account</h3>
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
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className={`show_pass ${showPassword ? "active" : ""}`} onClick={togglePasswordVisibility}></div>
                        </div>
                        <div className="form_box">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirmation Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <div className={`show_pass ${showConfirmPassword ? "active" : ""}`} onClick={toggleConfirmPasswordVisibility}></div>
                        </div>
                        <div className="form_box">
                            <div className="remember_box agreement">
                                <input
                                    type="checkbox"
                                    id="agreement"
                                    checked={agreement}
                                    onChange={(e) => setAgreement(e.target.checked)}
                                />
                                <label htmlFor="agreement">I agree to the terms and conditions</label>
                            </div>
                        </div>
                        <div className="button_wrapper">
                            <button
                                className="green_btn"
                                onClick={handleRegister}
                                disabled={loading}
                            >
                                {loading ? "Creating..." : "Create Account"}
                            </button>
                            <Link className="create_acc_btn" href="/login">Login</Link>
                        </div>
                    </div>
                </div>
            </div>
            {showPopup && (
                <ModalVerificationCode timer={timer} resendDisabled={resendDisabled} handleResendOTP={handleResendOTP} />
            )}
        </div>
    );
}
