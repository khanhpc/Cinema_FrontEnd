import { BrowserRouter, Route, Routes } from "react-router-dom";
import ShowtimePage from "./pages/User/ShowtimePage";
import SeatPage from "./pages/User/SeatPage";
import LoginPage from "./pages/Auth/LoginPage";
import "./App.css";
import AdminDashboard from "./pages/Admin/AdminDashBoard";
import AdminRoute from "./pages/Auth/AdminRoute";
import ProfilePage from "./pages/User/HistoryBookingPage";
import UserLayout from "./components/UserLayout";
import PublicRoute from "./components/PublicRoute";
import HomePage from "./pages/User/HomePage";
import RegisterPage from "./pages/Auth/RegisterPage";
import PaymentPage from "./pages/User/PaymentPage";
import { Toaster } from 'react-hot-toast';
import MovieDetailPage from "./pages/User/MovieDetailPage";

function App() {
  return (
    <BrowserRouter>
    <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route element={<UserLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:movieId" element={<MovieDetailPage />} />
          <Route path="/movie/:movieId/showtimes" element={<ShowtimePage />} />
          <Route path="/seats/:showtimeId/:roomId" element={<SeatPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/payment/:invoiceId" element={<PaymentPage />} />
        </Route>

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
