import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCheckout } from '../context/useCheckout';

const ONLINE_METHODS: { label: string; icon: string; method: 'Visa' | 'PayPal' }[] = [
  { label: 'Pay with PayPal', icon: '🅿️', method: 'PayPal' },
  { label: 'Credit/Debit Card', icon: '💳', method: 'Visa' },
];

const PaymentSelection: React.FC = () => {
  const { dispatch } = useCheckout();
  const navigate = useNavigate();

  const location = useLocation();
  const workshopId = location.state?.workshopId;

  const handlePaymentSelect = (method: 'Visa' | 'PayPal') => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: method });
    navigate('/course/purchase', { state: { workshopId } });
  };

  return (
    <div style={{ width: '100%', maxWidth: '430px', padding: '0 20px', boxSizing: 'border-box' }}>
      <div className="screen-header">
        <h2 className="header-title">
          <button className="back-button" onClick={() => navigate('/home')} type="button">
            ←
          </button>{' '}
          Select
        </h2>
        <p className="header-subtitle">Choose Payment method</p>
      </div>

      <div className="purple-card">
        <h4 style={{ fontSize: '1.2rem', textAlign: 'center' }}>Bank Transfer</h4>
        <button type="button" className="white-button">
          <span>🏦</span> Banking Details
        </button>

        <h4 style={{ marginTop: '20px', fontSize: '1.2rem', textAlign: 'center' }}>
          Pay Online with Credit or Debit
        </h4>
        {ONLINE_METHODS.map(({ label, icon, method }) => (
          <button
            key={method}
            type="button"
            onClick={() => handlePaymentSelect(method)}
            className="white-button"
          >
            <span>{icon}</span> {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaymentSelection;
