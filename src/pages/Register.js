import React, { useState } from 'react';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        confirmPassword: '',
        oib: '',
        dob: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Provjera svih unosa
        if (formData.password !== formData.confirmPassword) {
            setError('Lozinke se ne podudaraju.');
            return;
        }

        if (!formData.username.includes('@')) {
            setError('Molimo unesite ispravan email.');
            return;
        }

        // Ovdje možeš dodati provjeru OIB-a, datuma rođenja itd.
        // Ako je sve u redu, pošaljemo podatke
        setError('');
        console.log('Registracija uspješna:', formData);

        // Resetiraj formu nakon uspješne registracije
        setFormData({
            firstName: '',
            lastName: '',
            username: '',
            password: '',
            confirmPassword: '',
            oib: '',
            dob: ''
        });
    };

    return (
        <div className="register-container">
            <h2>Registracija</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="firstName">Ime</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Prezime</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="username">Korisničko ime (email)</label>
                    <input
                        type="email"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Lozinka</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Ponovite lozinku</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="oib">OIB</label>
                    <input
                        type="text"
                        id="oib"
                        name="oib"
                        value={formData.oib}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="dob">Datum rođenja</label>
                    <input
                        type="date"
                        id="dob"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="register-btn">Registrirajte se</button>
            </form>
        </div>
    );
};

export default Register;
