import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { type Resolver, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCheckout } from '../context/useCheckout';
import { type RegistrationFormData, registrationSchema } from '../schemas/registrationSchema';

// Reusable field component
type FormFieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

const FormField: React.FC<FormFieldProps> = ({ label, error, children }) => (
  <div className="input-group">
    <label className="input-label">{label}</label>
    {children}
    {error && <span style={{ color: '#FFcccc', fontSize: '12px', marginTop: '4px' }}>{error}</span>}
  </div>
);

const Registration: React.FC = () => {
  // triggers state update (messenger that delivers x)
  const { dispatch } = useCheckout();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema) as Resolver<RegistrationFormData>,
    mode: 'onBlur',
  });

  const location = useLocation();
  const workshopId = location.state?.workshopId;
  const ticketPrice = location.state?.ticketPrice;

  const onSubmit = (data: RegistrationFormData) => {
    dispatch({
      type: 'SET_REGISTRATION',
      payload: {
        name: data.name,
        email: data.email,
        age: data.age,
        phone: data.phone,
        ticketAmount: 1,
        ticketPrice: ticketPrice || 0,
      },
    });
    navigate('/course/payments', { state: { workshopId } });
  };

  return (
    <>
      <div className="screen-header">
        <h2 className="header-title">Registration</h2>
        <p className="header-subtitle">Input Details</p>
      </div>

      <div className="purple-card">
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
        >
          <FormField label="Name" error={errors.name?.message}>
            <input
              {...register('name')}
              type="text"
              className="text-input"
              placeholder="First and Last Name"
            />
          </FormField>

          <FormField label="Birthday" error={errors.birthday?.message}>
            <input
              {...register('birthday')}
              type="text"
              className="text-input"
              placeholder="MM/DD/YYYY"
            />
          </FormField>

          <FormField label="Age" error={errors.age?.message}>
            <input
              {...register('age')}
              type="number"
              className="text-input"
              placeholder="Must be 18+"
            />
          </FormField>

          <FormField label="City">
            <input {...register('city')} type="text" className="text-input" />
          </FormField>

          <FormField label="Email" error={errors.email?.message}>
            <input
              {...register('email')}
              type="email"
              className="text-input"
              placeholder="you@example.com"
            />
          </FormField>

          <FormField label="Phone Number" error={errors.phone?.message}>
            <input
              {...register('phone')}
              type="tel"
              className="text-input"
              placeholder="+1234567890"
            />
          </FormField>

          <button type="submit" className="primary-button" style={{ marginTop: '20px' }}>
            Register
          </button>
        </form>
      </div>
    </>
  );
};

export default Registration;
