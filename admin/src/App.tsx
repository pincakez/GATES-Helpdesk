import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import Tickets from './pages/Tickets';
import Roles from './pages/Roles';
import Inventory from './pages/Inventory';
import Calls from './pages/Calls';
import FaqBuilder from './pages/FaqBuilder';
import Loyalty from './pages/Loyalty';
import Warranty from './pages/Warranty';
import Waitlist from './pages/Waitlist';
import AiAlerts from './pages/AiAlerts';
import AiRules from './pages/AiRules';
import ClientControl from './pages/ClientControl';
import Offers from './pages/Offers';
import WebRTCRemote from './pages/WebRTCRemote';
import MessagesControl from './pages/MessagesControl';

import GlobalSettings from './pages/GlobalSettings';
import WhatsAppSettings from './pages/WhatsAppSettings';
import FacebookSettings from './pages/FacebookSettings';
import SocialInbox from './pages/SocialInbox';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="client-control" element={<ClientControl />} />
          <Route path="offers" element={<Offers />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="roles" element={<Roles />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="calls" element={<Calls />} />
          <Route path="faq-builder" element={<FaqBuilder />} />
          <Route path="loyalty" element={<Loyalty />} />
          <Route path="warranty" element={<Warranty />} />
          <Route path="waitlist" element={<Waitlist />} />
          <Route path="alerts" element={<AiAlerts />} />
          <Route path="ai-rules" element={<AiRules />} />
          <Route path="remote" element={<WebRTCRemote />} />
          <Route path="messages" element={<MessagesControl />} />
          <Route path="settings" element={<GlobalSettings />} />
          <Route path="whatsapp-api" element={<WhatsAppSettings />} />
          <Route path="facebook-api" element={<FacebookSettings />} />
          <Route path="social-inbox" element={<SocialInbox />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
