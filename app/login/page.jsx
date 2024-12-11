'use client';
import {useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import {SlickSlider} from '@/components';
import '../../styles/auth.scss';
import Link from 'next/link';
import {useRouter} from 'next/navigation'; // For programmatic navigation

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State untuk mengontrol visibility password
  const router = useRouter(); // For navigation after login

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState); // Toggle visibility
  };

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        alert('Please fill in all fields.');
        return;
      }

      setLoading(true);

      const payload = {
        email,
        password,
      };
      // Panggil API login
      const loginResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const loginData = await loginResponse.json();

      if (loginResponse.ok) {
        const {token, is_profile_completed, user} = loginData.data;
        const {type, email} = user;

        Cookies.set('token', token, {expires: 7, path: '/'});
        Cookies.set('is_profile_completed', is_profile_completed, {
          expires: 7,
          path: '/',
        });
        Cookies.set('type', type, {expires: 7, path: '/'});
        Cookies.set('email', email, {expires: 7, path: '/'});
        if (is_profile_completed) {
          router.push('/');
        } else {
          router.push('/register/complete-profile');
        }
      } else {
        alert(loginData.message || 'Failed to login.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='section_login'>
      <div className='container'>
        <div className='banner_slider'>
          <SlickSlider />
        </div>
        <div className='section_form'>
          <div className='sf_box'>
            <h3>
              <span>Login</span> Your Account
            </h3>
            <div className='form_box'>
              <input
                type='email'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='form_box'>
              <input
                type={showPassword ? 'text' : 'password'} // Ubah tipe berdasarkan state
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                className={`show_pass ${showPassword ? 'active' : ''}`}
                onClick={togglePasswordVisibility}
              ></div>
            </div>
            <div className='form_box'>
              <div className='remember_box'>
                <input type='checkbox' id='remember' />
                <label htmlFor='remember'>Remember me</label>
              </div>
              <Link className='forgot_password' href='#'>
                Forgot Password?
              </Link>
            </div>
            <div className='button_wrapper'>
              <button
                className='green_btn'
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
              <Link className='create_acc_btn' href='/register'>
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
