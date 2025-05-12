import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField,
  Grid, IconButton, CircularProgress, Alert
} from '@mui/material';
import { 
  Add, Edit, Delete, Download, DirectionsBoat, LocalShipping
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { bookingAPI, vehicleAPI } from '../../services/api';
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

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState({
    booking_number: '',
    loading_port: '',
    discharge_port: '',
    ship_departure_date: new Date(),
    ship_arrival_date: new Date(new Date().setDate(new Date().getDate() + 14))
  });
  const [isEditing, setIsEditing] = useState(false);

  // Details dialog states
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingVehicles, setBookingVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);

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
    setFormOpen(true);
  };

  const handleEditClick = (booking, event) => {
    event.stopPropagation();
    setCurrentBooking({
      ...booking,
      ship_departure_date: new Date(booking.ship_departure_date),
      ship_arrival_date: new Date(booking.ship_arrival_date)
    });
    setIsEditing(true);
    setFormOpen(true);
  };

  const handleDeleteClick = async (id, event) => {
    event.stopPropagation();
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

      setFormOpen(false);
      fetchBookings(); // Refresh the list
    } catch (err) {
      console.error('Error saving booking:', err);
      setError('Failed to save booking');
    }
  };

  const handleRowClick = async (booking) => {
    setSelectedBooking(booking);
    setDetailsOpen(true);

    try {
      setLoadingVehicles(true);
      // Fetch only vehicles for this booking
      const response = await vehicleAPI.getVehicles({ booking: booking.id });
      setBookingVehicles(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching booking vehicles:", error);
      setBookingVehicles([]);
    } finally {
      setLoadingVehicles(false);
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
      link.setAttribute('download', 'bookings.xlsx');
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
              <DirectionsBoat sx={{ mr: 2, color: 'primary.main' }} />
              Bookings Management
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
                  color="secondary"
                  startIcon={<Delete />}
                  onClick={handleDeleteOldVehicles}
                >
                  Delete Old Vehicles
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
                  <TableCell sx={{ color: 'white' }}>Booking Number</TableCell>
                  <TableCell sx={{ color: 'white' }}>Loading Port</TableCell>
                  <TableCell sx={{ color: 'white' }}>Discharge Port</TableCell>
                  <TableCell sx={{ color: 'white' }}>Departure Date</TableCell>
                  <TableCell sx={{ color: 'white' }}>Arrival Date</TableCell>
                  <TableCell sx={{ color: 'white' }}>Vehicles</TableCell>
                  <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <TableRow
                      key={booking.id}
                      onClick={() => handleRowClick(booking)}
                      hover
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: '#eaeaea' }
                      }}
                    >
                      <TableCell>{booking.booking_number}</TableCell>
                      <TableCell>{booking.loading_port}</TableCell>
                      <TableCell>{booking.discharge_port}</TableCell>
                      <TableCell>{new Date(booking.ship_departure_date).toLocaleString()}</TableCell>
                      <TableCell>{new Date(booking.ship_arrival_date).toLocaleString()}</TableCell>
                      <TableCell>{booking.vehicle_count || 0}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <IconButton onClick={(e) => handleEditClick(booking, e)} color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton onClick={(e) => handleDeleteClick(booking.id, e)} color="secondary">
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No bookings found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Add/Edit Form Dialog */}
          <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white', pb: 2 }}>
              {isEditing ? 'Edit Booking' : 'Add New Booking'}
            </DialogTitle>
            <DialogContent sx={{ pt: 4, pb: 3, mt: 2 }}>
              <Grid container spacing={4}>
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
              <Button onClick={() => setFormOpen(false)} color="primary">Cancel</Button>
              <Button onClick={handleSave} variant="contained" color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {/* Booking Details Dialog */}
          <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', pb: 2 }}>
              <DirectionsBoat sx={{ mr: 1 }} />
              Booking Details: {selectedBooking?.booking_number}
            </DialogTitle>
            <DialogContent sx={{ pt: 4, pb: 3, mt: 2 }}>
              {selectedBooking && (
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1">Loading Port</Typography>
                    <Typography variant="body1">{selectedBooking.loading_port}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1">Discharge Port</Typography>
                    <Typography variant="body1">{selectedBooking.discharge_port}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1">Departure Date</Typography>
                    <Typography variant="body1">
                      {new Date(selectedBooking.ship_departure_date).toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1">Arrival Date</Typography>
                    <Typography variant="body1">
                      {new Date(selectedBooking.ship_arrival_date).toLocaleString()}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      color="primary"
                      sx={{ display: 'flex', alignItems: 'center', mt: 2 }}
                    >
                      <LocalShipping sx={{ mr: 1, color: 'secondary.main' }} />
                      Vehicles Assigned ({bookingVehicles.length})
                    </Typography>
                    {loadingVehicles ? (
                      <div style={{ textAlign: 'center', padding: '20px' }}>
                        <CircularProgress size={30} color="primary" />
                      </div>
                    ) : bookingVehicles.length > 0 ? (
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead sx={{ backgroundColor: 'primary.main' }}>
                            <TableRow>
                              <TableCell sx={{ color: 'white' }}>VIN</TableCell>
                              <TableCell sx={{ color: 'white' }}>Make</TableCell>
                              <TableCell sx={{ color: 'white' }}>Model</TableCell>
                              <TableCell sx={{ color: 'white' }}>Weight</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {bookingVehicles.map((vehicle) => (
                              <TableRow key={vehicle.id}>
                                <TableCell>{vehicle.vin}</TableCell>
                                <TableCell>{vehicle.make}</TableCell>
                                <TableCell>{vehicle.model}</TableCell>
                                <TableCell>{vehicle.weight}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Typography>No vehicles assigned to this booking</Typography>
                    )}
                  </Grid>
                </Grid>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsOpen(false)} color="primary">Close</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default BookingsList;