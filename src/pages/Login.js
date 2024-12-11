import React, { useState } from 'react';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // API login
        console.log('User logged in:', { email, password });
    };

    return (
        <div className="login-container">
            <section className="login-section">
                <h2>Dobrodošli nazad!</h2>
                <p>Prijavite se kako biste nastavili.</p>
                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">E-mail</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Unesite vaš e-mail"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Lozinka</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Unesite vašu lozinku"
                        />
                    </div>
                    <button type="submit" className="login-btn">Prijavite se</button>
                </form>
            </section>
        </div>
    );
};

export default Login;
