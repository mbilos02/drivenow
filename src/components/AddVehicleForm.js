import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddVehicleForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    type: '',
    available_from: '',
    available_to: '',
    price_per_day: '',
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const { name, location, type, available_from, available_to, price_per_day, image } = formData;

    if (!name || !location || !type || !available_from || !available_to || !price_per_day || !image) {
      setError('Sva polja su obavezna.');
      return false;
    }

    if (new Date(available_from) > new Date(available_to)) {
      setError('Datum "Od" ne može biti nakon datuma "Do".');
      return false;
    }

    if (price_per_day <= 0) {
      setError('Cijena po danu mora biti pozitivan broj.');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('type', formData.type);
    formDataToSend.append('available_from', formData.available_from);
    formDataToSend.append('available_to', formData.available_to);
    formDataToSend.append('price_per_day', formData.price_per_day);
    formDataToSend.append('image', formData.image);

    try {
      await axios.post('/api/vehicles', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Vozilo je uspješno dodano!');
      navigate('/'); // Preusmjeravanje na početnu stranicu ili drugu relevantnu stranicu
    } catch (err) {
      console.error(err);
      setError('Došlo je do pogreške prilikom dodavanja vozila.');
    }
  };

  return (
    <div className="add-vehicle-form">
      <h2>Dodaj Novo Vozilo</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Naziv Vozila:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />

        <label>Lokacija:</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
        />

        <label>Vrsta Vozila:</label>
        <select name="type" value={formData.type} onChange={handleInputChange}>
          <option value="">Odaberi...</option>
          <option value="car">Automobil</option>
          <option value="van">Kombi</option>
          <option value="truck">Kamion</option>
        </select>

        <label>Dostupno Od:</label>
        <input
          type="date"
          name="available_from"
          value={formData.available_from}
          onChange={handleInputChange}
        />

        <label>Dostupno Do:</label>
        <input
          type="date"
          name="available_to"
          value={formData.available_to}
          onChange={handleInputChange}
        />

        <label>Cijena Po Danu (€):</label>
        <input
          type="number"
          name="price_per_day"
          value={formData.price_per_day}
          onChange={handleInputChange}
        />

        <label>Slika Vozila:</label>
        <input type="file" onChange={handleImageChange} />
        {previewImage && <img src={previewImage} alt="Preview" className="image-preview" />}

        <button type="submit">Dodaj Vozilo</button>
      </form>
    </div>
  );
};

export default AddVehicleForm;
