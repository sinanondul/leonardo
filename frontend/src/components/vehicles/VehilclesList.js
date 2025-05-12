import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField,
  Grid, IconButton, MenuItem, CircularProgress, Alert
} from '@mui/material';
import { Add, Edit, Delete, Download } from '@mui/icons-material';
import { vehicleAPI, bookingAPI } from '../../services/api';

const VehiclesList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState({
    vin: '',
    make: '',
    model: '',
    weight: '',
    booking: null
  });
  const [isEditing, setIsEditing] = useState(false);

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
    setOpen(true);
  };

  const handleEditClick = (vehicle) => {
    setCurrentVehicle({...vehicle});
    setIsEditing(true);
    setOpen(true);
  };

  const handleDeleteClick = async (id) => {
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
        await vehicleAPI.createCustomVehicle(vehicleData);
      }

      setOpen(false);
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
      link.setAttribute('download', 'vehicles.xls');
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
      <Container maxWidth="lg" sx={{ mt: 3, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 3 }}>
        Vehicles
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
            startIcon={<Download />}
            onClick={handleExportCSV}
            sx={{ mr: 1 }}
          >
            Export CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportExcel}
          >
            Export Excel
          </Button>
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>VIN</TableCell>
              <TableCell>Make</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Weight (kg)</TableCell>
              <TableCell>Booking</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>{vehicle.vin}</TableCell>
                <TableCell>{vehicle.make}</TableCell>
                <TableCell>{vehicle.model}</TableCell>
                <TableCell>{vehicle.weight}</TableCell>
                <TableCell>{getBookingNumber(vehicle.booking)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(vehicle)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(vehicle.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
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
                    {booking.booking_number}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VehiclesList;