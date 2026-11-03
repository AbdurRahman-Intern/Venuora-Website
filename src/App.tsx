// ---------------------------------------------------------------------------
// ROUTES - the map of the whole application.
//   /            Platform marketing website
//   /demo        The Grand Emerald (fictional demo venue website)
//   /dashboard/* Owner dashboard DEMO (no login: there is no real authentication in this build)
// TODO: when multi-tenancy is added, venue sites become /v/:venueSlug (or a custom domain per
//       customer) and /dashboard moves behind real authentication.
// Pages are lazy-loaded so the marketing page stays light on slow connections.
// ---------------------------------------------------------------------------
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import ScrollManager from './components/layout/ScrollManager';
import MarketingLayout from './components/layout/MarketingLayout';
import HomePage from './pages/marketing/HomePage';
import NotFoundPage from './pages/NotFoundPage';

const VenuePage = lazy(() => import('./pages/venue/VenuePage'));
const DashboardLayout = lazy(() => import('./pages/dashboard/DashboardLayout'));
const OverviewPage = lazy(() => import('./pages/dashboard/OverviewPage'));
const InquiriesPage = lazy(() => import('./pages/dashboard/InquiriesPage'));
const PackagesPage = lazy(() => import('./pages/dashboard/PackagesPage'));
const AvailabilityPage = lazy(() => import('./pages/dashboard/AvailabilityPage'));
const SettingsPage = lazy(() => import('./pages/dashboard/SettingsPage'));

/** Simple loading state shown while a lazy page downloads. */
function Loading() {
  return (
    <div role="status" className="flex min-h-[60vh] items-center justify-center text-sm text-charcoal/60">
      <span className="me-3 h-5 w-5 animate-spin rounded-full border-2 border-gold border-t-transparent" aria-hidden="true" />
      <span className="sr-only">Loading</span>
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<MarketingLayout />}>
            <Route path="/" element={<HomePage />} />
          </Route>
          <Route path="/demo" element={<VenuePage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="inquiries" element={<InquiriesPage />} />
            <Route path="packages" element={<PackagesPage />} />
            <Route path="availability" element={<AvailabilityPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}
