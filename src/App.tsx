import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Support from './pages/Support';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Register from './pages/Register';
import RegisterPending from './pages/RegisterPending';
import RegisterDocuments from './pages/RegisterDocuments';
import SuperAdminLogin from './pages/SuperAdminLogin';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import SuperAdminRequestDetail from './pages/SuperAdminRequestDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Landing /></Layout>} />
        <Route path="/features" element={<Layout><Features /></Layout>} />
        <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
        <Route path="/terms" element={<Layout><Terms /></Layout>} />
        <Route path="/support" element={<Layout><Support /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />
        <Route path="/register/pending" element={<Layout><RegisterPending /></Layout>} />
        <Route path="/register/documents" element={<Layout><RegisterDocuments /></Layout>} />
        <Route path="/super-admin/login" element={<SuperAdminLogin />} />
        <Route path="/super-admin/requests/:id" element={<SuperAdminRequestDetail />} />
        <Route path="/super-admin" element={<SuperAdminDashboard />} />
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}