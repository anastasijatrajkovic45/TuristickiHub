import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Tabs, Tab, IconButton, Button, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5178/api/Auth/Logout?token=${encodeURIComponent(token)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        localStorage.removeItem('token');
        setLoggedIn(false);
        window.location.href = '/'; 
      } else {
        console.error('Neuspela odjava');
      }
    } catch (error) {
      console.error('Greška pri odjavi:', error);
    }
  };
  

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#900C3F' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          TurističkiHub
        </Typography>
        <Tabs>
          <Tab label="Početna" component={Link} to="/" sx={{ color: 'white' }} />
          <Tab label="Agencije" component={Link} to="/Agencije" sx={{ color: 'white' }} />
          <Tab label="Destinacije" component={Link} to="/PutovanjePrikaz" sx={{ color: 'white' }} />
        </Tabs>
        {loggedIn ? (
          <>
            <IconButton onClick={handleMenuOpen}>
              <img src="/images/avatar.png" alt="Avatar korisnika" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleLogout}>Odjavi se</MenuItem>
            </Menu>
          </>
        ) : (
          <Button component={Link} to="/Login" color="inherit">Prijavi se</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
