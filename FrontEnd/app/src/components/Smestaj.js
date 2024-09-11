import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Modal,
  Backdrop,
  Fade,
  IconButton,
  Button,
  TextField,
  Paper,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import Gallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

const Smestaj = () => {
  const { id } = useParams();
  const [smestaji, setSmestaji] = useState([]);
  const [selectedSmestaj, setSelectedSmestaj] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [noviSmestaj, setNoviSmestaj] = useState({
    naziv: '',
    cenaSmestaja: 0,
    udaljenostCentra: 0,
    slike: [],
  });
  const [editSmestaj, setEditSmestaj] = useState({
    id: '',
    naziv: '',
    cenaSmestaja: 0,
    udaljenostCentra: 0,
    slike: [],
  });

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
    const fetchSmestaji = async () => {
      try {
        const response = await fetch(`http://localhost:5178/api/Smestaj/PreuzmiSmestajeNaPutovanju/${id}`);
        const data = await response.json();
        setSmestaji(data);
      } catch (error) {
        console.error('Greška pri dohvatanju podataka o smeštaju:', error);
      }
    };

    fetchSmestaji();
  }, [id]);

  const fetchSmestaji = async () => {
    try {
      const response = await fetch(`http://localhost:5178/api/Smestaj/PreuzmiSmestajeNaPutovanju/${id}`);
      const data = await response.json();
      setSmestaji(data);
    } catch (error) {
      console.error('Greška pri dohvatanju podataka o smeštaju:', error);
    }
  };

  const openImageModal = (smestaj, imageIndex) => {
    setSelectedSmestaj(smestaj);
    setCurrentImageIndex(imageIndex);
    setOpenModal(true);
  };

  const closeImageModal = () => {
    setOpenModal(false);
  };

  const openEditModal = (smestaj) => {
    setEditSmestaj(smestaj);
    setEditModal(true);
  };

  const closeEditModal = () => {
    setEditSmestaj({
      id: '',
      naziv: '',
      cenaSmestaja: 0,
      udaljenostCentra: 0,
      slike: [],
    });
    setEditModal(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % (selectedSmestaj?.slike?.length || 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex - 1 + (selectedSmestaj?.slike?.length || 1)) % (selectedSmestaj?.slike?.length || 1)
    );
  };

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;

    if (formType === 'novi') {
      if (name === 'slike') {
        const slikeArray = value.split(',').filter((link) => link.trim() !== '');
        setNoviSmestaj((prevSmestaj) => ({ ...prevSmestaj, [name]: slikeArray }));
      } else {
        setNoviSmestaj((prevSmestaj) => ({ ...prevSmestaj, [name]: value }));
      }
    } else if (formType === 'edit') {
      if (name === 'slike') {
        const slikeArray = value.split(',').filter((link) => link.trim() !== '');
        setEditSmestaj((prevSmestaj) => ({ ...prevSmestaj, [name]: slikeArray }));
      } else {
        setEditSmestaj((prevSmestaj) => ({ ...prevSmestaj, [name]: value }));
      }
    }
  };

  const handleDodajSmestaj = async () => {
    try {
      const response = await fetch(`http://localhost:5178/api/Smestaj/DodajSmestajPutovanju/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noviSmestaj),
      });

      if (response.ok) {
        await fetchSmestaji();
        setShowForm(false);
      } else {
        console.error('Greška pri dodavanju smeštaja:', response.statusText);
      }
    } catch (error) {
      console.error('Greška pri dodavanju smeštaja:', error);
    }
  };

  const handleAzurirajSmestaj = async () => {
    try {
      const response = await fetch(`http://localhost:5178/api/Smestaj/AzurirajSmestaj${editSmestaj.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editSmestaj),
      });

      if (response.ok) {
        await fetchSmestaji();
        setEditModal(false);
      } else {
        console.error('Greška pri ažuriranju smeštaja:', response.statusText);
      }
    } catch (error) {
      console.error('Greška pri ažuriranju smeštaja:', error);
    }
  };

  const handleObrisiSmestaj = async (smestajId) => {
    try {
      const response = await fetch(`http://localhost:5178/api/Smestaj/ObrisiSmestaj${smestajId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchSmestaji();
      } else {
        console.error('Greška pri brisanju smeštaja:', response.statusText);
      }
    } catch (error) {
      console.error('Greška pri brisanju smeštaja:', error);
    }
  };

  const handleRezervacija = (putovanjeId, smestajId) => {
    window.location.href = `http://localhost:3000/Putovanje/${putovanjeId}/Smestaj/${smestajId}/Rezervacije`;
  };

  const renderImages = (smestaj) => {
    return smestaj.slike.map((slika, index) => ({
      original: slika,
      thumbnail: slika,
      //description: `${smestaj.naziv} - slika ${index + 1}`,
    }));
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom style={{ fontFamily: 'sans-serif' }}>
        <Divider style={{ marginTop: '30px' }}>Lista smestaja</Divider>
      </Typography>
      {loggedIn && !isAdmin && (
        <Button
        variant="outlined"
        color="primary"
        onClick={() => setShowForm(true)}
        style={{
          display: 'block',
          margin: 'auto',
          marginTop: '20px',
          padding: '10px 20px',
        }}
      >
        Dodaj
      </Button>
      )}
      

      {showForm && (
        <Modal
          open={showForm}
          onClose={() => setShowForm(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={showForm}>
            <Paper
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                p: 4,
                minWidth: 300,
              }}
            >
              <Typography variant="h5" gutterBottom>
                Dodaj smeštaj
              </Typography>
              <TextField
                label="Naziv smeštaja"
                name="naziv"
                value={noviSmestaj.naziv}
                onChange={(e) => handleInputChange(e, 'novi')}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Cena smeštaja"
                name="cenaSmestaja"
                type="number"
                value={noviSmestaj.cenaSmestaja}
                onChange={(e) => handleInputChange(e, 'novi')}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Udaljenost od centra"
                name="udaljenostCentra"
                type="number"
                value={noviSmestaj.udaljenostCentra}
                onChange={(e) => handleInputChange(e, 'novi')}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Slike smeštaja (unesite linkove razdvojene zarezom)"
                name="slike"
                value={noviSmestaj.slike.join(', ')}
                onChange={(e) => handleInputChange(e, 'novi')}
                fullWidth
                margin="normal"
              />

              <Button variant="outlined" color="primary" onClick={handleDodajSmestaj}>
                Dodaj smeštaj
              </Button>
            </Paper>
          </Fade>
        </Modal>
      )}

      {editModal && (
        <Modal
          open={editModal}
          onClose={closeEditModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={editModal}>
            <Paper
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                p: 4,
                minWidth: 300,
              }}
            >
              <Typography variant="h5" gutterBottom>
                Izmene smeštaja
              </Typography>
              <TextField
                label="Naziv smeštaja"
                name="naziv"
                value={editSmestaj.naziv}
                onChange={(e) => handleInputChange(e, 'edit')}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Cena smeštaja"
                name="cenaSmestaja"
                type="number"
                value={editSmestaj.cenaSmestaja}
                onChange={(e) => handleInputChange(e, 'edit')}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Udaljenost od centra"
                name="udaljenostCentra"
                type="number"
                value={editSmestaj.udaljenostCentra}
                onChange={(e) => handleInputChange(e, 'edit')}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Slike smeštaja (unesite linkove razdvojene zarezom)"
                name="slike"
                value={editSmestaj.slike.join(', ')}
                onChange={(e) => handleInputChange(e, 'edit')}
                fullWidth
                margin="normal"
              />
              <Button variant="outlined" color="primary" onClick={handleAzurirajSmestaj}>
                Sačuvaj izmene
              </Button>
            </Paper>
          </Fade>
        </Modal>
      )}

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        {Array.isArray(smestaji) ? (
          smestaji.map((smestaj) => (
            <Card
              key={smestaj.id}
              style={{ margin: '10px', display: 'inline-block', width: '300px', height: '500px', verticalAlign: 'top' }}
            >
              <Gallery items={renderImages(smestaj)} />
              <CardContent>
                <Typography variant="h6" component="div">
                  {smestaj.naziv}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cena: {smestaj.cenaSmestaja} eura
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Udaljenost od centra: {smestaj.udaljenostCentra} m
                </Typography>
                {loggedIn && !isAdmin && (
                  <IconButton
                  color="error"
                  onClick={() => handleObrisiSmestaj(smestaj.id)}
                  style={{ marginTop: '10px' }}
                >
                  <DeleteIcon />
                </IconButton>
                )}
                {loggedIn && !isAdmin && (
                  <IconButton
                  color="primary"
                  onClick={() => openEditModal(smestaj)}
                  style={{ marginTop: '10px' }}
                >
                  <EditIcon />
                </IconButton>
                )}
                
                <IconButton
                  color="primary"
                  onClick={() => handleRezervacija(id, smestaj.id)}
                  style={{ marginTop: '10px' }}
                >
                  <EventAvailableIcon />
                </IconButton>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1" color="error">
            Greška pri učitavanju smeštaja. Proverite da li su podaci ispravno učitani iz API-ja.
          </Typography>
        )}
      </div>

      <Modal
        open={openModal}
        onClose={closeImageModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <div>
            <IconButton onClick={prevImage}>
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
            <img
              src={selectedSmestaj?.slike?.[currentImageIndex] || ''}
              alt={`${selectedSmestaj?.naziv || ''} - slika ${currentImageIndex + 1}`}
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
            />
            <IconButton onClick={nextImage}>
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default Smestaj;
