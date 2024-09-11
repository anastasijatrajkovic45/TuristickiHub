import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {Card, CardContent, Typography, CircularProgress, Grid, Divider, Button, Dialog, DialogTitle, DialogContent, TextField} from '@mui/material';
import Smestaj from './Smestaj';

const PutovanjeProfil = () => {
  const { id } = useParams();
  const [aktivnosti, setAktivnosti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [novaAktivnost, setNovaAktivnost] = useState({ naziv: '', cena: '' });
  const [izmenaAktivnosti, setIzmenaAktivnosti] = useState(false);
  const [izmenjeniPodaci, setIzmenjeniPodaci] = useState({ id: '', naziv: '', cena: '' });
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
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    fetch(`http://localhost:5178/api/Aktivnost/PreuzmiAktivnostiNaPutovanju/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setAktivnosti(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Greška pri preuzimanju aktivnosti:', error);
        setLoading(false);
      });
  };

  const handleDodajAktivnost = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNovaAktivnost((prevAktivnost) => ({
      ...prevAktivnost,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    fetch(`http://localhost:5178/api/Aktivnost/DodajAktivnostPutovanju/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novaAktivnost),
    })
      .then(() => {
        setNovaAktivnost({ naziv: '', cena: '' });
        setOpenForm(false);
        fetchData();
      })
      .catch((error) => {
        console.error('Greška pri dodavanju aktivnosti:', error);
      });
  };

  const handleObrisiAktivnost = (aktivnostId) => {
    fetch(`http://localhost:5178/api/Aktivnost/ObrisiAktivnost${aktivnostId}`, {
      method: 'DELETE',
    })
      .then(() => {
        fetchData();
      })
      .catch((error) => {
        console.error('Greška pri brisanju aktivnosti:', error);
      });
  };



  const handleIzmeniAktivnost = (aktivnostId) => {
    const aktivnostZaIzmenu = aktivnosti.find((aktivnost) => aktivnost.id === aktivnostId);
    setIzmenjeniPodaci({
      id: aktivnostZaIzmenu.id,
      naziv: aktivnostZaIzmenu.naziv,
      cena: aktivnostZaIzmenu.cena,
    });
    setIzmenaAktivnosti(true);
  };

  const handleIzmenaChange = (event) => {
    const { name, value } = event.target;
    setIzmenjeniPodaci((prevPodaci) => ({
      ...prevPodaci,
      [name]: value,
    }));
  };

  const handleSacuvajIzmenu = () => {
    fetch(`http://localhost:5178/api/Aktivnost/AzurirajAktivnost${izmenjeniPodaci.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(izmenjeniPodaci),
    })
      .then(() => {
        setIzmenjeniPodaci({ id: '', naziv: '', cena: '' });
        setIzmenaAktivnosti(false);
        fetchData();
      })
      .catch((error) => {
        console.error('Greška pri ažuriranju aktivnosti:', error);
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h6" gutterBottom style={{ fontFamily: 'sans-serif' }}>
        <Divider variant='h4'>Aktivnosti na putovanju</Divider>
        {loggedIn && !isAdmin && (
           <Button
           id="dodajAktivnost"
           variant="contained"
           sx={{backgroundColor: '#900C3F'}}
           style={{
             margin: '0 auto', 
             display: 'block'
           }}
           onClick={handleDodajAktivnost}
         >
           Dodaj
         </Button>
        )}
      </Typography>
      {loading ? (
        <CircularProgress style={{ marginTop: '20px' }} />
      ) : (
        <Grid container spacing={3} style={{ marginTop: '20px' }}>
          {aktivnosti.map((aktivnost) => (
            <Grid item xs={12} sm={6} md={4} key={aktivnost.id}>
              <Card id="aktivnosti" variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {aktivnost.naziv}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Cena: {aktivnost.cena}
                  </Typography>
                  {loggedIn && !isAdmin && (
                     <Button
                     id="obrisiAktivnost"
                     variant="outlined"
                     color="error"
                     onClick={() => handleObrisiAktivnost(aktivnost.id)}
                     style={{ marginTop: '10px' }}
                   >
                     Obriši
                   </Button>
                  )}
                 
                 {loggedIn && !isAdmin &&(
                    <Button
                    id="izmeniAktivnost"
                    variant="outlined"
                    color="success"
                    onClick={() => handleIzmeniAktivnost(aktivnost.id)}
                    style={{ marginLeft: '10px', marginTop: '10px' }}
                  >
                    Izmeni
                  </Button>
                 )}
                  
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openForm} onClose={handleCloseForm}>
        <DialogTitle>Dodaj novu aktivnost</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="nazivAktivnosti"
            name="naziv"
            label="Naziv"
            type="text"
            fullWidth
            value={novaAktivnost.naziv}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="cenaAktivnosti"
            name="cena"
            label="Cena"
            type="text"
            fullWidth
            value={novaAktivnost.cena}
            onChange={handleChange}
          />
          <Button id="sacuvajAktivnost" variant="contained" sx={{backgroundColor: '#900C3F'}} onClick={handleSubmit}>
            Sačuvaj
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog open={izmenaAktivnosti} onClose={() => setIzmenaAktivnosti(false)}>
        <DialogTitle>Izmeni aktivnost</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="izmeniNazivAktivnosti"
            name="naziv"
            label="Naziv"
            type="text"
            fullWidth
            value={izmenjeniPodaci.naziv}
            onChange={handleIzmenaChange}
          />
          <TextField
            margin="dense"
            id="izmeniCenuAktivnosti"
            name="cena"
            label="Cena"
            type="text"
            fullWidth
            value={izmenjeniPodaci.cena}
            onChange={handleIzmenaChange}
          />
          <Button id="sacuvajIzmeneAktivnosti" variant="contained" sx={{backgroundColor: '#900C3F'}} onClick={handleSacuvajIzmenu}>
            Sačuvaj izmene
          </Button>
        </DialogContent>
      </Dialog>

      {/* <Smestaj/> */}
    </div>
  );
};

export default PutovanjeProfil;
