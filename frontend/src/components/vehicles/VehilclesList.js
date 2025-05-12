import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField,
  Grid, IconButton, MenuItem, CircularProgress, Alert
} from '@mui/material';
import {
  Add, Edit, Delete, Download, Link as LinkIcon, LocalShipping
} from '@mui/icons-material';
import { vehicleAPI, bookingAPI } from '../../services/api';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create a tricolor theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#00204e', // Dark blue
    },
    secondary: {
      main: '#e63946', // Red
    },
    background: {
      default: '#ffffff', // Changed to white
      paper: '#ffffff',   // White
    },
  },
});

const VehiclesList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState({
    vin: '',
    make: '',
    model: '',
    weight: '',
    booking: null
  });
  const [isEditing, setIsEditing] = useState(false);

  // Details dialog states
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Booking assignment dialog states
  const [bookingAssignDialogOpen, setBookingAssignDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [vehiclesResponse, bookingsResponse] = await Promise.all([
        vehicleAPI.getVehicles(),
        bookingAPI.getBookings()
      ]);
      setVehicles(vehiclesResponse.data.results || vehiclesResponse.data);
      setBookings(bookingsResponse.data.results || bookingsResponse.data);
      setError('');
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setCurrentVehicle({
      vin: '',
      make: '',
      model: '',
      weight: '',
      booking: null
    });
    setIsEditing(false);
    setFormOpen(true);
  };

  const handleEditClick = (vehicle, event) => {
    event.stopPropagation();
    setCurrentVehicle({...vehicle});
    setIsEditing(true);
    setFormOpen(true);
  };

  const handleDeleteClick = async (id, event) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await vehicleAPI.deleteVehicle(id);
        fetchData(); // Refresh the list
      } catch (err) {
        console.error('Error deleting vehicle:', err);
        setError('Failed to delete vehicle');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentVehicle({
      ...currentVehicle,
      [name]: name === 'weight' ? parseFloat(value) || '' : value
    });
  };

  const handleSave = async () => {
    try {
      const vehicleData = {
        ...currentVehicle,
        weight: parseFloat(currentVehicle.weight)
      };

      if (isEditing) {
        await vehicleAPI.updateVehicle(currentVehicle.id, vehicleData);
      } else {
        await vehicleAPI.createVehicle(vehicleData);
      }

      setFormOpen(false);
      fetchData(); // Refresh the list
    } catch (err) {
      console.error('Error saving vehicle:', err);
      setError('Failed to save vehicle');
    }
  };

  const handleCreateRandomVehicle = async () => {
    try {
      await vehicleAPI.createRandomVehicle();
      fetchData(); // Refresh the list
    } catch (err) {
      console.error('Error creating random vehicle:', err);
      setError('Failed to create random vehicle');
    }
  };

  const handleRowClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setDetailsOpen(true);
  };

  const handleAssignClick = (vehicle, event) => {
    event.stopPropagation();
    setSelectedVehicle(vehicle);
    setSelectedBookingId(vehicle.booking || '');
    setBookingAssignDialogOpen(true);
  };

  const handleAssignBooking = async () => {
    try {
      await vehicleAPI.addToBooking(
        selectedVehicle.id,
        selectedBookingId ? parseInt(selectedBookingId, 10) : 0
      );

      // Refresh data
      fetchData();
      setBookingAssignDialogOpen(false);
      alert('Vehicle assignment updated successfully');
    } catch (error) {
      console.error("Error assigning vehicle to booking:", error);
      setError('Error assigning vehicle to booking');
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await vehicleAPI.exportVehiclesCSV();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'vehicles.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error exporting vehicles:', err);
      setError('Failed to export vehicles');
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await vehicleAPI.exportVehiclesExcel();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'vehicles.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error exporting vehicles:', err);
      setError('Failed to export vehicles');
    }
  };

  const getBookingNumber = (bookingId) => {
    if (!bookingId) return 'Not assigned';
    const booking = bookings.find(b => b.id === bookingId);
    return booking ? booking.booking_number : 'Unknown';
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="lg" sx={{ mt: 3, textAlign: 'center' }}>
          <CircularProgress color="primary" />
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', paddingTop: '20px', paddingBottom: '40px' }}>
        <Container maxWidth="lg">
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}
            >
              <LocalShipping sx={{ mr: 2, color: 'secondary.main' }} />
              Vehicles Management
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Add />}
                  onClick={handleAddClick}
                  sx={{ mr: 1 }}
                >
                  Add New Vehicle
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleCreateRandomVehicle}
                >
                  Create Random Vehicle
                </Button>
              </div>
              <div>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Download />}
                  onClick={handleExportCSV}
                  sx={{ mr: 1 }}
                >
                  Export CSV
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Download />}
                  onClick={handleExportExcel}
                >
                  Export Excel
                </Button>
              </div>
            </div>
          </Paper>

          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead sx={{ backgroundColor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>VIN</TableCell>
                  <TableCell sx={{ color: 'white' }}>Make</TableCell>
                  <TableCell sx={{ color: 'white' }}>Model</TableCell>
                  <TableCell sx={{ color: 'white' }}>Weight (kg)</TableCell>
                  <TableCell sx={{ color: 'white' }}>Booking</TableCell>
                  <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vehicles.length > 0 ? (
                  vehicles.map((vehicle) => (
                    <TableRow
                      key={vehicle.id}
                      onClick={() => handleRowClick(vehicle)}
                      hover
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: '#eaeaea' }
                      }}
                    >
                      <TableCell>{vehicle.vin}</TableCell>
                      <TableCell>{vehicle.make}</TableCell>
                      <TableCell>{vehicle.model}</TableCell>
                      <TableCell>{vehicle.weight}</TableCell>
                      <TableCell>{getBookingNumber(vehicle.booking)}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <IconButton onClick={(e) => handleAssignClick(vehicle, e)} color="secondary">
                          <LinkIcon />
                        </IconButton>
                        <IconButton onClick={(e) => handleEditClick(vehicle, e)} color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton onClick={(e) => handleDeleteClick(vehicle.id, e)} color="secondary">
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No vehicles found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Add/Edit Form Dialog */}
          <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', pb: 2 }}>
              <LocalShipping sx={{ mr: 1, color: 'white' }} />
              {isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}
            </DialogTitle>
            <DialogContent sx={{ pt: 4, pb: 3, mt: 2 }}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <TextField
                    name="vin"
                    label="VIN"
                    value={currentVehicle.vin}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    disabled={isEditing} // VIN cannot be changed in edit mode
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="make"
                    label="Make"
                    value={currentVehicle.make}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="model"
                    label="Model"
                    value={currentVehicle.model}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="weight"
                    label="Weight (kg)"
                    type="number"
                    value={currentVehicle.weight}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    name="booking"
                    label="Booking"
                    value={currentVehicle.booking || ''}
                    onChange={handleInputChange}
                    fullWidth
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {bookings.map((booking) => (
                      <MenuItem key={booking.id} value={booking.id}>
                        {booking.booking_number} - {booking.loading_port} to {booking.discharge_port}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setFormOpen(false)} color="primary">Cancel</Button>
              <Button onClick={handleSave} variant="contained" color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {/* Vehicle Details Dialog */}
          <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md">
            <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', pb: 2 }}>
              <LocalShipping sx={{ mr: 1, color: 'white' }} />
              Vehicle Details
            </DialogTitle>
            <DialogContent sx={{ pt: 4, pb: 3, mt: 2 }}>
              {selectedVehicle && (
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1">VIN</Typography>
                    <Typography variant="body1">{selectedVehicle.vin}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1">Make</Typography>
                    <Typography variant="body1">{selectedVehicle.make}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1">Model</Typography>
                    <Typography variant="body1">{selectedVehicle.model}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1">Weight</Typography>
                    <Typography variant="body1">{selectedVehicle.weight} kg</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Booking</Typography>
                    <Typography variant="body1">
                      {selectedVehicle.booking ?
                        getBookingNumber(selectedVehicle.booking) :
                        'Not assigned to any booking'}
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsOpen(false)} color="primary">Close</Button>
              <Button
                onClick={() => {
                  setDetailsOpen(false);
                  setSelectedBookingId(selectedVehicle.booking || '');
                  setBookingAssignDialogOpen(true);
                }}
                color="primary"
                variant="contained"
                startIcon={<LinkIcon />}
              >
                Assign to Booking
              </Button>
            </DialogActions>
          </Dialog>

          {/* Booking Assignment Dialog */}
          <Dialog open={bookingAssignDialogOpen} onClose={() => setBookingAssignDialogOpen(false)}>
            <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', pb: 2 }}>
              <LinkIcon sx={{ mr: 1, color: 'white' }} />
              Assign Vehicle to Booking
            </DialogTitle>
            <DialogContent sx={{ pt: 4, pb: 3, mt: 2 }}>
              {selectedVehicle && (
                <div>
                  <Typography variant="subtitle1" gutterBottom>
                    VIN: {selectedVehicle.vin}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    {selectedVehicle.make} {selectedVehicle.model}
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    label="Select Booking"
                    value={selectedBookingId}
                    onChange={(e) => setSelectedBookingId(e.target.value)}
                    margin="normal"
                  >
                    <MenuItem value="">
                      <em>None (Remove from booking)</em>
                    </MenuItem>
                    {bookings.map((booking) => (
                      <MenuItem key={booking.id} value={booking.id}>
                        {booking.booking_number} - {booking.loading_port} to {booking.discharge_port}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setBookingAssignDialogOpen(false)} color="primary">Cancel</Button>
              <Button onClick={handleAssignBooking} color="primary" variant="contained">
                Assign
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default VehiclesList;