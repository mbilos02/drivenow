import React, { useState, useEffect } from 'react';
import './SearchBar.css';

const SearchBar = () => {
    const [filters, setFilters] = useState({
        startDate: '2024-12-01',
        endDate: '2024-12-31',
        location: 'Split',
        type: 'car',
    });
    

    const [vehicles, setVehicles] = useState([]); // Novo stanje za vozila
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken'); // Dohvaćanje tokena iz localStorage
        setIsLoggedIn(!!token); // Ažuriraj stanje na temelju tokena
    }, [localStorage.getItem('authToken')]); // Dodaj ovisnost na token
    
    

    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const handleSearch = async () => {
        let apiUrl = '/api/vehicles?';
    
        // Dodaj uvjetne filtere samo ako nisu prazni
        if (filters.startDate) {
            apiUrl += `startDate=${filters.startDate}&`;
        }
        if (filters.endDate) {
            apiUrl += `endDate=${filters.endDate}&`;
        }
        if (filters.location) {
            apiUrl += `location=${filters.location}&`;
        }
        if (filters.type) {
            apiUrl += `type=${filters.type}&`;
        }
    
        // Ukloni zadnji & (ako postoji) s URL-a
        apiUrl = apiUrl.slice(0, -1);
    
        console.log('Pozivam API s URL-om:', apiUrl);
    
        try {
            const response = await fetch(apiUrl);
    
            // Provjeri HTTP status
            if (!response.ok) {
                throw new Error(`Greška: ${response.status}`);
            }
    
            // Parsiraj JSON
            const data = await response.json();
            console.log('Podaci s API-ja:', data);
    
            // Spremi podatke u stanje
            setVehicles(data);  // Ovdje se dodaje kod za postavljanje novih vozila
        } catch (error) {
            console.error('Greška prilikom dohvaćanja vozila:', error);
        }
    };
    
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Formatira datum prema lokalnim postavkama
    };

    const handleReserve = async (vehicle) => {
        if (!isLoggedIn) {
            alert('Morate biti prijavljeni kako biste rezervirali vozilo!');
            return;
        }
    
        console.log("Rezervacija vozila: ", vehicle);
    
        const { id, price_per_day } = vehicle;
        const startDate = new Date('2024-12-15'); // Pretpostavljeni datum početka, zamijeniti sa stvarnim odabirom
        const endDate = new Date('2024-12-20'); // Pretpostavljeni datum završetka, zamijeniti sa stvarnim odabirom
    
        // Provjeri jesu li datumi ispravno definirani
        if (!startDate || !endDate || startDate >= endDate) {
            alert('Molimo odaberite valjan datum rezervacije!');
            return;
        }

        const formattedStartDate = startDate.toLocaleDateString('en-CA');  // 'en-CA' daje format 'YYYY-MM-DD'
        const formattedEndDate = endDate.toLocaleDateString('en-CA');      // 'en-CA' daje format 'YYYY-MM-DD'
    
        const apiUrl = '/api/reserve';
        try {
            const response = await fetch('http://localhost:3000' + apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Token za autentifikaciju
                },
                body: JSON.stringify({ vehicleId: id, startDate: formattedStartDate, endDate: formattedEndDate }),
            });
    
            if (!response.ok) throw new Error(`Greška pri rezervaciji vozila: ${response.status}`);
    
            alert('Rezervacija uspješna! Provjerite svoj email za potvrdu.');
            setVehicles(prevVehicles => prevVehicles.filter(v => v.id !== id)); // Ukloni rezervirano vozilo
        } catch (error) {
            console.error('Greška prilikom rezervacije vozila:', error);
        }
    };
    
    
    

    return (
        <div>
            <div className="search-bar">
                <input type="date" name="startDate" onChange={handleChange} placeholder="Datum početka" />
                <input type="date" name="endDate" onChange={handleChange} placeholder="Datum završetka" />
                <input type="text" name="location" onChange={handleChange} placeholder="Lokacija" />
                <select name="type" onChange={handleChange}>
                    <option value="">Tip vozila</option>
                    <option value="car">Automobil</option>
                    <option value="van">Kombi</option>
                </select>
                <button onClick={handleSearch}>Pretraži</button>
            </div>

            <div className="vehicles-container">
                {vehicles.map((vehicle) => (
                    <div className="vehicle-card" key={vehicle.id}>
                        <img src={vehicle.image_url} alt={vehicle.name} />
                        <h3>{vehicle.name}</h3>
                        <p>Lokacija: {vehicle.location}</p>
                        <p>Tip: {vehicle.type === 'car' ? 'Automobil' : 'Kombi'}</p>
                        <p>Dostupno od: {vehicle.available_from}</p>
                        <p>Dostupno do: {vehicle.available_to}</p>
                        <p className='price'>Cijena: {vehicle.price_per_day} $ / dan</p>
                        <button onClick={() => handleReserve(vehicle)}>Rezerviraj</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchBar;
