'use client';
import '../../styles/modalVerificationCode.scss';
export default function ModalVerificationCode({ timer, resendDisabled, handleResendOTP }){
     // Fungsi untuk mengubah timer detik menjadi format mm:ss
     const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };
    return(
        <div className="modal_wrapper">
            <div className="overlay"></div>
            <div className="modal_box">
                <h2>Email Verification</h2>
                <p>Click the link in the email company@gmail.com to confirm your account registration.</p>
                <p>Didn't receive the email? Resend it here in</p>
                <span>{formatTime(timer)}</span>
                {!resendDisabled && (
                    <button className="green_btn resend_otp_btn" onClick={handleResendOTP} disabled={resendDisabled}>
                        Resend OTP
                    </button>
                )}
            </div>
        </div>
    )
}