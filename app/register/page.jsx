'use client';
import {useState} from 'react';
import Cookies from 'js-cookie'; // Menggunakan js-cookie
import {Button, Modal, ModalVerificationCode, SlickSlider} from '@/components';
import '../../styles/auth.scss';
import Link from 'next/link';
import {useCallback} from 'react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreement, setAgreement] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // Untuk popup
  const [resendDisabled, setResendDisabled] = useState(true); // Menonaktifkan tombol resend awalnya
  const [showPassword, setShowPassword] = useState(false); // State untuk mengontrol visibility password
  const [showConfirmPassword, setShowConfirmPassword] = useState(''); // State untuk confirm password
  const [timer, setTimer] = useState(30); // Timer untuk countdown
  const [modal, setModal] = useState(false);
  const [agreeOnTerms, setAgreeOnTerms] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState); // Toggle visibility
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState); // Toggle visibility
  };

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      alert('Please fill all the fields.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    if (!agreement) {
      alert('You must agree to the terms and conditions.');
      return;
    }

    setLoading(true);

    const payload = {
      email,
      password,
    };

    try {
      const response = await fetch('https://aei-api.superfk.co/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        alert(data.message || 'Failed to register.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred. Please try again.');
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
    console.log('Resend OTP in progress...');

    try {
      // Send the API request to resend the OTP
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/email-verify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email, // Send the email address to resend OTP
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // On success, reset the timer and disable resend button again
        setTimer(30); // Reset the timer to 30 seconds
        setResendDisabled(true); // Disable the button until the timer is finished
        startTimer(); // Start the timer again
        // Optionally, show a success message (you can use a modal or toast)
        alert('A new link has been sent to your email!');
      } else {
        // Handle failure (invalid response or other errors)
        console.error('Failed to resend OTP:', data.message);
        alert(data.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      // Handle any errors that occur during the fetch call
      console.error('Error while resending OTP:', error);
      alert('An error occurred while resending the OTP. Please try again.');
    }
  };

  const handleRenderModal = useCallback(() => {
    return (
      modal && (
        <Modal>
          <div className="modal_terms_condition">
            <h1>Terms and Conditions</h1>
            <p>
              Please read these Terms and Conditions carefully before using our
              platform.
            </p>
            <ol>
              <li>
                <span>Acceptance of Terms</span>
                <ul>
                  <li>
                    By accessing or using our services, you agree to be bound by
                    these terms.
                  </li>
                  <li>
                    If you disagree with any part of the terms, you may not
                    access the service.
                  </li>
                </ul>
              </li>
              <li>
                <span>Use of Service</span>
                <ol>
                  <li>
                    The platform may only be used for lawful purposes and in a
                    lawful manner.
                  </li>
                  <li>
                    Users must not engage in activities that harm the integrity
                    of the platform.
                    <ul>
                      <li>
                        Spamming, hacking, or phishing activities are strictly
                        prohibited.
                      </li>
                      <li>
                        Users must comply with all applicable laws and
                        regulations.
                      </li>
                    </ul>
                  </li>
                </ol>
              </li>
              <li>
                <span>Termination</span>
                <ul>
                  <li>
                    We reserve the right to terminate or suspend your access for
                    violations of these terms.
                  </li>
                  <li>
                    Any data associated with your account may be deleted upon
                    termination.
                  </li>
                </ul>
              </li>
            </ol>
            <div style={{margin: '0 auto', display: 'flex', gap: '10px'}}>
              <Button
                type="solid"
                text="Disagree"
                bgColor="#E4E4E4"
                color="#332C2B"
                padding="8px 36px"
                borderRadius="8px"
                width="160px"
                onClick={() => {
                  setAgreeOnTerms(false);
                  setModal(false);
                }}
              />
              <Button
                type="solid"
                text="Agree"
                bgColor="#009B4C"
                color="#fff"
                padding="8px 36px"
                borderRadius="8px"
                width="160px"
                onClick={() => {
                  setAgreeOnTerms(true);
                  setModal(false);
                }}
              />
            </div>
          </div>
        </Modal>
      )
    );
  }, [modal]);

  return (
    <div className="section_login">
      {handleRenderModal()}
      <div className="container">
        <div className="banner_slider">
          <SlickSlider />
        </div>
        <div className="section_form">
          <div className="sf_box">
            <h3>
              <span>Create</span> Account
            </h3>
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
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                className={`show_pass ${showPassword ? 'active' : ''}`}
                onClick={togglePasswordVisibility}
              ></div>
            </div>
            <div className="form_box">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Password Confirmation"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div
                className={`show_pass ${showConfirmPassword ? 'active' : ''}`}
                onClick={toggleConfirmPasswordVisibility}
              ></div>
            </div>
            <div className="form_box">
              <div className="remember_box agreement">
                <input
                  type="checkbox"
                  id="agreement"
                  checked={agreeOnTerms}
                  onChange={(e) => setModal(true)}
                  style={{cursor: 'pointer'}}
                />
                <label
                  htmlFor="agreement"
                  style={{cursor: 'pointer', display: 'block'}}
                >
                  I agree to the{' '}
                  <span style={{color: '#2F318B', textDecoration: 'underline'}}>
                    terms and conditions and Privacy Policy{' '}
                  </span>
                </label>
              </div>
            </div>
            <div className="button_wrapper">
              <button
                className="green_btn"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Account'}
              </button>
              <Link className="create_acc_btn" href="/login">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
      {showPopup && (
        <ModalVerificationCode
          timer={timer}
          resendDisabled={resendDisabled}
          handleResendOTP={handleResendOTP}
          email={email}
        />
      )}
    </div>
  );
}
