import React from 'react';
import HeroSection from '../components/HeroSection';
import SearchBar from '../components/SearchBar';
import ContactForm from '../components/ContactForm';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <HeroSection />
            <section className="about-section">
                <div className='about-logo'>
                    <img src='/images/logo.png' alt='DriveNow logo' />
                </div>
                <div className='about-text'>
                    <h2>O našoj stranici</h2>
                    <p>
                        DriveNow je inovativna platforma koja povezuje male rent-a-car firme i korisnike. Naš cilj je
                        omogućiti jednostavno pretraživanje i najam vozila uz maksimalnu transparentnost i sigurnost.
                    </p>
                </div>
            </section>
            <section className='about-section'>
                <div className="info-images">
                    <img src="/images/car4.jpg" alt="Automobil" />
                    <img src="/images/car2.jpg" alt="Automobil" />
                    <img src="/images/car3.jpg" alt="Automobil" />
                </div>
            </section>
            <section className="search-section">
                <h2>Pretraži vozila</h2>
                <div className="search-container">
                    <SearchBar />
                </div>
            </section>
            <section className="contact-section">
                <h2>Kontaktirajte nas</h2>
                <ContactForm />
            </section>
        </div>
    );
};

export default Home;
