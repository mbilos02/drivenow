import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = () => {
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        location: '',
        type: '',
    });

    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const handleSearch = () => {
        console.log(filters);
    };

    return (
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
    );
};

export default SearchBar;
