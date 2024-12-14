import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ username: '', password: '' }); // Stanje za greške
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrors({ username: '', password: '' }); // Resetiranje grešaka prije svakog pokušaja prijave

        try {
            const response = await fetch('http://localhost:5005/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setErrors(prev => ({ ...prev, username: 'Pogrešno korisničko ime ili lozinka.' }));
                } else {
                    setErrors(prev => ({ ...prev, username: 'Greška prilikom prijave. Pokušajte ponovo.' }));
                }
                return;
            }

            const data = await response.json();
            localStorage.setItem('authToken', data.token); // Spremanje tokena u localStorage
            navigate('/'); // Preusmjeri na početnu stranicu
        } catch (error) {
            console.error('Tehnički detalji greške:', error);
            setErrors(prev => ({ ...prev, username: 'Nije moguće povezati se s poslužiteljem. Provjerite internetsku vezu.' }));
        }
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
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                        {<p className="error-text" style={{color: 'red'}}>{errors.username}</p>}
                        {<p className="error-text" style={{color: 'red'}}>{errors.password}</p>}
                    </div>
                    <button type="submit" className="login-btn">Prijavite se</button>
                </form>
            </section>
        </div>
    );
};

export default Login;
