import React, { useState } from 'react';
import {
  Container, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField,
  Grid, IconButton
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const BookingsList = () => {
  // Dummy data for bookings
  const [bookings, setBookings] = useState([
    {
      id: 1,
      booking_number: 'BK001',
      loading_port: 'Rotterdam',
      discharge_port: 'New York',
      ship_departure_date: new Date('2023-12-01T08:00:00'),
      ship_arrival_date: new Date('2023-12-15T14:00:00'),
      vehicles_count: 3
    },
    {
      id: 2,
      booking_number: 'BK002',
      loading_port: 'Singapore',
      discharge_port: 'Sydney',
      ship_departure_date: new Date('2023-12-05T10:00:00'),
      ship_arrival_date: new Date('2023-12-20T09:00:00'),
      vehicles_count: 5
    },
    {
      id: 3,
      booking_number: 'BK003',
      loading_port: 'Los Angeles',
      discharge_port: 'Tokyo',
      ship_departure_date: new Date('2023-12-10T09:00:00'),
      ship_arrival_date: new Date('2023-12-28T16:00:00'),
      vehicles_count: 7
    },
    {
      id: 4,
      booking_number: 'BK004',
      loading_port: 'Hamburg',
      discharge_port: 'Dubai',
      ship_departure_date: new Date('2023-12-15T07:30:00'),
      ship_arrival_date: new Date('2024-01-05T10:00:00'),
      vehicles_count: 2
    }
  ]);

  // State for dialog
  const [open, setOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState({
    booking_number: '',
    loading_port: '',
    discharge_port: '',
    ship_departure_date: new Date(),
    ship_arrival_date: new Date()
  });
  const [isEditing, setIsEditing] = useState(false);

  // Open dialog for new booking
  const handleAddClick = () => {
    setCurrentBooking({
      booking_number: '',
      loading_port: '',
      discharge_port: '',
      ship_departure_date: new Date(),
      ship_arrival_date: new Date(new Date().setDate(new Date().getDate() + 14))
    });
    setIsEditing(false);
    setOpen(true);
  };

  // Open dialog for editing
  const handleEditClick = (booking) => {
    setCurrentBooking({...booking});
    setIsEditing(true);
    setOpen(true);
  };

  // Handle delete
  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      setBookings(bookings.filter(booking => booking.id !== id));
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentBooking({
      ...currentBooking,
      [name]: value
    });
  };

  // Handle date changes
  const handleDateChange = (name, date) => {
    setCurrentBooking({
      ...currentBooking,
      [name]: date
    });
  };

  // Save booking
  const handleSave = () => {
    if (isEditing) {
      // Update existing booking
      setBookings(bookings.map(booking =>
        booking.id === currentBooking.id ? currentBooking : booking
      ));
    } else {
      // Add new booking
      const newBooking = {
        ...currentBooking,
        id: Math.max(...bookings.map(b => b.id), 0) + 1,
        vehicles_count: 0
      };
      setBookings([...bookings, newBooking]);
    }
    setOpen(false);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 3 }}>
        Bookings
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={handleAddClick}
        sx={{ mb: 3 }}
      >
        Add New Booking
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking Number</TableCell>
              <TableCell>Loading Port</TableCell>
              <TableCell>Discharge Port</TableCell>
              <TableCell>Departure Date</TableCell>
              <TableCell>Arrival Date</TableCell>
              <TableCell>Vehicles</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.booking_number}</TableCell>
                <TableCell>{booking.loading_port}</TableCell>
                <TableCell>{booking.discharge_port}</TableCell>
                <TableCell>{booking.ship_departure_date.toLocaleString()}</TableCell>
                <TableCell>{booking.ship_arrival_date.toLocaleString()}</TableCell>
                <TableCell>{booking.vehicles_count}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(booking)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(booking.id)}>
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
        <DialogTitle>{isEditing ? 'Edit Booking' : 'Add New Booking'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="booking_number"
                label="Booking Number"
                value={currentBooking.booking_number}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="loading_port"
                label="Loading Port"
                value={currentBooking.loading_port}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="discharge_port"
                label="Discharge Port"
                value={currentBooking.discharge_port}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Departure Date"
                  value={currentBooking.ship_departure_date}
                  onChange={(date) => handleDateChange('ship_departure_date', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Arrival Date"
                  value={currentBooking.ship_arrival_date}
                  onChange={(date) => handleDateChange('ship_arrival_date', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
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

export default BookingsList;