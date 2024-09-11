import React from 'react';
import { Box, Typography, Container, Grid, Paper, Card, CardContent, CardMedia, Button, Slide, Zoom } from '@mui/material';
import { Link } from 'react-router-dom';

const Pocetna = () => {
  return (
    <Box sx={{ 
      backgroundImage: 'url("https://t4.ftcdn.net/jpg/03/15/12/87/360_F_315128792_pYeedaWnVzdCuFiYiLQRNtHP5JT4pvWV.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
    }}>
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Typography textAlign="center" variant="h4" gutterBottom style={{ fontFamily: 'cursive', fontWeight: 'bold', color: '#900C3F' }}>
        Dobrodošli na TurističkiHub
      </Typography>
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        <Grid item xs={12} md={4}>
          <Zoom in={true} timeout={1000}>
            <Card sx={{ height: '100%', boxShadow: 10 }}>
              <CardMedia
                component="img"
                height="300"
                image="https://st2.depositphotos.com/3725083/5485/i/450/depositphotos_54856347-stock-photo-travel-the-world-monument-concept.jpg"
                alt="Avion"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Otkrijte naša putovanja
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pretražite našu široku ponudu putovanja širom sveta. Izaberite destinaciju, pronađite smeštaj i
                  rezervišite odmah!
                </Typography>
                <Button component={Link} to="/PutovanjePrikaz" variant="outlined" size="large" sx={{ color:'#900C3F', borderColor:'#900C3F', mt: 2 }}>
                  Pogledajte putovanja
                </Button>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>
        <Grid item xs={12} md={4}>
          <Zoom in={true} timeout={1000}>
            <Card sx={{ height: '100%', boxShadow: 10 }}>
              <CardMedia
                component="img"
                height="300"
                image="https://www.vyootrip.com/wp-content/uploads/2021/09/razones-agencia-de-viajes-corporativos.jpeg.webp"
                alt="Agencije"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Sve agencije na jednom mestu
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pronađite sve renomirane turističke agencije na jednom mestu. Pregledajte njihove ponude i
                  rezervišite svoje putovanje već danas!
                </Typography>
                <Button component={Link} to="/Agencije" variant="outlined" size="large" sx={{ color:'#900C3F', borderColor:'#900C3F', mt: 2 }}>
                  Pogledajte agencije
                </Button>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>
        <Grid item xs={12} md={4}>
          <Zoom in={true} timeout={1000}>
            <Card sx={{ height: '100%', boxShadow: 10 }}>
              <CardMedia
                component="img"
                height="300"
                image="https://document360.com/wp-content/uploads/2023/01/Auto-register-for-SSO-readers-1200x683.png"
                alt="Registracija"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Registrujte se kao agencija
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Postanite deo naše zajednice i dodajte svoje putovanja i smeštajne opcije. Registracija je brza i
                  jednostavna.
                </Typography>
                <Button component={Link} to="/Registracija"  variant="outlined" size="large" sx={{ color:'#900C3F', borderColor:'#900C3F', mt: 2 }}>
                  Registrujte se
                </Button>
                {/* <Button component={Link} to="/Login" variant="outlined" size="large" sx={{ color:'#900C3F', borderColor:'#900C3F', mt: 2 }}>
                  Uloguj se
                </Button> */}
              </CardContent>
            </Card>
          </Zoom>
        </Grid>
        <Grid item xs={12}>
          <Slide direction="right" in={true} timeout={1000}>
            <Paper sx={{ p: 3, boxShadow: 5 }}>
              <Typography variant="h6" gutterBottom>
                Zašto odabrati TurističkiHub?
              </Typography>
              <Typography variant="body2">
                TurističkiHub nudi najširi izbor putovanja i smeštaja po najpovoljnijim cenama. Uz nas možete lako
                rezervisati svoj sledeći odmor i istražiti svet.
              </Typography>
            </Paper>
          </Slide>
        </Grid>
      </Grid>
    </Container>
    </Box>
  );
};

export default Pocetna;
