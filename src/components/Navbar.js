import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="logo">DriveNow</div>
            <div className="nav-links">
                <a href="/" className="nav-button">Home</a>
                <a href="/login" className="nav-button">Login</a>
                <a href="/register" className="nav-button">Register</a>
            </div>
        </nav>
    );
};

export default Navbar;
