import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField,
  Grid, IconButton, CircularProgress, Alert
} from '@mui/material';
import { Add, Edit, Delete, Download } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { bookingAPI } from '../../services/api';

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState({
    booking_number: '',
    loading_port: '',
    discharge_port: '',
    ship_departure_date: new Date(),
    ship_arrival_date: new Date()
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getBookings();
      setBookings(response.data.results || response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

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

  const handleEditClick = (booking) => {
    setCurrentBooking({
      ...booking,
      ship_departure_date: new Date(booking.ship_departure_date),
      ship_arrival_date: new Date(booking.ship_arrival_date)
    });
    setIsEditing(true);
    setOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await bookingAPI.deleteBooking(id);
        fetchBookings(); // Refresh the list
      } catch (err) {
        console.error('Error deleting booking:', err);
        setError('Failed to delete booking');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentBooking({
      ...currentBooking,
      [name]: value
    });
  };

  const handleDateChange = (name, date) => {
    setCurrentBooking({
      ...currentBooking,
      [name]: date
    });
  };

  const handleSave = async () => {
    try {
      const bookingData = {
        ...currentBooking,
        ship_departure_date: currentBooking.ship_departure_date.toISOString(),
        ship_arrival_date: currentBooking.ship_arrival_date.toISOString()
      };

      if (isEditing) {
        await bookingAPI.updateBooking(currentBooking.id, bookingData);
      } else {
        await bookingAPI.createBooking(bookingData);
      }

      setOpen(false);
      fetchBookings(); // Refresh the list
    } catch (err) {
      console.error('Error saving booking:', err);
      setError('Failed to save booking');
    }
  };

  const handleDeleteOldVehicles = async () => {
    if (window.confirm('Are you sure you want to delete all vehicles with bookings older than 6 months?')) {
      try {
        await bookingAPI.deleteOldVehicles();
        alert('Old vehicles deleted successfully');
        fetchBookings(); // Refresh to update vehicle counts
      } catch (err) {
        console.error('Error deleting old vehicles:', err);
        setError('Failed to delete old vehicles');
      }
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await bookingAPI.exportBookingsCSV();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'bookings.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error exporting bookings:', err);
      setError('Failed to export bookings');
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await bookingAPI.exportBookingsExcel();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'bookings.xls');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error exporting bookings:', err);
      setError('Failed to export bookings');
    }
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
        Bookings
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
            sx={{ mr: 2 }}
          >
            Add New Booking
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={handleDeleteOldVehicles}
          >
            Delete Old Vehicles
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
                <TableCell>{new Date(booking.ship_departure_date).toLocaleString()}</TableCell>
                <TableCell>{new Date(booking.ship_arrival_date).toLocaleString()}</TableCell>
                <TableCell>{booking.vehicle_count || 0}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(booking)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(booking.id)} color="error">
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