import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Grid, Paper, Box } from '@mui/material';
import { DirectionsBoat, LocalShipping } from '@mui/icons-material';

const Home = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          UMTest - Vehicle Logistics Management
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
          Manage bookings and vehicles for logistics operations
        </Typography>

        <Paper sx={{ p: 3, my: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center' }}>
                <DirectionsBoat sx={{ fontSize: 60, color: 'primary.main' }} />
                <Typography variant="h6">Manage Bookings</Typography>
                <Button
                  variant="contained"
                  component={Link}
                  to="/bookings"
                  sx={{ mt: 2 }}
                >
                  Go to Bookings
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center' }}>
                <LocalShipping sx={{ fontSize: 60, color: 'primary.main' }} />
                <Typography variant="h6">Manage Vehicles</Typography>
                <Button
                  variant="contained"
                  component={Link}
                  to="/vehicles"
                  sx={{ mt: 2 }}
                >
                  Go to Vehicles
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Home;