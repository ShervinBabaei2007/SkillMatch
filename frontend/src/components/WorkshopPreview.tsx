import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type Review = {
  name: string;
  comment: string;
  rating: number;
  createdAt?: string;
};

type Attendee = {
  _id: string;
  name: string;
  profilePicture: string | null;
  joinedAt?: string;
};

type Host = {
  _id: string;
  name: string;
  profilePicture: string | null;
};

const WorkshopPreview: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showAllAttendees, setShowAllAttendees] = useState(false);
  const [currentUser, setCurrentUser] = useState<Host | null>(null);

  const data = location.state || {
    name: 'Pottery and Sculpting Basics',
    date: 'May 20, 2026',
    time: '10:00 AM - 11:35 AM',
    location: '33 W 8th Ave, Vancouver',
    about:
      'This workshop will cover the fundamental techniques of pottery and sculpting. Participants will learn hand-building methods such as pinch pots, coiling, and slab construction...',
    ticketPrice: '$50',
    applicationPeriodStart: 'March 20, 2026',
    applicationPeriodEnd: 'April 27, 2026',
    seats: '35',
  };

  const [workshopData, setWorkshopData] = useState(data);
  const token = localStorage.getItem('token');

  let currentUserId = null;
  if (token) {
    try {
      currentUserId = JSON.parse(atob(token.split('.')[1])).id;
    } catch {
      console.warn('Invalid token structure detected.');
    }
  }

  // Determining whether the current user owns the workshop
  const isOwner =
    workshopData.hostedBy &&
    currentUserId &&
    (typeof workshopData.hostedBy === 'object'
      ? workshopData.hostedBy._id
      : workshopData.hostedBy
    ).toString() === currentUserId;

  // Fetching fresh workshop data when dependencies change
  useEffect(() => {
    let isMounted = true;
    const fetchWorkshop = async () => {
      if (!data._id) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/workshops/${data._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('token');
            toast.error('Session expired or invalid. Please log in again.');
            navigate('/login');
          }
          throw new Error('Backend rejected the request');
        }
        const fresh = await res.json();
        if (isMounted) setWorkshopData(fresh);
      } catch (err) {
        console.error('Workshop fetch failed', err);
      }
    };

    fetchWorkshop();
    return () => {
      isMounted = false;
    };
  }, [data._id, token, location.key, navigate]);

  // Fetches the logged-in user's profile and stores it in state, re-running whenever the token changes
  useEffect(() => {
    if (!token) return;
    let isMounted = true;

    const fetchCurrentUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Request failed');

        const user = await res.json();
        if (isMounted)
          setCurrentUser({
            _id: user._id,
            name: user.name,
            profilePicture: user.profilePicture ?? null,
          });
      } catch {
        console.error('Failed to fetch current user');
      }
    };

    fetchCurrentUser();
    return () => {
      isMounted = false;
    };
  }, [token]);

  // Sort reviews newest first.
  // If any review has a createdAt timestamp, sort descending by date.
  // Otherwise falls back to reversing insertion order — the backend appends new reviews
  // to the end of the array, so reversing puts the newest one at the top.
  const rawReviews: Review[] = workshopData.reviews || [];
  const hasTimestamps = rawReviews.some((r: Review) => r.createdAt);
  const sortedReviews: Review[] = hasTimestamps
    ? [...rawReviews].sort(
        (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
      )
    : [...rawReviews].reverse();

  const avgRating =
    sortedReviews.length > 0
      ? (
          sortedReviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / sortedReviews.length
        ).toFixed(1)
      : '0.0';

  const visibleReviews = showAllReviews ? sortedReviews : sortedReviews.slice(0, 3);

  // Sort attendees newest first (most recently joined = last in array, so reverse)
  const attendees: Attendee[] = [...(workshopData.attendees || [])].reverse();
  const visibleAttendees = showAllAttendees ? attendees : attendees.slice(0, 5);

  const host: Host | null =
    typeof workshopData.hostedBy === 'object' ? workshopData.hostedBy : currentUser;

  const totalSeats = parseInt(workshopData.seats) || 0;
  const capacityPercent = totalSeats > 0 ? attendees.length / totalSeats : 0;

  // Status of workshops
  const getStatusBadge = () => {
    if (capacityPercent >= 1)
      return { label: 'Closed', color: '#fee2e2', borderColor: '#ff8b8b', textColor: '#ff8b8b' };
    if (capacityPercent >= 0.9)
      return {
        label: 'Nearly Full',
        color: '#fee2e2',
        borderColor: '#ff8b8b',
        textColor: '#ff8b8b',
      };
    if (capacityPercent >= 0.75)
      return {
        label: 'Filling Up',
        color: '#fef9c3',
        borderColor: '#eab308',
        textColor: '#a16207',
      };
    return {
      label: 'Open',
      color: '#dff7e2',
      borderColor: 'var(--text-dark)',
      textColor: 'var(--text-dark)',
    };
  };

  const badge = getStatusBadge();
  const isClosed = capacityPercent >= 1;
  const isAttending = attendees.some((a) => a._id === currentUserId);

  // Show "start – end" if both dates exist, otherwise fall back to the old single date field (or "—" if nothing)
  const applicationPeriodDisplay = (() => {
    if (workshopData.applicationPeriodStart && workshopData.applicationPeriodEnd) {
      return `${workshopData.applicationPeriodStart} – ${workshopData.applicationPeriodEnd}`;
    }
    return workshopData.applicationPeriod || '—';
  })();

  const handleHost = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/workshops`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      setShowModal(false);
      toast.success('Workshop hosted successfully!');
      setTimeout(() => {
        navigate('/course/profile');
      }, 1000);
    } catch {
      toast.error('Failed to host workshop. Try again.');
    }
  };

  const handleAttend = () => {
    navigate('/course/register', {
      state: {
        workshopId: workshopData._id,
        ticketPrice: parseFloat(workshopData.ticketPrice?.replace(/[^0-9.]/g, '')) || 0, // removes all expressions (commas, etc) other than 0 to 9
      },
    });
  };

  return (
    <div className="host-page-container" style={{ padding: '0 20px 160px 20px' }}>
      <div
        className="screen-header"
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: '30px',
          marginBottom: '15px',
        }}
      >
        <button
          className="back-button"
          onClick={() => navigate(-1)}
          type="button"
          style={{ color: 'var(--text-dark)' }}
        >
          ←
        </button>
        <h2 className="header-title" style={{ margin: 0, fontSize: '2rem' }}>
          Workshop Info
        </h2>
      </div>

      {/* Workshop image — show the uploaded/fetched image directly */}
      <img
        src={workshopData.imageUrl || 'https://placehold.co/800x400?text=Workshop+Image'}
        alt={workshopData.name || 'Workshop'}
        className="hero-image"
        style={{ borderRadius: '12px', marginBottom: '16px', width: '100%', objectFit: 'cover' }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px',
        }}
      >
        <span
          style={{
            backgroundColor: badge.color,
            color: badge.textColor,
            padding: '6px 20px',
            borderRadius: '20px',
            border: `1px solid ${badge.borderColor}`,
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          {badge.label}
        </span>
        <span style={{ fontWeight: '600', fontSize: '16px' }}>
          ★ {avgRating} ({sortedReviews.length} {sortedReviews.length === 1 ? 'review' : 'reviews'})
        </span>
      </div>

      <h3 style={{ fontSize: '22px', margin: '0 0 20px 0', color: 'var(--text-dark)' }}>
        {workshopData.name}
      </h3>

      {/* Workshop Host */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
          Workshop Host
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {host?.profilePicture ? (
            <img
              src={host.profilePicture}
              alt={host.name}
              style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: '#1a237e',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              {host?.name ? host.name[0].toUpperCase() : '?'}
            </div>
          )}
          <span style={{ fontSize: '14px', color: 'var(--text-dark)' }}>
            {host?.name || 'Unknown Host'}
          </span>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '15px',
          marginBottom: '20px',
        }}
      >
        <div>
          <div style={{ fontSize: '16px', fontWeight: '500' }}>Workshop Date</div>
          <div style={{ fontSize: '14px', color: 'var(--text-dark)' }}>{workshopData.date}</div>
        </div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: '500' }}>Workshop Time</div>
          <div style={{ fontSize: '14px', color: 'var(--text-dark)' }}>{workshopData.time}</div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '16px', fontWeight: '500' }}>Workshop Location</div>
        <div style={{ fontSize: '14px', color: 'var(--text-dark)' }}>{workshopData.location}</div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '16px', fontWeight: '500' }}>About This Workshop</div>
        <p
          style={{
            fontSize: '14px',
            color: 'var(--text-dark)',
            lineHeight: '1.5',
            margin: '5px 0 0 0',
          }}
        >
          {workshopData.about}
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '16px', fontWeight: '500' }}>Ticket Price</div>
        <div style={{ fontSize: '14px', color: 'var(--text-dark)' }}>
          {workshopData.ticketPrice}
        </div>
      </div>

      {/* Application Period — rendered from split start/end or legacy combined string */}
      <div style={{ marginBottom: '25px' }}>
        <div style={{ fontSize: '16px', fontWeight: '500' }}>Application Period</div>
        <div style={{ fontSize: '14px', color: 'var(--text-dark)', marginTop: '4px' }}>
          {applicationPeriodDisplay}
        </div>
        {workshopData.applicationPeriodStart && workshopData.applicationPeriodEnd && (
          <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-gray)', fontWeight: '500' }}>
                Opens
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-dark)' }}>
                {workshopData.applicationPeriodStart}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-gray)', fontWeight: '500' }}>
                Closes
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-dark)' }}>
                {workshopData.applicationPeriodEnd}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Attendees — expandable, newest registrant on top */}
      <div
        style={{
          backgroundColor:
            capacityPercent >= 0.9 ? '#fee2e2' : capacityPercent >= 0.75 ? '#fef9c3' : '#dff7e2',
          border: `2px solid ${capacityPercent >= 0.9 ? '#ff8b8b' : capacityPercent >= 0.75 ? '#eab308' : '#500aa0'}`,
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
        }}
      >
        <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>
          Who is attending? ({attendees.length}/{workshopData.seats} Seats)
        </div>

        {attendees.length > 0 ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {visibleAttendees.map((attendee) => (
                <div
                  key={attendee._id}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  {attendee.profilePicture ? (
                    <img
                      src={attendee.profilePicture}
                      alt={attendee.name}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: '#1a237e',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '600',
                        flexShrink: 0,
                      }}
                    >
                      {attendee.name ? attendee.name[0].toUpperCase() : '?'}
                    </div>
                  )}
                  <span style={{ fontSize: '13px', color: 'var(--text-dark)' }}>
                    @{attendee.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Expand / collapse instead of "+N more" */}
            {attendees.length > 5 && (
              <button
                onClick={() => setShowAllAttendees(!showAllAttendees)}
                style={{
                  marginTop: '12px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary-purple)',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                }}
              >
                {showAllAttendees ? 'Show less' : `Show all ${attendees.length} attendees`}
              </button>
            )}
          </>
        ) : (
          <p style={{ fontSize: '14px', color: 'var(--text-dark)', margin: 0 }}>
            No attendees yet.
          </p>
        )}
      </div>

      {/* Reviews — newest first */}
      <div className="bordered-card-white">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <div style={{ fontSize: '18px', fontWeight: '600' }}>
            Reviews ({sortedReviews.length})
          </div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--dark-purple)' }}>
            ★ {avgRating}
          </div>
        </div>

        {sortedReviews.length > 0 ? (
          visibleReviews.map((review: Review, index: number) => (
            <div key={index} className="review-card">
              <div className="review-header">
                <span style={{ fontWeight: '600', fontSize: '14px' }}>{review.name}</span>
                <span style={{ fontSize: '14px', color: 'var(--text-gray)' }}>
                  {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)}
                </span>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-dark)', margin: 0 }}>
                {review.comment}
              </p>
            </div>
          ))
        ) : (
          <p style={{ fontSize: '14px', color: 'var(--text-gray)' }}>No reviews yet.</p>
        )}
      </div>

      {sortedReviews.length > 3 && (
        <button
          className="btn-dark-purple"
          style={{ marginBottom: '20px', marginTop: '10px' }}
          onClick={() => setShowAllReviews(!showAllReviews)}
        >
          {showAllReviews ? 'Show Less' : `View All ${sortedReviews.length} Reviews`}
        </button>
      )}

      <div className="floating-btn-stack">
        {isOwner ? (
          <>
            <button
              className="btn-dark-purple"
              onClick={() => navigate('/host', { state: workshopData })}
            >
              Edit Workshop
            </button>
            {!workshopData._id && (
              <button className="btn-dark-purple" onClick={() => setShowModal(true)}>
                Host Workshop
              </button>
            )}
          </>
        ) : isClosed ? (
          <button
            className="btn-dark-purple"
            disabled
            style={{ opacity: 0.5, cursor: 'not-allowed' }}
          >
            Workshop Full
          </button>
        ) : (
          <>
            <button
              className="btn-dark-purple"
              onClick={handleAttend}
              disabled={isAttending}
              style={isAttending ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              {isAttending ? 'Already Attending' : 'Attend Workshop'}
            </button>
            <button
              className="btn-dark-purple"
              onClick={() =>
                navigate('/workshop/review', { state: { workshopId: workshopData._id } })
              }
            >
              Leave a Review
            </button>
          </>
        )}
      </div>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
          }}
        >
          <div
            style={{
              backgroundColor: '#fbe9a2',
              borderRadius: '16px',
              padding: '32px 24px',
              width: '80%',
              maxWidth: '320px',
              textAlign: 'center',
              border: '2px solid #ccc',
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '800',
                marginBottom: '24px',
                color: '#1a1a1a',
              }}
            >
              Ready to host this workshop?
            </h2>
            <button className="btn-dark-purple" onClick={handleHost}>
              Yes
            </button>
            <button
              className="btn-dark-purple"
              style={{ marginTop: '12px', backgroundColor: '#3d0878' }}
              onClick={() => setShowModal(false)}
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkshopPreview;
