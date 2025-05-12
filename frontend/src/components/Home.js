import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Grid, Paper, Box, Card, CardContent, CardActions } from '@mui/material';
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

const Home = () => {
  return (
    <ThemeProvider theme={theme}>
      <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', paddingTop: '20px', paddingBottom: '40px' }}>
        <Container maxWidth="md">
          <Box sx={{ my: 4 }}>
            <Typography
              variant="h3"
              component="h1"
              align="center"
              gutterBottom
              sx={{
                color: 'primary.main',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <DirectionsBoat sx={{ mr: 2, fontSize: 40 }} />
              UMTest
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              paragraph
              sx={{ mb: 5 }}
            >
              Vehicle Logistics Management System
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 4, justifyContent: 'center' }}>
              {/* Bookings Card */}
              <Card
                elevation={3}
                sx={{
                  flex: 1,
                  maxWidth: { xs: '100%', sm: '400px' },
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 4, pb: 2 }}>
                  <DirectionsBoat
                    sx={{
                      fontSize: 80,
                      color: 'primary.main',
                      mb: 2
                    }}
                  />
                  <Typography variant="h5" component="h2" gutterBottom>
                    Manage Bookings
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ height: '80px', overflow: 'hidden' }}>
                    Create and manage shipping bookings, track departures and arrivals,
                    and organize vehicle assignments.
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    component={Link}
                    to="/bookings"
                    sx={{
                      px: 4,
                      backgroundColor: 'primary.main',
                      '&:hover': {
                        backgroundColor: '#001c44',
                      }
                    }}
                  >
                    Go to Bookings
                  </Button>
                </CardActions>
              </Card>

              {/* Vehicles Card */}
              <Card
                elevation={3}
                sx={{
                  flex: 1,
                  maxWidth: { xs: '100%', sm: '400px' },
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 4, pb: 2 }}>
                  <LocalShipping
                    sx={{
                      fontSize: 80,
                      color: 'secondary.main',
                      mb: 2
                    }}
                  />
                  <Typography variant="h5" component="h2" gutterBottom>
                    Manage Vehicles
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ height: '80px', overflow: 'hidden' }}>
                    Catalog and track vehicles, assign them to bookings,
                    and maintain inventory of your vehicle fleet.
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    component={Link}
                    to="/vehicles"
                    color="secondary"
                    sx={{
                      px: 4,
                      '&:hover': {
                        backgroundColor: '#d32f2f',
                      }
                    }}
                  >
                    Go to Vehicles
                  </Button>
                </CardActions>
              </Card>
            </Box>

            <Box sx={{ mt: 8, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} UMTest - Vehicle Logistics Management System
              </Typography>
            </Box>
          </Box>
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default Home;