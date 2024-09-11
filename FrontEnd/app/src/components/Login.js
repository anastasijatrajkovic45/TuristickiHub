import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Paper, Box, Grid, IconButton } from '@mui/material';
import { AccountCircle, Lock, PermIdentity } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system'; // Dodali smo styled

const CustomButton = styled(Button)({
  backgroundColor: '#900C3F',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#6d0a33',
  },
});

const Login = ({ onSuccess }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5178/api/Auth/Login?username=${credentials.username}&password=${credentials.password}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const data = await response.json();
      console.log(data);
      // Sačuvaj token u lokalno skladište
      localStorage.setItem('token', data.token);
      setLoggedIn(true);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setError('Pogrešno korisničko ime ili lozinka.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  if (loggedIn) {
    return <Link to="/" />;
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 4}}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 2 }}>
          <IconButton color="#900C3F" aria-label="logovanje-icon" sx={{ marginRight: 1 }}>
            <PermIdentity fontSize="large" />
          </IconButton>
          <Typography variant="h6" align="center" gutterBottom>
            Logovanje
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <Box sx={{ '& .MuiTextField-root': { marginBottom: 2 } }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Korisničko ime"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  variant="outlined"
                  required
                  InputProps={{
                    startAdornment: (
                      <IconButton size="small" edge="start">
                        <AccountCircle />
                      </IconButton>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Lozinka"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  variant="outlined"
                  required
                  InputProps={{
                    startAdornment: (
                      <IconButton size="small" edge="start">
                        <Lock />
                      </IconButton>
                    )
                  }}
                />
              </Grid>
            </Grid>
          </Box>
          {error && <Typography color="error" align="center" gutterBottom>{error}</Typography>}
          <CustomButton type="submit" variant="contained" fullWidth sx={{ marginTop: 2 }}>
            Prijavi se
          </CustomButton>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
