// src/App.jsx
import { Routes, Route, Router } from 'react-router-dom';

// Layouts
import Layout from './components/common/Layout';
import AdminLayout from './components/admin/AdminLayout';

// Route Protectors
import ProtectedRoute from './utils/ProtectedRoute';
import AdminRoute from './utils/AdminRoute';

// --- Public Pages ---
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import VerifyCertificatePage from './pages/VerifyCertificatePage'; // Public page

// --- Participant Pages ---
import DashboardPage from './pages/DashboardPage';
import Round1Page from './pages/Round1Page';
import Round2Page from './pages/Round2Page';

// --- Admin Pages (All in src/pages/) ---
import AdminDashboard from './pages/AdminDashboard';
import AdminTeamsPage from './pages/AdminTeamsPage';
import ManageQuestionsPage from './pages/ManageQuestionsPage';
import EvaluateSubmissionsPage from './pages/EvaluateSubmissionsPage';
import PublishResultsPage from './pages/PublishResultsPage';
import GenerateCertificatesPage from './pages/GenerateCertificatesPage';
import AboutPage from './pages/AboutPage'; // <-- IMPORT NEW PAGE

function App() {
  return (
    <Routes>
      {/* =================================
        PUBLIC ROUTES (Main Layout)
        =================================
      */}
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/login" element={<Layout><LoginPage /></Layout>} />
      <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
      <Route path="/verify/:id" element={<Layout><VerifyCertificatePage /></Layout>} />
      <Route path="/about" element={<Layout><AboutPage /></Layout>} /> {/* <-- ADD NEW ROUTE */}
      {/* =================================
        PARTICIPANT ROUTES (Main Layout)
        =================================
      */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout><DashboardPage /></Layout>
          </ProtectedRoute>
        }
      />
      
      {/* =================================
        TEST ROUTES (Full Screen - No Layout)
        =================================
      */}
      <Route
        path="/round-1"
        element={
          <ProtectedRoute>
            <Round1Page />
          </ProtectedRoute>
        }
      />
      <Route
        path="/round-2"
        element={
          <ProtectedRoute>
            <Round2Page />
          </ProtectedRoute>
        }
      />

      {/* =================================
        ADMIN ROUTES (Nested Admin Layout)
        =================================
      */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="teams" element={<AdminTeamsPage />} />
        <Route path="questions" element={<ManageQuestionsPage />} />
        <Route path="evaluate" element={<EvaluateSubmissionsPage />} />
        <Route path="results" element={<PublishResultsPage />} />
        <Route path="certificates" element={<GenerateCertificatesPage />} />
      </Route>
      
      {/* =================================
        404 NOT FOUND
        =================================
      */}
      <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
    </Routes>
  );
}

export default App;