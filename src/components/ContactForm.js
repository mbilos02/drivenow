import React, { useState } from 'react';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        alert('Poruka poslana!');
    };

    return (
        <form className="contact-form" onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Ime" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <textarea name="message" placeholder="Poruka" onChange={handleChange} required></textarea>
            <button type="submit">Pošalji</button>
        </form>
    );
};

export default ContactForm;
