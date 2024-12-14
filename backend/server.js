const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const authenticateUser = (req, res, next) => {
    console.log('Nesto');
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token);
    if (!token) return res.status(401).json({ message: 'Pristup odbijen. Niste prijavljeni.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Zamijeni 'tajni_kljuc' svojim
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Neispravan token.' });
    }
};

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['POST', 'GET'],
    credentials: true
}));
app.use(bodyParser.json());

// Povezivanje na MySQL bazu
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // zamijeni s tvojim MySQL korisničkim imenom
    password: 'Lozinka123', // zamijeni s tvojom MySQL lozinkom
    database: 'DriveNow'
});

db.connect(err => {
    if (err) {
        console.error('Greška pri povezivanju s bazom:', err);
    } else {
        console.log('Povezan s MySQL bazom.');
    }
});

// API za registraciju korisnika
app.post('/register', async (req, res) => {
    const { firstName, lastName, username, password, oib, dob } = req.body;

    try {
        // Hashiraj lozinku
        const hashedPassword = await bcrypt.hash(password, 10);

        // Unos podataka u bazu
        const sql = 'INSERT INTO Users (firstName, lastName, username, password, oib, dob) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(sql, [firstName, lastName, username, hashedPassword, oib, dob], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    res.status(400).send('Korisničko ime već postoji.');
                } else {
                    console.error(err);
                    res.status(500).send('Greška pri registraciji.');
                }
            } else {
                res.status(201).send('Korisnik uspješno registriran.');
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Greška na serveru.');
    }
});

// API za prijavu korisnika
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM Users WHERE username = ?';
    db.query(query, [username], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Greška na serveru' });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'Korisnik ne postoji' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Neispravna lozinka' });
        }

        // Generiraj JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            'tajni_kljuc', // Ovo trebaš zamijeniti stvarnim tajnim ključem
            { expiresIn: '1h' }
        );

        res.json({ message: 'Prijava uspješna', token });
    });
});


app.get('/test-db', (req, res) => {
    const sql = 'SELECT 1 + 1 AS solution';
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).send('Greška pri povezivanju s bazom: ' + err.message);
        } else {
            res.send('Povezano! Rezultat testa: ' + results[0].solution);
        }
    });
});

app.get('/api/vehicles', (req, res) => {
    const { startDate, endDate, location, type } = req.query;

    // Provjeri jeste li dobili vrijednosti za startDate, endDate, location i type
    console.log('Received query parameters:', req.query);

    const query = `
        SELECT id, name, location, type, available_from, available_to, price_per_day, image_url
        FROM Vehicles
        WHERE (? IS NULL OR location = ?)
        AND (? IS NULL OR type = ?)
        AND (? IS NULL OR available_from <= ?)
        AND (? IS NULL OR available_to >= ?)
    `;

    console.log('SQL Query:', query);
    console.log('Parameters:', [location, location, type, type, startDate, startDate, endDate, endDate]);

    db.query(
        query,
        [location || null, location || null, type || null, type || null, startDate || null, startDate || null, endDate || null, endDate || null],
        (err, results) => {
            if (err) {
                console.error('Greška prilikom dohvaćanja vozila:', err);
                return res.status(500).json({ error: 'Greška na serveru' });
            }

            // Prikaz rezultata u konzoli za provjeru
            console.log('Rezultati iz baze podataka:', results);

            res.json(results);
        }
    );
});

app.post('/api/reserve', authenticateUser, (req, res) => {
    const { vehicleId, startDate, endDate } = req.body;
    const userEmail = req.user.email; // Pretpostavljam da imate ovu funkciju za dohvat korisničkog emaila iz JWT tokena

    console.log("Podaci o rezervaciji: ", req.body);
    console.log("Korisnički email: ", userEmail);

    // Provjera jesu li svi podaci prisutni
    if (!vehicleId || !startDate || !endDate || !userEmail) {
        return res.status(400).json({ error: 'Nedostaju podaci za rezervaciju.' });
    }

    // Provjera formata datuma (možete koristiti Date.parse ili moment.js, ali za jednostavnost koristimo Date)
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
        return res.status(400).json({ error: 'Neispravan format datuma.' });
    }

    // SQL upit za unos rezervacije u bazu
    const query = `
        INSERT INTO Reservations (vehicle_id, start_date, end_date, user_email)
        VALUES (?, ?, ?, ?)
    `;
    
    db.query(query, [vehicleId, startDate, endDate, userEmail], (err) => {
        if (err) {
            console.error('Greška prilikom rezervacije:', err);
            return res.status(500).json({ error: 'Greška na serveru' });
        }

        // Slanje potvrde putem e-maila
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'drivenow550@gmail.com',
                pass: 'Lozinka123', // Ovdje koristite sigurnu metodu za pohranu lozinke
            },
        });

        const mailOptions = {
            from: 'drivenow550@gmail.com',
            to: userEmail,
            subject: 'Potvrda rezervacije vozila',
            text: `Uspješno ste rezervirali vozilo s ID-om ${vehicleId} od ${startDate} do ${endDate}.`,
        };

        transporter.sendMail(mailOptions, (emailErr) => {
            if (emailErr) {
                console.error('Greška prilikom slanja e-maila:', emailErr);
                return res.status(500).json({ error: 'Greška prilikom slanja potvrde e-mailom' });
            }

            res.json({ message: 'Rezervacija uspješna. Potvrda je poslana na e-mail.' });
        });
    });
});


// Pokretanje servera
const PORT = 5005;
app.listen(PORT, () => {
    console.log(`Server pokrenut na http://localhost:${PORT}`);
});