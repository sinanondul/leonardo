import React, { useState } from 'react';
import {
  Container, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField,
  Grid, IconButton, MenuItem
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

const VehiclesList = () => {
  // Dummy data for vehicles
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      vin: '1HGCM82633A123456',
      make: 'Toyota',
      model: 'Camry',
      weight: 1450.5,
      booking_id: 1
    },
    {
      id: 2,
      vin: '5YJSA1E20HF176188',
      make: 'Tesla',
      model: 'Model S',
      weight: 2100.75,
      booking_id: 1
    },
    {
      id: 3,
      vin: 'WBADT43483G093073',
      make: 'BMW',
      model: 'X5',
      weight: 2200.0,
      booking_id: 2
    },
    {
      id: 4,
      vin: 'JH4KA7650NC003125',
      make: 'Honda',
      model: 'Accord',
      weight: 1400.25,
      booking_id: null
    }
  ]);

  // Dummy booking data for dropdown
  const bookings = [
    { id: 1, booking_number: 'BK001' },
    { id: 2, booking_number: 'BK002' },
    { id: 3, booking_number: 'BK003' },
    { id: 4, booking_number: 'BK004' }
  ];

  // State for dialog
  const [open, setOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState({
    vin: '',
    make: '',
    model: '',
    weight: '',
    booking_id: null
  });
  const [isEditing, setIsEditing] = useState(false);

  // Open dialog for new vehicle
  const handleAddClick = () => {
    setCurrentVehicle({
      vin: '',
      make: '',
      model: '',
      weight: '',
      booking_id: null
    });
    setIsEditing(false);
    setOpen(true);
  };

  // Open dialog for editing
  const handleEditClick = (vehicle) => {
    setCurrentVehicle({...vehicle});
    setIsEditing(true);
    setOpen(true);
  };

  // Handle delete
  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentVehicle({
      ...currentVehicle,
      [name]: name === 'weight' ? parseFloat(value) || '' : value
    });
  };

  // Save vehicle
  const handleSave = () => {
    if (isEditing) {
      // Update existing vehicle
      setVehicles(vehicles.map(vehicle =>
        vehicle.id === currentVehicle.id ? currentVehicle : vehicle
      ));
    } else {
      // Add new vehicle
      const newVehicle = {
        ...currentVehicle,
        id: Math.max(...vehicles.map(v => v.id), 0) + 1
      };
      setVehicles([...vehicles, newVehicle]);
    }
    setOpen(false);
  };

  // Get booking number from booking ID
  const getBookingNumber = (bookingId) => {
    if (!bookingId) return 'Not assigned';
    const booking = bookings.find(b => b.id === bookingId);
    return booking ? booking.booking_number : 'Unknown';
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 3 }}>
        Vehicles
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={handleAddClick}
        sx={{ mb: 3 }}
      >
        Add New Vehicle
      </Button>

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
                <TableCell>{getBookingNumber(vehicle.booking_id)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(vehicle)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(vehicle.id)}>
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
                name="booking_id"
                label="Booking"
                value={currentVehicle.booking_id || ''}
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