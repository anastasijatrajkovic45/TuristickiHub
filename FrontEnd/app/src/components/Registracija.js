import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Paper, Box, Divider, Checkbox, FormControlLabel, Grid, IconButton } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { styled } from '@mui/system';

const Registracija = ({ onSuccess }) => {
  const [korisnik, setKorisnik] = useState({ ime: '', prezime: '', username: '', password: '', email: '', isAdmin: false, zaduzenaAgencijaId: null });
  const [greska, setGreska] = useState('');
  const [agencije, setAgencije] = useState([]);


  useEffect(() => {
    const fetchAgencije = async () => {
      try {
        const response = await fetch('http://localhost:5178/api/Agencija/PreuzmiAgencije');
        const data = await response.json();
        setAgencije(data);
      } catch (error) {
        console.error('Error fetching agencije:', error);
      }
    };

    fetchAgencije();
  }, []);

const CustomButton = styled(Button)({
  backgroundColor: '#900C3F',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#6d0a33',
  },
});

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    setKorisnik({ ...korisnik, [name]: inputValue });
  };

  const handleAgencijaSelection = (agencijaId) => {
    setKorisnik({ ...korisnik, zaduzenaAgencijaId: agencijaId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5178/api/Auth/Register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(korisnik),
      });
      if (response.ok) {
        onSuccess();
      } else {
        throw new Error('Neuspešna registracija');
      }
    } catch (error) {
      setGreska(error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={1} sx={{ padding: 1, marginTop: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginBottom: 1 }}>
        <IconButton sx={{ color: '#900C3F' }} aria-label="registracija-icon" ssx={{ marginBottom: 2 }}>
            <AccountCircle fontSize="large" />
          </IconButton>
          <Typography variant="h6" align="center" gutterBottom>
            Registracija
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={1.5}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ime"
                name="ime"
                value={korisnik.ime}
                onChange={handleChange}
                variant="outlined"
                required
                InputProps={{
                  startAdornment: <AccountCircle />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prezime"
                name="prezime"
                value={korisnik.prezime}
                onChange={handleChange}
                variant="outlined"
                required
                InputProps={{
                  startAdornment: <AccountCircle />
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Korisničko ime"
                name="username"
                value={korisnik.username}
                onChange={handleChange}
                variant="outlined"
                required
                InputProps={{
                  startAdornment: <AccountCircle />
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Lozinka"
                name="password"
                value={korisnik.password}
                onChange={handleChange}
                variant="outlined"
                required
                InputProps={{
                  startAdornment: <AccountCircle />
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={korisnik.email}
                onChange={handleChange}
                variant="outlined"
                required
                InputProps={{
                  startAdornment: <AccountCircle />
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox color="primary" />}
                label="Admin"
                name="isAdmin"
                checked={korisnik.isAdmin}
                onChange={handleChange}
              />
            </Grid>
            {!korisnik.isAdmin && (
              <>
                <Grid item xs={12}>
                  <Divider>
                    <Typography variant="body1" align="center" gutterBottom>
                      Izaberite agenciju:
                    </Typography>
                  </Divider>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    {agencije.map((agencija) => (
                      <Button key={agencija.id} variant="outlined" color="inherit" onClick={() => handleAgencijaSelection(agencija.id)}>{agencija.naziv}</Button>
                    ))}
                  </Box>
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              {greska && <Typography color="error" align="center" gutterBottom>{greska}</Typography>}
            </Grid>
            <Grid item xs={12}>
            <CustomButton type="submit" variant="contained" fullWidth>
              Registruj se
            </CustomButton>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Registracija;
