import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, styled } from '@mui/material';
import { DirectionsBoat, LocalShipping } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create a tricolor theme to match the rest of the app
const theme = createTheme({
  palette: {
    primary: {
      main: '#00204e', // Dark blue
    },
    secondary: {
      main: '#e63946', // Red
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
});

// Create a red indicator line component with animation
const IndicatorLine = styled('div')(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  height: '3px',
  backgroundColor: theme.palette.secondary.main,
  transition: 'transform 0.3s ease-in-out, width 0.3s ease-in-out',
}));

// Styled component for nav buttons
const NavButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  fontWeight: 500,
  marginRight: theme.spacing(2),
  minWidth: '100px',
}));

const Navbar = () => {
  // Determine active page based on current path
  const path = window.location.pathname;
  const isBookingsActive = path.includes('/bookings');
  const isVehiclesActive = path.includes('/vehicles');

  // These refs will help us get the position and width of the buttons
  const bookingBtnRef = React.useRef(null);
  const vehicleBtnRef = React.useRef(null);

  // Calculate the indicator position and width
  const getIndicatorStyle = () => {
    if (isBookingsActive && bookingBtnRef.current) {
      return {
        width: bookingBtnRef.current.offsetWidth,
        transform: `translateX(${bookingBtnRef.current.offsetLeft}px)`,
      };
    }
    else if (isVehiclesActive && vehicleBtnRef.current) {
      return {
        width: vehicleBtnRef.current.offsetWidth,
        transform: `translateX(${vehicleBtnRef.current.offsetLeft}px)`,
      };
    }
    return { width: 0, transform: 'translateX(0)' };
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <DirectionsBoat sx={{ mr: 1, color: 'white' }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              mr: 2,
              textDecoration: 'none',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            UMTest
          </Typography>
          <Box sx={{ flexGrow: 1, position: 'relative' }}>
            <Box sx={{ display: 'flex' }}>
              <NavButton
                ref={bookingBtnRef}
                component={Link}
                to="/bookings"
                color="inherit"
                startIcon={<DirectionsBoat />}
                sx={{ fontWeight: isBookingsActive ? 600 : 500 }}
              >
                Bookings
              </NavButton>
              <NavButton
                ref={vehicleBtnRef}
                component={Link}
                to="/vehicles"
                color="inherit"
                startIcon={<LocalShipping />}
                sx={{ fontWeight: isVehiclesActive ? 600 : 500 }}
              >
                Vehicles
              </NavButton>
            </Box>
            <IndicatorLine sx={getIndicatorStyle()} />
          </Box>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default Navbar;