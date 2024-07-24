import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import EventsPage from './pages/EventsPage';
import EventDetail from './pages/EventDetail'; 
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage'
import ProfilePage from './pages/ProfilePage'

function App() {
  return (
    <ChakraProvider>
      <Router>
        <AppContent />  
      </Router>
    </ChakraProvider>
  );
}

function AppContent() {
  const location = useLocation();
  return (
    <>
      {location.pathname !== "/login" &&  location.pathname !== "/register" && <Navbar />}
      <Routes>
          {/* Routing to allow links to different pages of the site */}
          <Route path="/events" element={<EventsPage />} />
          <Route path="/" element={<Navigate to="/events" replace />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/profile" element={<ProfilePage />}></Route>
        </Routes>
    </>
  )
}

export default App;