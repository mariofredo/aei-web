'use client';
import {formatTime} from '@/utils';
import '../../styles/modalVerificationCode.scss';
export default function ModalVerificationCode({
  timer,
  resendDisabled,
  handleResendOTP,
  email,
}) {
  return (
    <div className="modal_wrapper">
      <div className="overlay"></div>
      <div className="modal_box">
        <h2>Email Verification</h2>
        <p>
          Click the link in the email {email} to confirm your account
          registration.
        </p>
        <p>Didn't receive the email? Resend it here in</p>
        <span>{formatTime(timer)}</span>
        {!resendDisabled && (
          <button
            className="green_btn resend_otp_btn"
            onClick={handleResendOTP}
            disabled={resendDisabled}
          >
            Resend Email
          </button>
        )}
      </div>
    </div>
  );
}
