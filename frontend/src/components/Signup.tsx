import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';

function Signup() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  async function handleSignup(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Registration failed');
        return;
      }

      localStorage.setItem('token', data.token);
      toast.success('Account created!');

      setTimeout(() => {
        navigate('/skill-matching');
      }, 1000);

      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Could not connect to server. Please try again.');
    }
  }

  return (
    <>
      {/* Header Row */}
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

        <h2
          className="header-title"
          style={{
            margin: 0,
            textAlign: 'center',
          }}
        >
          Create Account
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
        Sign up to continue
      </p>

      <div className="purple-card">
        <form
          onSubmit={handleSignup}
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
          }}
        >
          <div className="input-group">
            <label className="input-label">Name</label>

            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="text-input"
              placeholder="Enter your name"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Email</label>

            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
                value={formData.password}
                onChange={handleChange}
                className="text-input"
                placeholder="Create a password"
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

          <div className="input-group">
            <label className="input-label">Confirm Password</label>

            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <input
                required
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="text-input"
                placeholder="Confirm your password"
                style={{
                  width: '100%',
                  paddingRight: '45px',
                }}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
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
            <button type="submit" className="white-button">
              Sign Up
            </button>

            <button type="button" className="white-button" onClick={() => navigate('/login')}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  lineHeight: '1.4',
                }}
              >
                <span>Already have an account?</span>

                <span
                  style={{
                    fontWeight: '400',
                    color: 'var(--coconut-milk)',
                  }}
                >
                  Login Here
                </span>
              </div>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Signup;
