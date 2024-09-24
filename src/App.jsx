// App.jsx
import React from 'react';
import NotFound from './components/NotFound';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Report from './components/Report';
import NavBar from './components/NavBar'; // Import the NavBar component
import Footer from './components/Footer'; // Import the Footer component
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="app-container">
                <NavBar /> 

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/report" element={<Report />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>

                <Footer /> 
            </div>
        </Router>
    );
};

export default App;
