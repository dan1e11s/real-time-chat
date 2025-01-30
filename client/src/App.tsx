import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ChannelsPage from './pages/ChannelsPage/ChannelsPage';
import ChatPage from './pages/ChatPage/ChatPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/channels" element={<ChannelsPage />} />
      <Route path="/channels/:id" element={<ChatPage />} />
    </Routes>
  );
}

export default App;
