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

    const [message, setMessage] = useState({ text: '', type: '' });  // Stanje za obavijest

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setMessage({ text: 'Lozinke se ne podudaraju.', type: 'error' });
            return;
        }

        try {
            const response = await fetch('http://localhost:5005/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setMessage({ text: 'Uspješna registracija!', type: 'success' });
                setFormData({
                    firstName: '',
                    lastName: '',
                    username: '',
                    password: '',
                    confirmPassword: '',
                    oib: '',
                    dob: ''
                });
            } else {
                const message = await response.text();
                setMessage({ text: message, type: 'error' });
            }
        } catch (err) {
            setMessage({ text: 'Greška pri registraciji.', type: 'error' });
            console.error(err);
        }
    };

    return (
        <div className="register-container">
            <h2>Registracija</h2>
            {message.text && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}
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
