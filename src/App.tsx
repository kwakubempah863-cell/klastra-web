import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import TutorDiscovery from './pages/TutorDiscovery';
import TutorDetail from './pages/TutorDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Subjects from './pages/Subjects';
import AdminDashboard from './pages/AdminDashboard';
import Analytics from './pages/Analytics';
import NotFound from './pages/NotFound';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Support from './pages/Support';
import HealthCheck from './pages/HealthCheck';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Landing /></Layout>} />
        <Route path="/tutors" element={<Layout><TutorDiscovery /></Layout>} />
        <Route path="/tutors/:id" element={<Layout><TutorDetail /></Layout>} />
        <Route path="/subjects" element={<Layout><Subjects /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />
        <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
        <Route path="/admin/analytics" element={<Layout><Analytics /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
        <Route path="/terms" element={<Layout><Terms /></Layout>} />
        <Route path="/support" element={<Layout><Support /></Layout>} />
        <Route path="/health" element={<Layout><HealthCheck /></Layout>} />
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}