import { lazy, Suspense, useEffect } from 'react';
import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  useLocation,
  Navigate,
} from 'react-router-dom';
import NavBar from './components/navbar';
import { Toaster } from 'sonner';
import './App.css';
import { CheckoutProvider } from './context/CheckoutProvider';

const Home = lazy(() => import('./components/Home'));
const Profile = lazy(() => import('./components/Profile'));
const WorkshopPreview = lazy(() => import('./components/WorkshopPreview'));
const HostWorkshopForm = lazy(() => import('./components/HostWorkshopForm'));
const ReviewForm = lazy(() => import('./components/ReviewForm'));
const Registration = lazy(() => import('./components/Registration'));
const PaymentSelection = lazy(() => import('./components/PaymentSelection'));
const PaymentDetails = lazy(() => import('./components/PaymentDetails'));
const Receipt = lazy(() => import('./components/Reciept'));
const EditProfile = lazy(() => import('./components/EditProfile'));
const Login = lazy(() => import('./components/login'));
const Signup = lazy(() => import('./components/Signup'));
const SkillMatching = lazy(() => import('./components/SkillMatching'));
const Welcome = lazy(() => import('./components/Welcome'));
const AccountCreated = lazy(() => import('./components/AccountCreated'));
const SkillMatchingFeature = lazy(() => import('./components/SkillMatchingFeature'));

const preloadRoutes = () => {
  import('./components/Home');
  import('./components/WorkshopPreview');
  import('./components/Profile');
  import('./components/login');
  import('./components/Registration');
};

const LoadingScreen = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '16px',
      color: 'var(--primary-purple)',
    }}
  >
    Loading...
  </div>
);

function CourseLayout() {
  return (
    <CheckoutProvider>
      <Outlet />
    </CheckoutProvider>
  );
}

function AppContent() {
  const location = useLocation();

  const hideNavOn = [
    '/',
    '/login',
    '/signup',
    '/skill-matching',
    '/account-created',
    '/course/register',
    '/course/payments',
    '/course/purchase',
    '/course/receipt',
    '/course/profile/edit',
    '/workshop/review',
  ];

  const showNav = !hideNavOn.includes(location.pathname);

  return <>{showNav && <NavBar />}</>;
}

function App() {
  useEffect(() => {
    preloadRoutes();
  }, []);
  return (
    <div className="app-container">
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Welcome />} />

            <Route
              path="/login"
              element={
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: '400px',
                    margin: '0 auto',
                    paddingTop: '40px',
                  }}
                >
                  <Login />
                </div>
              }
            />

            <Route
              path="/signup"
              element={
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: '400px',
                    margin: '0 auto',
                    paddingTop: '40px',
                  }}
                >
                  <Signup />
                </div>
              }
            />

            <Route path="/skill-matching" element={<SkillMatching />} />
            <Route path="/account-created" element={<AccountCreated />} />
            <Route path="/host" element={<HostWorkshopForm />} />
            <Route path="/host/preview" element={<WorkshopPreview />} />
            <Route path="/workshop/preview" element={<WorkshopPreview />} />
            <Route path="/workshop/review" element={<ReviewForm />} />
            <Route path="/home" element={<Home />} />
            <Route path="/skill-matching-feature" element={<SkillMatchingFeature />} />

            <Route path="/course" element={<CourseLayout />}>
              <Route index element={<Navigate to="/home" replace />} />{' '}
              <Route path="register" element={<Registration />} />
              <Route path="payments" element={<PaymentSelection />} />
              <Route path="purchase" element={<PaymentDetails />} />
              <Route path="receipt" element={<Receipt />} />
              <Route path="profile" element={<Profile />} />
              <Route path="profile/edit" element={<EditProfile />} />
            </Route>
          </Routes>
        </Suspense>
        <AppContent />
      </BrowserRouter>
    </div>
  );
}

export default App;
