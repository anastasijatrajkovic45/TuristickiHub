import React, { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Divider,
  Modal,
  Backdrop,
  Fade,
  TextField,
  Button,
} from '@mui/material';
import { useParams } from 'react-router-dom';

const Rezervacije = () => {
  const { smestajId } = useParams();
  const [rezervacije, setRezervacije] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [ime, setIme] = useState('');
  const [prezime, setPrezime] = useState('');
  const [brojPasosa, setBrojPasosa] = useState('');
  const [brojTelefona, setBrojTelefona] = useState('');
  const [brojOsoba, setBrojOsoba] = useState(1);
  const [email, setEmail] = useState('');
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoggedIn(!!token);
    if (token) {
      fetchUserInfo(token);
    }
  }, []);

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch(`http://localhost:5178/api/Auth/GetKorisnikByToken?token=${token}`);
      const userInfo = await response.json();
      setIsAdmin(userInfo.isAdmin);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  useEffect(() => {
    const fetchRezervacije = async () => {
      try {
        const response = await fetch(`http://localhost:5178/api/Rezervacija/PreuzmiRezervacijeSmestaja/${smestajId}`);
        const data = await response.json();
        setRezervacije(data);
      } catch (error) {
        console.error('Greška pri dohvatanju podataka o rezervacijama:', error);
      }
    };

    fetchRezervacije();
  }, [smestajId]);

  const fetchRezervacije = async () => {
    try {
      const response = await fetch(`http://localhost:5178/api/Rezervacija/PreuzmiRezervacijeSmestaja/${smestajId}`);
      const data = await response.json();
      setRezervacije(data);
    } catch (error) {
      console.error('Greška pri dohvatanju podataka o rezervacijama:', error);
    }
  };

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleDodajRezervaciju = async () => {
    try {
      const response = await fetch(`http://localhost:5178/api/Rezervacija/DodajRezervacijuUSmestaj/${smestajId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ime,
          prezime,
          brojPasosa,
          brojTelefona,
          brojOsoba,
          email,
        }),
      });

      if (response.ok) {
        // Osvježi listu rezervacija
        fetchRezervacije();
        // Zatvori formu
        handleCloseForm();
      } else {
        console.error('Greška pri dodavanju rezervacije:', response.statusText);
      }
    } catch (error) {
      console.error('Greška pri dodavanju rezervacije:', error);
    }
  };

  const handleOtkaziRezervaciju = async (reservationId) => {
    try {
      const response = await fetch(`http://localhost:5178/api/Rezervacija/ObrisiRezervaciju${reservationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Osvježi listu rezervacija
        fetchRezervacije();
      } else {
        console.error('Greška pri otkazivanju rezervacije:', response.statusText);
      }
    } catch (error) {
      console.error('Greška pri otkazivanju rezervacije:', error);
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom style={{ fontFamily: 'sans-serif' }}>
        <Divider style={{ marginTop: '30px' }}>Rezervacije smeštaja</Divider>
      </Typography>

      <Modal
        open={openForm}
        onClose={handleCloseForm}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
            timeout: 500,
        }}
      >
        <div style={{ 
          textAlign: 'center', 
          position: 'fixed', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white', 
          padding: '20px',
          borderRadius: '10px', 
          boxShadow: '0 0 20px 5px rgba(0, 0, 0, 0.1)', 
          height: '550px', 
          width: '450px'
        }}>
          <Typography variant="h5" gutterBottom>
            Rezervacija
          </Typography>
          <TextField
            label="Ime"
            name="ime"
            value={ime}
            onChange={(e) => setIme(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Prezime"
            name="prezime"
            value={prezime}
            onChange={(e) => setPrezime(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Broj pasoša"
            name="brojPasosa"
            value={brojPasosa}
            onChange={(e) => setBrojPasosa(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Broj telefona"
            name="brojTelefona"
            value={brojTelefona}
            onChange={(e) => setBrojTelefona(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Broj osoba"
            name="brojOsoba"
            type="number"
            value={brojOsoba}
            onChange={(e) => setBrojOsoba(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="outlined" color="primary" onClick={handleDodajRezervaciju}>
            Rezerviši
          </Button>
        </div>
      </Modal>

      {/* Prikaz rezervacija */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        {rezervacije.map((rezervacija) => (
          <Card key={rezervacija.id} style={{ margin: '10px', display: 'inline-block', width: '300px' }}>
            <CardContent>
              <Typography variant="body2" component="div">
                Ime i prezime: {rezervacija.ime} {rezervacija.prezime}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Broj osoba: {rezervacija.brojOsoba}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: {rezervacija.email}
              </Typography>
              {!loggedIn && (
                 <Button 
                 variant="outlined" 
                 color="secondary" 
                 onClick={() => handleOtkaziRezervaciju(rezervacija.id)}
                 style={{ marginTop: '10px' }}
               >
                 OTKAŽI REZERVACIJU
               </Button>
              )}
             
            </CardContent>
          </Card>
        ))}
        <Divider>
          {!loggedIn && (
            <Button
            variant="outlined"
            color="primary"
            onClick={handleOpenForm}
            style={{
            display: 'block',
            margin: 'auto',
            marginTop: '20px',
            padding: '10px 20px',
            }}
        >
            Rezerviši smestaj
        </Button>
          )}
        
        </Divider>
       
      </div>
    </div>
  );
};

export default Rezervacije;
