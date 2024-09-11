import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, CircularProgress, Grid, Divider, Button, Dialog, DialogTitle, DialogContent, TextField } from '@mui/material';
import { Box } from '@mui/system';
//import StarRatings from 'react-star-ratings';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


const Recenzije = () => {
  const { id } = useParams();
  const [recenzije, setRecenzije] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [novaRecenzija, setNovaRecenzija] = useState({ korisnik: '', komentar: '', ocena: 0 });
  const [izmenaRecenzije, setIzmenaRecenzije] = useState(false);
  const [izmenjeniPodaci, setIzmenjeniPodaci] = useState({ id: '', korisnik: '', komentar: '', ocena: 0 });
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
    fetch(`http://localhost:5178/api/Recenzija/PreuzmiRecenzijeNaPutovanju/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setRecenzije(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Greška pri preuzimanju recenzija:', error);
        setLoading(false);
      });
  };

  const handleDodajRecenziju = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNovaRecenzija((prevRecenzija) => ({
      ...prevRecenzija,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    fetch(`http://localhost:5178/api/Recenzija/DodajRecenzijuPutovanju/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novaRecenzija),
    })
      .then(() => {
        setNovaRecenzija({ korisnik: '', komentar: '', ocena: 0 });
        setOpenForm(false);
        fetchData();
      })
      .catch((error) => {
        console.error('Greška pri dodavanju recenzije:', error);
      });
  };

  const handleObrisiRecenziju = (recenzijaId) => {
    fetch(`http://localhost:5178/api/Recenzija/ObrisiRecenziju${recenzijaId}`, {
      method: 'DELETE',
    })
      .then(() => {
        fetchData();
      })
      .catch((error) => {
        console.error('Greška pri brisanju recenzije:', error);
      });
  };

  const handleIzmeniRecenziju = (recenzijaId) => {
    const recenzijaZaIzmenu = recenzije.find((recenzija) => recenzija.id === recenzijaId);
    setIzmenjeniPodaci({
      id: recenzijaZaIzmenu.id,
      korisnik: recenzijaZaIzmenu.korisnik,
      komentar: recenzijaZaIzmenu.komentar,
      ocena: recenzijaZaIzmenu.ocena,
    });
    setIzmenaRecenzije(true);
  };

  const handleIzmenaChange = (event) => {
    const { name, value } = event.target;
    setIzmenjeniPodaci((prevPodaci) => ({
      ...prevPodaci,
      [name]: value,
    }));
  };

  const handleSacuvajIzmenu = () => {
    fetch(`http://localhost:5178/api/Recenzija/AzurirajRecenziju${izmenjeniPodaci.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(izmenjeniPodaci),
    })
      .then(() => {
        setIzmenjeniPodaci({ id: '', korisnik: '', komentar: '', ocena: 0 });
        setIzmenaRecenzije(false);
        fetchData();
      })
      .catch((error) => {
        console.error('Greška pri ažuriranju recenzije:', error);
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h6" gutterBottom style={{ fontFamily: 'sans-serif' }}>
        <Divider variant="h4">Recenzije putovanja</Divider>
        {!loggedIn && (
          <Button
          id="dodajRecenziju"
          variant="contained"
          sx={{backgroundColor: '#900C3F'}}
          style={{
            margin: '0 auto',
            display: 'block',
            marginTop: '20px',
          }}
          onClick={handleDodajRecenziju}
        >
          Dodaj
        </Button>
        )}
        
      </Typography>

      {loading ? (
        <CircularProgress style={{ marginTop: '20px' }} />
      ) : (
        <Box id="recenzije" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {recenzije.map((recenzija) => (
            <Box
              key={recenzija.id}
              sx={{
                width: '80%',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
              }}
            >
              <Typography variant="h6" gutterBottom>
                {recenzija.korisnik}
                <span style={{ marginLeft: '10px' }}>
                  {!loggedIn && (
                     <EditIcon
                     id="izmeniRecenziju"
                     color="success"
                     sx={{ cursor: 'pointer', marginRight: '10px' }}
                     onClick={() => handleIzmeniRecenziju(recenzija.id)}
                     onMouseOver={(e) => e.target.style.opacity = 0.7}
                     onMouseOut={(e) => e.target.style.opacity = 1}
                   />
                  )}
                  {!loggedIn && (
                     <DeleteIcon
                     id="obrisiRecenziju"
                     color="error"
                     sx={{ cursor: 'pointer' }}
                     onClick={() => handleObrisiRecenziju(recenzija.id)}
                     onMouseOver={(e) => e.target.style.opacity = 0.7}
                     onMouseOut={(e) => e.target.style.opacity = 1}
                   />
                  )}
                </span>
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Komentar: {recenzija.komentar}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Ocena:{recenzija.ocena}
                {/* <StarRatings
                      rating={recenzija.ocena}
                      starRatedColor="gold"
                      numberOfStars={5}
                      name="ocena"
                      starDimension="20px"
                      starSpacing="2px"
                /> */}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
      

      <Dialog open={openForm} onClose={handleCloseForm}>
        <DialogTitle>Dodaj novu recenziju</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="korisnik"
            name="korisnik"
            label="Korisnik"
            type="text"
            fullWidth
            value={novaRecenzija.korisnik}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="komentar"
            name="komentar"
            label="Komentar"
            type="text"
            fullWidth
            value={novaRecenzija.komentar}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="ocena"
            name="ocena"
            label="Ocena"
            type="text"
            fullWidth
            value={novaRecenzija.ocena}
            onChange={handleChange}
          />
          {/* <Box>
            <Typography component="legend">Ocena</Typography>
            <StarRatings
              id="ocena"
              rating={novaRecenzija.ocena}
              starRatedColor="gold"
              changeRating={(newRating) => handleChange({ target: { name: 'ocena', value: newRating } })}
              numberOfStars={5}
              name="ocena"
              starDimension="30px"
              starSpacing="2px"
            />
          </Box> */}
          <Button id="sacuvajDodavanje" variant="contained" sx={{backgroundColor: '#900C3F'}} onClick={handleSubmit}>
            Sačuvaj
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog open={izmenaRecenzije} onClose={() => setIzmenaRecenzije(false)}>
        <DialogTitle>Izmeni recenziju</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="korisnikIzmeni"
            name="korisnik"
            label="Korisnik"
            type="text"
            fullWidth
            value={izmenjeniPodaci.korisnik}
            onChange={handleIzmenaChange}
          />
          <TextField
            margin="dense"
            id="komentarIzmeni"
            name="komentar"
            label="Komentar"
            type="text"
            fullWidth
            value={izmenjeniPodaci.komentar}
            onChange={handleIzmenaChange}
          />
          <TextField
            margin="dense"
            id="ocenaIzmeni"
            name="ocena"
            label="Ocena"
            type="text"
            fullWidth
            value={izmenjeniPodaci.ocena}
            onChange={handleIzmenaChange}
          />
          {/* <Box>
            <Typography component="legend">Ocena</Typography>
            <StarRatings
              id="ocenaIzmeni"
              rating={izmenjeniPodaci.ocena}
              starRatedColor="gold"
              changeRating={(newRating) => handleIzmenaChange({ target: { name: 'ocena', value: newRating } })}
              numberOfStars={5}
              name="ocena"
              starDimension="30px"
              starSpacing="2px"
            />
          </Box> */}
          <Button id="sacuvajIzmene" variant="contained" sx={{backgroundColor: '#900C3F'}} onClick={handleSacuvajIzmenu}>
            Sačuvaj izmene
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Recenzije;
