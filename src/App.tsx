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
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}