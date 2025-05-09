import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { DirectionsBoat, LocalShipping } from '@mui/icons-material';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <DirectionsBoat sx={{ mr: 1 }} />
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            mr: 2,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          UMTest
        </Typography>
        <Box sx={{ flexGrow: 1 }}>
          <Button
            component={Link}
            to="/bookings"
            color="inherit"
            sx={{ mr: 1 }}
          >
            Bookings
          </Button>
          <Button
            component={Link}
            to="/vehicles"
            color="inherit"
          >
            Vehicles
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;