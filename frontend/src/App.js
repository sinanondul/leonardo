import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Components
import Navbar from './components/layout/NavBar';
import Home from './components/Home';
import BookingsList from './components/bookings/BookingsList';
import VehiclesList from './components/vehicles/VehilclesList';

// Create a theme
const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/bookings" element={<BookingsList />} />
              <Route path="/vehicles" element={<VehiclesList />} />
            </Routes>
          </Box>
          <Box
            component="footer"
            sx={{
              py: 3,
              px: 2,
              mt: 'auto',
              backgroundColor: (theme) => theme.palette.grey[200]
            }}
          >
            <Typography variant="body2" color="text.secondary" align="center">
              UMTest © {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;