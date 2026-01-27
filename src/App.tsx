import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SEO } from './components/SEO';
import { ScrollToTop } from './components/ScrollToTop';
import { Toaster } from './components/ui/sonner';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { TeamPage } from './pages/TeamPage';
import { GalleryPage } from './pages/GalleryPage';
import { CareersPage } from './pages/CareersPage';
import { ContactPage } from './pages/ContactPage';
import { BookingPage } from './pages/BookingPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import { SignInPage } from './pages/SignInPage';
import { AdminLayout } from './components/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminHeroImagesPage } from './pages/admin/AdminHeroImagesPage';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage';
import { AdminTeamPage } from './pages/admin/AdminTeamPage';
import { AdminLocationsPage } from './pages/admin/AdminLocationsPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminTestimonialsPage } from './pages/admin/AdminTestimonialsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminJobPositionsPage } from './pages/admin/AdminJobPositionsPage';
import { initCSRFToken } from './lib/security';

export default function App() {
  // Initialize CSRF token on app load
  useEffect(() => {
    initCSRFToken();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <SEO
        title="Home"
        description="Bina Adult Care provides compassionate residential and home care services for senior adults in Nepal. 24/7 professional care with dignity and respect."
      />
      
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/sign-in" element={<SignInPage />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="hero-images" element={<AdminHeroImagesPage />} />
          <Route path="gallery" element={<AdminGalleryPage />} />
          <Route path="team" element={<AdminTeamPage />} />
          <Route path="locations" element={<AdminLocationsPage />} />
          <Route path="services" element={<AdminServicesPage />} />
          <Route path="testimonials" element={<AdminTestimonialsPage />} />
          <Route path="job-positions" element={<AdminJobPositionsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="*" element={<AdminDashboard />} />
        </Route>

        {/* Public Routes */}
        <Route path="/*" element={
          <div className="min-h-screen bg-background">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsAndConditions />} />
              </Routes>
            </main>
            <Footer />
            <Toaster />
          </div>
        } />
      </Routes>
    </Router>
  );
}
