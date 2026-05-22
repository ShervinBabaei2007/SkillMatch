import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type User = {
  name: string;
  email?: string;
  phone?: string;
  role: string;
  profilePicture: string | null;
  workshopsAttended: number;
  friends: string[];
  bio: string;
  interests: string[];
  social: {
    instagram: string;
    facebook: string;
  };
  position: string;
};

type Workshop = {
  _id: string;
  name: string;
  imageUrl: string;
  date: string;
  time: string;
  price?: number | string;
  ticketPrice?: number | string;
  hostedBy: {
    name: string;
    profilePicture: string | null;
  };
};

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [hostedWorkshops, setHostedWorkshops] = useState<Workshop[]>([]);
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'registered' | 'hosting'>('registered');
  const [registeredWorkshops, setRegisteredWorkshops] = useState<Workshop[]>([]);
  const navigate = useNavigate();

  // Fetches the logged-in user's profile and the workshops they are hosting.
  // Redirects to a logged-out state if the token is missing or invalid.
  useEffect(() => {
    const fetchAll = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setUser(null);
        setNotLoggedIn(true);
        return;
      }

      try {
        const [profileRes, workshopsRes] = await Promise.all([
          axios.get('http://localhost:3000/api/profile/me', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:3000/api/workshops/mine', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUser(profileRes.data);
        localStorage.setItem('skills', JSON.stringify(profileRes.data.interests || []));
        setHostedWorkshops(workshopsRes.data);
      } catch (err: unknown) {
        console.error('Failed to fetch profile:', err);

        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            setNotLoggedIn(true);
          } else {
            const message = err.response?.data?.error || 'Failed to load profile.';
            toast.error(message);
          }
        } else {
          toast.error('An unexpected error occurred.');
        }
      }
    };

    fetchAll();
  }, []);

  // Fetches registered workshops independently.
  // We do not combine this with the main profile fetch to avoid blocking the initial UI render.
  // This allows the user's profile to load instantly, even if this specific query is slow.
  useEffect(() => {
    const fetchRegistered = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setUser(null);
          setNotLoggedIn(true);
          return;
        }
        const res = await axios.get('http://localhost:3000/api/workshops/attending', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRegisteredWorkshops(res.data);
      } catch (error) {
        console.error('Failed to fetch registered workshops:', error);
        toast.error("Failed to fetch registred workshops. Please try again!")
      }
    };
    fetchRegistered();
  }, []);

  const handleDelete = async (workshopId: string) => {
    if (!confirm('Are you sure you want to delete this workshop?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/workshops/${workshopId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHostedWorkshops((prev) => prev.filter((w) => w._id !== workshopId));
    } catch (error) {
      console.error('Failed to delete workshop:', error);
      toast.error('Failed to delete workshop. Please try again.');
    }
  };

  if (notLoggedIn) {
    return (
      <div className="profile-page">
        <div className="purple-card">
          <h4 style={{ textAlign: 'center' }}>You are not logged in yet.</h4>
          <p
            style={{
              color: 'white',
              marginBottom: '20px',
              textAlign: 'center',
              marginTop: '1.5rem',
            }}
          >
            Want to sign up or log in?
          </p>
          <button className="primary-button" onClick={() => navigate('/signup')}>
            Yes, Sign Up
          </button>
          <button
            className="primary-button"
            onClick={() => navigate('/login')}
            style={{ marginTop: '10px' }}
          >
            Already have an account? Login
          </button>
          <button
            className="primary-button"
            style={{ marginTop: '10px', background: 'var(--dark-purple)' }}
            onClick={() => navigate('/home')}
          >
            No, Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div className="profile-page">Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="screen-header">
        <h2 className="header-title">Profile</h2>
        <div className="header-actions">
          <button className="edit-btn" onClick={() => navigate('/course/profile/edit')}>
            ✏️ Edit
          </button>
          <button
            className="signout-btn"
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              localStorage.removeItem('skills');
              setUser(null);
              setHostedWorkshops([]);
              setRegisteredWorkshops([]);
              setNotLoggedIn(true);
              toast.success('You have been logged out');
              navigate('/login');
            }}
          >
            🚪 Sign Out
          </button>
        </div>
      </div>
      <div className="profile-info">
        <div className="avatar-wrapper">
          {user.profilePicture ? (
            <img src={user.profilePicture} alt="avatar" className="avatar" />
          ) : (
            <div className="avatar-placeholder">{user.name ? user.name[0].toUpperCase() : '?'}</div>
          )}
        </div>
        <div className="profile-meta">
          <p className="profile-username">@{user.name}</p>
          <p className="profile-role">{user.position}</p>
        </div>
      </div>
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-number">{user.workshopsAttended}</span>
          <span className="stat-label">Workshops attended</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{user.friends.length}</span>
          <span className="stat-label">Friends</span>
        </div>
      </div>
      <div
        className="purple-card"
        style={{
          background: 'var(--bg-white)',
          border: '2px solid var(--primary-purple)',
          color: 'var(--text-dark)',
        }}
      >
        <h4 style={{ color: 'var(--text-dark)' }}>About me</h4>
        <p className="about-bio" style={{ color: 'var(--text-dark)' }}>
          {user.bio}
        </p>
        <p className="interests-title" style={{ color: 'var(--text-dark)' }}>
          Interests
        </p>
        <div className="interests-list">
          {user.interests.map((interest) => (
            <span
              key={interest}
              className="interest-tag"
              style={{
                background: 'var(--primary-purple)',
                color: 'var(--bg-white)',
              }}
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
      <div className="posts-section">
        {(user.social?.instagram || user.social?.facebook) && (
          <div className="contact-section">
            <h2 className="header-title">Contact Me</h2>
            <div className="social-links">
              {user.social?.instagram && (
                <a href={user.social.instagram} target="_blank" rel="noreferrer">
                  <img
                    src="https://cdn.simpleicons.org/instagram/E4405F"
                    className="social-icon"
                    alt="Instagram"
                  />
                </a>
              )}
              {user.social?.facebook && (
                <a href={user.social.facebook} target="_blank" rel="noreferrer">
                  <img
                    src="https://cdn.simpleicons.org/facebook/1877F2"
                    className="social-icon"
                    alt="Facebook"
                  />
                </a>
              )}
            </div>
          </div>
        )}

        <div className="workshops-section">
          <h2 className="header-title">Workshops</h2>

          <div className="workshop-tabs">
            <button
              className={`workshop-tab ${activeTab === 'registered' ? 'workshop-tab--active' : ''}`}
              onClick={() => setActiveTab('registered')}
            >
              Registered
            </button>
            <button
              className={`workshop-tab ${activeTab === 'hosting' ? 'workshop-tab--active' : ''}`}
              onClick={() => setActiveTab('hosting')}
            >
              Hosting
            </button>
          </div>

          <div className="workshop-list">
            {activeTab === 'hosting' && hostedWorkshops.length === 0 ? (
              <p
                style={{
                  color: 'var(--text-gray)',
                  textAlign: 'center',
                  marginTop: '20px',
                  marginBottom: '30px',
                }}
              >
                No current hosted workshops
              </p>
            ) : (
              activeTab === 'hosting' &&
              hostedWorkshops.map((workshop) => (
                <div
                  key={workshop._id}
                  className="workshop-card"
                  onClick={() => navigate('/host/preview', { state: workshop })}
                >
                  <img
                    src={workshop.imageUrl || 'https://placehold.co/400x200?text=Workshop'}
                    alt={workshop.name}
                    className="workshop-thumbnail"
                  />
                  <div className="workshop-info">
                    <p className="workshop-name">{workshop.name}</p>
                    <div className="workshop-host">
                      {workshop.hostedBy?.profilePicture ? (
                        <img
                          src={workshop.hostedBy.profilePicture}
                          alt={workshop.hostedBy?.name}
                          className="avatar"
                          style={{ width: '20px', height: '20px' }}
                        />
                      ) : (
                        <div
                          className="avatar-placeholder"
                          style={{ width: '20px', height: '20px', fontSize: '10px' }}
                        >
                          {workshop.hostedBy?.name ? workshop.hostedBy.name[0].toUpperCase() : '?'}
                        </div>
                      )}
                      <span>{workshop.hostedBy?.name}</span>
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.85 }}>
                      <p style={{ margin: 0 }}>📅 {workshop.date}</p>
                      <p style={{ margin: 0 }}>🕐 {workshop.time}</p>
                    </div>
                  </div>
                  <button
                    className="delete-workshop-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(workshop._id);
                    }}
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}

            {activeTab === 'registered' &&
              (registeredWorkshops.length === 0 ? (
                <p
                  style={{
                    color: 'var(--text-gray)',
                    textAlign: 'center',
                    marginTop: '20px',
                    marginBottom: '30px',
                  }}
                >
                  No registered workshops yet
                </p>
              ) : (
                registeredWorkshops.map((workshop) => (
                  <div
                    key={workshop._id}
                    className="workshop-card"
                    onClick={() => navigate('/workshop/preview', { state: { _id: workshop._id } })}
                    style={{ position: 'relative', cursor: 'pointer' }}
                  >
                    <img
                      src={workshop.imageUrl || 'https://placehold.co/400x200?text=Workshop'}
                      alt={workshop.name}
                      className="workshop-thumbnail"
                    />
                    <div className="workshop-info" style={{ paddingBottom: '40px' }}>
                      <p className="workshop-name">{workshop.name}</p>
                      <div className="workshop-host">
                        {workshop.hostedBy?.profilePicture ? (
                          <img
                            src={workshop.hostedBy.profilePicture}
                            alt={workshop.hostedBy?.name}
                            className="avatar"
                            style={{ width: '20px', height: '20px' }}
                          />
                        ) : (
                          <div
                            className="avatar-placeholder"
                            style={{ width: '20px', height: '20px', fontSize: '10px' }}
                          >
                            {workshop.hostedBy?.name
                              ? workshop.hostedBy.name[0].toUpperCase()
                              : '?'}
                          </div>
                        )}
                        <span>{workshop.hostedBy?.name}</span>
                      </div>
                      <div style={{ fontSize: '12px', opacity: 0.85 }}>
                        <p style={{ margin: 0 }}>📅 {workshop.date}</p>
                        <p style={{ margin: 0 }}>🕐 {workshop.time}</p>
                      </div>
                    </div>

                    {/* View Receipt Button Link Setup */}
                    <button
                      className="view-receipt-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/course/receipt', {
                          state: {
                            workshopId: workshop._id,
                            workshopName: workshop.name,
                            isViewOnly: true,
                            refNum: `REF-${workshop._id.slice(-6).toUpperCase()}`,
                            receiptQR: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${workshop._id}`,
                            ticketPrice: workshop.price || workshop.ticketPrice || 0,
                            ticketAmount: 1,
                            // Passes the real user email & phone, or fallback if empty in DB
                            email: user.email || 'Email not provided',
                            phone: user.phone || 'Phone not provided',
                          },
                        });
                      }}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        bottom: '12px',
                        backgroundColor: '#8A73FF',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      }}
                    >
                      📄 View Receipt
                    </button>
                  </div>
                ))
              ))}
          </div>

          <button
            className="primary-button"
            onClick={() => navigate('/host')}
            style={{ marginTop: '16px', width: '100%' }}
          >
            🎓 Host a Workshop
          </button>
        </div>
      </div>
    </div>
  );
}
