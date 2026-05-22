import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Login failed');
        return;
      }

      toast.success('Login successful');

      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      setTimeout(() => {
        window.location.href = '/home';
      }, 1000);

      console.log('Logged in user:', data.user);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Could not connect to server');
    }
  }

  return (
    <>
      <div
        style={{
          width: '100%',
          maxWidth: '800px',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '8px',
        }}
      >
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            position: 'absolute',
            left: '0',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <FiArrowLeft size={38} color="black" />
        </button>

        <h2 className="header-title" style={{ margin: 0, textAlign: 'center' }}>
          Sign In
        </h2>
      </div>

      <p
        className="header-subtitle"
        style={{
          width: '100%',
          textAlign: 'center',
          marginBottom: '30px',
        }}
      >
        Login to your account
      </p>

      <div className="purple-card">
        <form
          onSubmit={handleLogin}
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
          }}
        >
          <div className="input-group">
            <label className="input-label">Email</label>

            <input
              required
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-input"
              placeholder="Enter your email"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>

            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <input
                required
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-input"
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  paddingRight: '45px',
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#222',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginTop: '20px',
            }}
          >
            <button
              type="submit"
              className="white-button"
            >
              Login
            </button>

            <button
              type="button"
              className="white-button"
              onClick={() => navigate('/signup')}
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
