import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCheckout } from '../context/useCheckout';

// Reusable field — same pattern as Registration.tsx
type FormFieldProps = {
  label: string;
  children: React.ReactNode;
};

const FormField: React.FC<FormFieldProps> = ({ label, children }) => (
  <div className="input-group">
    <label className="input-label">{label}</label>
    {children}
  </div>
);

const SHIPPING_FIELDS: { label: string; placeholder?: string }[] = [
  { label: 'Street address' },
  { label: 'City' },
  { label: 'Province / State' },
  { label: 'Postal code' },
];

const PaymentDetails: React.FC = () => {
  const { state } = useCheckout();
  const paymentMethod = state.paymentMethod;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  /*
  workshopId is passed from WorkshopPreview through the navigate state
  It's carried through the entire checkout flow so the user can be
  registered as an attendee once payment is complete in Receipt.tsx
  */
  const workshopId = location.state?.workshopId;

  // Redirect back to registration if state is wiped/missing (e.g., on page refresh)
  useEffect(() => {
    if (!state.registration) {
      console.warn('Registration state missing. Redirecting to start.');
      navigate('/course', { replace: true });
    }
  }, [state.registration, navigate]);

  const handlePurchase = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!state.registration) {
      setError('Registration data is missing. Please restart the process.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/course`, {
        name: state.registration.name,
        email: state.registration.email,
        age: state.registration.age,
        phone: state.registration.phone,
        ticketAmount: state.registration.ticketAmount,
        paymentMethod: state.paymentMethod,
      });

      // Passing workshopId alongside data so Receipt.tsx can call
      navigate('/course/receipt', { state: { ...response.data, workshopId } });
    } catch (err) {
      console.error('Payment submission failed:', err);
      toast.error('Payment failed. Please try again.');

      if (axios.isAxiosError(err) && err.response) {
        const serverMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          'Please check your details and try again.';
        setError(`Server rejected: ${serverMessage}`);
      } else {
        setError(
          "We couldn't connect to the payment system. Please check your internet connection and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Does not render the form while the redirect is occuring
  if (!state.registration) {
    return null;
  }

  return (
    <>
      <div className="screen-header">
        <h2 className="header-title">
          <button
            className="back-button"
            onClick={() => navigate('/course/payments')}
            type="button"
          >
            ←
          </button>
          Purchase
        </h2>
        <p className="header-subtitle">Enter Details</p>
      </div>

      <div className="purple-card">
        <form
          onSubmit={handlePurchase}
          style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
        >
          {/* Dynamic UI: Visa shows card fields, PayPal shows login simulation */}
          {paymentMethod === 'Visa' && (
            <>
              <FormField label="Card Number">
                <input
                  required
                  type="text"
                  className="text-input"
                  placeholder="XXXX XXXX XXXX XXXX"
                />
              </FormField>
              <FormField label="Expiry Date">
                <input required type="text" className="text-input" placeholder="MM/YY" />
              </FormField>
              <FormField label="CVV">
                <input required type="text" className="text-input" />
              </FormField>
            </>
          )}

          {paymentMethod === 'PayPal' && (
            <>
              <FormField label="PayPal Email">
                <input required type="email" className="text-input" placeholder="you@paypal.com" />
              </FormField>
              <FormField label="PayPal Password">
                <input required type="password" className="text-input" placeholder="••••••••" />
              </FormField>
              <p style={{ fontSize: '14px', color: '#ccc', marginTop: '4px' }}>
                This is a login simulation — no real PayPal connection.
              </p>
            </>
          )}

          <h4
            style={{
              margin: '15px 0 10px 0',
              textAlign: 'left',
              fontSize: '24px',
              marginTop: '2rem',
              marginBottom: '1rem',
            }}
          >
            Shipping Address
          </h4>

          {SHIPPING_FIELDS.map(({ label }) => (
            <FormField key={label} label={label}>
              <input required type="text" className="text-input" />
            </FormField>
          ))}

          {error && (
            <p
              style={{
                color: '#FFcccc',
                background: 'rgba(255,0,0,0.2)',
                padding: '10px',
                borderRadius: '8px',
                marginTop: '10px',
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="primary-button"
            style={{ marginTop: '20px' }}
          >
            {loading ? 'Processing...' : 'Purchase'}
          </button>
        </form>
      </div>
    </>
  );
};

export default PaymentDetails;
