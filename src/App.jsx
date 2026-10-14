
import { lazy, Suspense } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { BookingProvider } from "./context/BookingContext";

import "./App.css";

// Lazy-loaded pages
const Home = lazy(() => import("./components/Home"));
const Packages = lazy(() => import("./components/Packages"));
const PackageDetail = lazy(() => import("./components/PackageDetail"));

const BookingCart = lazy(() => import("./components/BookingCart"));
const Checkout = lazy(() => import("./components/Checkout"));
const TravelerForm = lazy(() => import("./components/TravelerForm"));
const BookingLayout = lazy(() => import("./components/BookingLayout"));
const BookingDates = lazy(() => import("./components/BookingDates"));
const BookingSummary = lazy(() => import("./components/BookingSummary"));
const BookingPayment = lazy(() => import("./components/BookingPayment"));

const Login = lazy(() => import("./components/Login"));
const Signup = lazy(() => import("./components/Signup"));
const Profile = lazy(() => import("./components/Profile"));

const AdminDashboard = lazy(() => import("./components/AdminDashboard"));
const AdminLogin = lazy(() => import("./components/AdminLogin"));

function Protected({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

function AppContent() {
  const { currentUser } = useAuth();

  return (
    <BookingProvider key={currentUser?.id || "guest"}>
      <Header />

      <Suspense fallback={<div>Loading page...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/packages" element={<Packages />} />

          <Route
            path="/package/:id"
            element={<PackageDetail />}
          />

          <Route path="/signup" element={<Signup />} />

          <Route path="/login" element={<Login />} />

          <Route
            path="/profile"
            element={
              <Protected>
                <Profile />
              </Protected>
            }
          />

          <Route
            path="/cart"
            element={
              <Protected>
                <BookingCart />
              </Protected>
            }
          />

          <Route
            path="/bookings"
            element={
              <Protected>
                <BookingCart />
              </Protected>
            }
          />

          <Route
            path="/checkout"
            element={
              <Protected>
                <Checkout />
              </Protected>
            }
          />

          <Route
            path="/booking"
            element={
              <Protected>
                <BookingLayout />
              </Protected>
            }
          >
            <Route
              index
              element={<Navigate to="/booking/dates" replace />}
            />

            <Route
              path="dates"
              element={<BookingDates />}
            />

            <Route
              path="travelers"
              element={<TravelerForm />}
            />

            <Route
              path="summary"
              element={<BookingSummary />}
            />

            <Route
              path="payment"
              element={<BookingPayment />}
            />
          </Route>

          <Route
            path="/traveler"
            element={
              <Navigate to="/booking/travelers" replace />
            }
          />

          <Route
            path="/admin-login"
            element={<AdminLogin />}
          />

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </Suspense>

      <Footer />
    </BookingProvider>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
