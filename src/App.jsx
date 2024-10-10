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
import Loading from './components/Loading';
import ChangePassword from './components/ChangePassword';
import ForgotPassword from './components/ForgotPassword';
import Logout from './components/Logout';
import Profile from './components/Profile';
import "./App.css";

const Main = () => {
  const { loading } = useSession();
  if (loading) return <Loading />;
  
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
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <SessionProvider>
      <Router>
        <Header />
        <Main />
        <Footer />
      </Router>
    </SessionProvider>
  );
};

export default App;
