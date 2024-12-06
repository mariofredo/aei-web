'use client';
import { useState } from 'react';
import Cookies from 'js-cookie';

export default function ModalChangePassword({ showPopup, setShowPopup, id }) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    
    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState); // Toggle visibility
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prevState) => !prevState); // Toggle visibility
    };


    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const token = Cookies.get('token'); // Ambil token dari cookie
            const response = await fetch(`{{base_url}}/company-pic/${id}/update-password`, {
                method: 'POST', // atau PUT, sesuai kebutuhan API
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ password: newPassword }) // Sesuaikan nama parameter jika perlu
            });

            if (response.ok) {
                setError('');
                setShowPopup(false);
                alert('Password updated successfully');
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to update password');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred. Please try again later.');
        }
    };

    if (!showPopup) return null;

    return (
        <div className="modal_wrapper registration_form">
            <div className="overlay" onClick={() => setShowPopup(false)}></div>
            <div className="modal_box">
                <h2>Change Password</h2>
                <div className="modal_content">
                    <div className="form_box">
                        <label htmlFor="new_password">New Password</label>
                        <input
                            type="password"
                            id="new_password"
                            name="new_password"
                            placeholder="Enter your new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <div className={`show_pass ${showPassword ? "active" : ""}`} onClick={togglePasswordVisibility}>wkwwk</div>
                    </div>
                    <div className="form_box">
                        <label htmlFor="confirm_password">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm_password"
                            name="confirm_password"
                            placeholder="Confirm your new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <div className={`show_pass ${showConfirmPassword ? "active" : ""}`} onClick={toggleConfirmPasswordVisibility}>eeee</div>
                    </div>
                    {error && <p className="error_message">{error}</p>}
                    <div className="form_box">
                        <button className="submit_btn" onClick={handleChangePassword}>
                            <span>Submit</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
