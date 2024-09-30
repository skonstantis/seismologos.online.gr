import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import PrivacyPolicy from './components/PrivacyPolicy';
import ContactUs from './components/ContactUs';
import Faq from './components/Faq';
import TermsOfService from './components/TermsOfService';
import NotFound from './components/NotFound';
import { SessionProvider, useSession } from './contexts/SessionContext'; 
import "./App.css";
import Loading from './components/Loading';
import ChangePassword from './components/ChangePassword';

const App = () => {
  return (
    <SessionProvider>
      <Router>
        <Header />
        <MainRoutes />
        <Footer />
      </Router>
    </SessionProvider>
  );
};

const MainRoutes = () => {
  const { sessionValid, loading } = useSession();

  if (loading ) {
    return <Loading />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
