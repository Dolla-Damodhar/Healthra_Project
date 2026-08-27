import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { UserLayout } from '../layouts'
import { Home } from '../views/home'
import { Login } from '../views/login'
import { BookAppointment } from '../views/book-appointment'
import { MyBookings } from '../views/my-bookings'
import { ComingSoon } from '../views/coming-soon'
import { ProtectedRoute } from './protectedRoute'

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ComingSoon pageName="Services" />} />
        <Route path="/doctors" element={<ComingSoon pageName="Doctors" />} />
        <Route path="/hospitals" element={<ComingSoon pageName="Hospitals" />} />
        <Route path="/about" element={<ComingSoon pageName="About Us" />} />
        <Route path="/pricing" element={<ComingSoon pageName="Pricing" />} />
        <Route path="/contact" element={<ComingSoon pageName="Contact" />} />
        <Route
          path="/book-appointment"
          element={
            <ProtectedRoute>
              <BookAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  </BrowserRouter>
)
