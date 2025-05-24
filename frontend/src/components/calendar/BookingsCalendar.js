// src/components/calendar/BookingsCalendar.js
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Divider, 
  List, 
  ListItem, 
  ListItemText,
  Chip,
  Button,
  Modal,
  Tooltip
} from '@mui/material';
import { 
  CalendarMonth, 
  DirectionsBoat, 
  LocalShipping,
  Flight,
  LocationOn
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { bookingAPI, vehicleAPI } from '../../services/api';
import { Link } from 'react-router-dom';

// Styled components
const CalendarContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
  height: 'calc(100vh - 150px)',
  '.fc-daygrid-day-events': {
    margin: 0,
    padding: '2px 0',
  },
  '.fc-event': {
    cursor: 'pointer',
    margin: '1px 0',
    borderRadius: '4px',
  },
  '.fc-daygrid-day': {
    padding: '2px !important',
    minHeight: '80px', // Minimum height for day cells
  },
  '.fc-daygrid-day-frame': {
    padding: '2px !important',
    height: '100%',
  },
  '.fc-daygrid-day-top': {
    padding: '2px 4px',
  },
  '.fc-event-departure': {
    backgroundColor: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
  },
  '.fc-event-arrival': {
    backgroundColor: theme.palette.success.main,
    borderColor: theme.palette.success.main,
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
  },
  // Make the calendar take better proportional space
  '.fc': {
    height: '100%',
    fontFamily: theme.typography.fontFamily
  }
}));

const BookingDetails = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: 'calc(100vh - 150px)',
  overflowY: 'auto',
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius
}));

const VehicleItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  transition: 'all 0.2s',
  '&:hover': {
    boxShadow: theme.shadows[3],
    transform: 'translateY(-2px)'
  }
}));

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

const ModalContent = styled(Paper)(({ theme }) => ({
  width: '80%',
  maxWidth: 800,
  maxHeight: '90vh',
  overflow: 'auto',
  padding: theme.spacing(4),
  outline: 'none'
}));

// Main component
const BookingsCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [dateBookings, setDateBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [bookingWithVehicles, setBookingWithVehicles] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  // When a date is selected, filter bookings for that date
  useEffect(() => {
    if (selectedDate && events.length > 0) {
      const bookingsForDate = events.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate.toDateString() === selectedDate.toDateString();
      });
      
      // Group by booking ID to avoid duplicates (departure and arrival)
      const uniqueBookings = [];
      const bookingIds = new Set();
      
      bookingsForDate.forEach(event => {
        if (!bookingIds.has(event.extendedProps.bookingId)) {
          bookingIds.add(event.extendedProps.bookingId);
          uniqueBookings.push(event);
        }
      });
      
      setDateBookings(uniqueBookings);
    } else {
      setDateBookings([]);
    }
  }, [selectedDate, events]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Adapt this API call based on your actual API structure
      const response = await bookingAPI.getAll();
      const bookings = response.data;
      
      const formattedEvents = [];
      bookings.forEach(booking => {
        // Add departure event
        if (booking.ship_departure_date) {
          formattedEvents.push({
            id: `dep-${booking.id}`,
            title: `${booking.booking_number} (Departure)`,
            start: booking.ship_departure_date,
            className: 'fc-event-departure',
            extendedProps: { 
              type: 'departure', 
              bookingId: booking.id,
              bookingNumber: booking.booking_number,
              loadingPort: booking.loading_port,
              dischargePort: booking.discharge_port
            }
          });
        }
        
        // Add arrival event
        if (booking.ship_arrival_date) {
          formattedEvents.push({
            id: `arr-${booking.id}`,
            title: `${booking.booking_number} (Arrival)`,
            start: booking.ship_arrival_date,
            className: 'fc-event-arrival',
            extendedProps: { 
              type: 'arrival', 
              bookingId: booking.id,
              bookingNumber: booking.booking_number,
              loadingPort: booking.loading_port,
              dischargePort: booking.discharge_port
            }
          });
        }
      });
      
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (info) => {
    setSelectedDate(info.date);
    setSelectedBooking(null);
  };

  const handleEventClick = (info) => {
    const bookingId = info.event.extendedProps.bookingId;
    fetchBookingDetails(bookingId);
  };

  const handleBookingSelect = (bookingId) => {
    fetchBookingDetails(bookingId);
  };

  const fetchBookingDetails = async (bookingId) => {
    try {
<<<<<<< HEAD
      // Adapt these API calls based on your actual API structure
      const response = await bookingAPI.getById(bookingId);
      const booking = response.data;
      
      // Get vehicles for this booking
      const vehiclesResponse = await vehicleAPI.getAll({ booking: bookingId });
=======
      // Get the booking details
      const response = await bookingAPI.getBooking(bookingId);
      const booking = response.data;
      
      // Get vehicles for this specific booking using the proper parameter
      const vehiclesResponse = await vehicleAPI.getVehicles({ booking: bookingId });
>>>>>>> origin/main
      const vehicles = vehiclesResponse.data;
      
      const bookingWithVehicles = {
        ...booking,
        vehicles: vehicles
      };
      
      setSelectedBooking(bookingWithVehicles);
      setBookingWithVehicles(bookingWithVehicles);
    } catch (error) {
      console.error('Error fetching booking details:', error);
    }
  };

  const openModal = (booking) => {
    setBookingWithVehicles(booking);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1500px', mx: 'auto' }}> {/* Added maxWidth and auto margins */}
      <Typography variant="h4" mb={3} display="flex" alignItems="center">
        <CalendarMonth sx={{ mr: 1 }} /> Bookings Calendar
      </Typography>

      <Grid container spacing={3} sx={{ justifyContent: 'center' }}> {/* Added centering */}
        {/* Calendar - 2/3 width */}
        <Grid item xs={12} md={8}>
          <CalendarContainer>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,listMonth'
              }}
              events={events}
              eventClick={handleEventClick}
              dateClick={handleDateClick}
              height="100%"
              eventDisplay="block"
              dayMaxEventRows={6} // Increase to show more events per day
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                meridiem: 'short'
              }}
              dayCellDidMount={(info) => {
                // You could add custom behavior when a day cell is mounted
                // This is where you could add custom event handling
              }}
              eventContent={(arg) => {
                // Enhanced event rendering with tooltip
                return (
                  <Tooltip 
                    title={`${arg.event.extendedProps.type === 'departure' ? 'Departure' : 'Arrival'} - ${arg.event.extendedProps.bookingNumber}
${arg.event.extendedProps.type === 'departure' ? 
  `From: ${arg.event.extendedProps.loadingPort}` : 
  `To: ${arg.event.extendedProps.dischargePort}`}`}
                    arrow
                    placement="top"
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '0 2px',
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                      }
                    }}>
                      <Chip 
                        size="small"
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem' }}>
                            {arg.event.extendedProps.type === 'departure' ? 
                              <DirectionsBoat fontSize="inherit" sx={{ mr: 0.5, fontSize: '0.7rem' }} /> : 
                              <Flight fontSize="inherit" sx={{ mr: 0.5, fontSize: '0.7rem' }} />
                            }
                            {arg.event.extendedProps.bookingNumber}
                          </Box>
                        }
                        sx={{ 
                          height: '20px', 
                          fontSize: '0.7rem', 
                          width: '100%',
                          backgroundColor: arg.event.extendedProps.type === 'departure' 
                            ? '#00204e' : '#0F9D58',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: arg.event.extendedProps.type === 'departure' 
                              ? '#001a3e' : '#0c8048',
                          }
                        }} 
                      />
                    </Box>
                  </Tooltip>
                );
              }}
              moreLinkContent={({ num }) => (
                <Box sx={{ 
                  p: 0.5, 
                  color: 'info.main', 
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.1)',
                  }
                }}>
                  +{num} more
                </Box>
              )}
            />
          </CalendarContainer>
        </Grid>

        {/* Sidebar - 1/3 width */}
        <Grid item xs={12} md={4}>
          <BookingDetails>
            {selectedDate ? (
              <>
                <Typography variant="h6" gutterBottom>
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                {dateBookings.length > 0 ? (
                  <>
                    <Typography variant="subtitle1" gutterBottom>
                      Bookings on this date:
                    </Typography>
                    
                    <List>
                      {dateBookings.map(event => (
                        <ListItem 
                          key={event.id}
                          button
                          onClick={() => handleBookingSelect(event.extendedProps.bookingId)}
                          selected={selectedBooking?.id === event.extendedProps.bookingId}
                          sx={{ 
                            mb: 1, 
                            borderLeft: `4px solid ${
                              event.extendedProps.type === 'departure' ? '#00204e' : '#0F9D58'
                            }`,
                            bgcolor: 'background.paper',
                            '&.Mui-selected': {
                              bgcolor: 'action.selected'
                            }
                          }}
                        >
                          <ListItemText
                            primary={
                              <Typography variant="subtitle2">
                                <Chip 
                                  size="small" 
                                  label={event.extendedProps.type === 'departure' ? 'Departure' : 'Arrival'} 
                                  color={event.extendedProps.type === 'departure' ? 'primary' : 'success'}
                                  sx={{ mr: 1 }}
                                />
                                {event.extendedProps.bookingNumber}
                              </Typography>
                            }
                            secondary={
                              <>
                                <Typography variant="body2" component="span">
                                  {event.extendedProps.type === 'departure' ? 
                                    `From: ${event.extendedProps.loadingPort}` : 
                                    `To: ${event.extendedProps.dischargePort}`}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    No bookings scheduled for this date.
                  </Typography>
                )}
              </>
            ) : selectedBooking ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" gutterBottom>
                    Booking: {selectedBooking.booking_number}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => openModal(selectedBooking)}
                  >
                    View Full Details
                  </Button>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Loading Port</Typography>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOn color="primary" fontSize="small" sx={{ mr: 0.5 }} />
                      {selectedBooking.loading_port}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Discharge Port</Typography>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOn color="secondary" fontSize="small" sx={{ mr: 0.5 }} />
                      {selectedBooking.discharge_port}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Departure</Typography>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                      <DirectionsBoat color="primary" fontSize="small" sx={{ mr: 0.5 }} />
                      {formatDate(selectedBooking.ship_departure_date)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Arrival</Typography>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Flight color="success" fontSize="small" sx={{ mr: 0.5 }} />
                      {formatDate(selectedBooking.ship_arrival_date)}
                    </Typography>
                  </Grid>
                </Grid>
                
                <Typography variant="subtitle1" gutterBottom>
                  Vehicles ({selectedBooking.vehicles?.length || 0})
                </Typography>
                
                {selectedBooking.vehicles?.length > 0 ? (
                  <Box sx={{ maxHeight: '300px', overflowY: 'auto', pr: 1 }}>
                    {selectedBooking.vehicles.slice(0, 3).map(vehicle => (
                      <VehicleItem key={vehicle.id} elevation={1}>
                        <Typography variant="subtitle2">{vehicle.vin}</Typography>
                        <Typography variant="body2">
                          {vehicle.make} {vehicle.model} - {vehicle.weight} kg
                        </Typography>
                      </VehicleItem>
                    ))}
                    {selectedBooking.vehicles.length > 3 && (
                      <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          onClick={() => openModal(selectedBooking)}
                        >
                          View All Vehicles
                        </Button>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No vehicles assigned to this booking.
                  </Typography>
                )}
                
                <Box sx={{ mt: 3 }}>
                  <Button 
                    variant="contained" 
                    fullWidth
                    component={Link} 
                    to={`/bookings/${selectedBooking.id}`}
                  >
                    Edit Booking
                  </Button>
                </Box>
              </>
            ) : (
              <Box 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'center', 
                  alignItems: 'center' 
                }}
              >
                <CalendarMonth sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" align="center">
                  Select a date or booking to view details
                </Typography>
              </Box>
            )}
          </BookingDetails>
        </Grid>
      </Grid>

      {/* Full Details Modal */}
      <StyledModal open={modalOpen} onClose={closeModal}>
        <ModalContent>
          {bookingWithVehicles && (
            <>
              <Typography variant="h5" gutterBottom>
                Booking Details: {bookingWithVehicles.booking_number}
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Card elevation={1}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Shipping Information</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Loading Port</Typography>
                          <Typography variant="body1">{bookingWithVehicles.loading_port}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Discharge Port</Typography>
                          <Typography variant="body1">{bookingWithVehicles.discharge_port}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Departure</Typography>
                          <Typography variant="body1">{formatDate(bookingWithVehicles.ship_departure_date)}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Arrival</Typography>
                          <Typography variant="body1">{formatDate(bookingWithVehicles.ship_arrival_date)}</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card elevation={1}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Booking Summary</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Vehicles
                      </Typography>
                      <Typography variant="h4" color="primary">
                        {bookingWithVehicles.vehicles?.length || 0}
                      </Typography>
                      
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Quick Actions
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Button 
                            variant="contained" 
                            component={Link} 
                            to={`/bookings/${bookingWithVehicles.id}`}
                            sx={{ mr: 1 }}
                          >
                            Edit Booking
                          </Button>
                          <Button 
                            variant="outlined"
                            onClick={closeModal}
                          >
                            Close
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              <Typography variant="h6" gutterBottom>
                Vehicles
              </Typography>
              
              {bookingWithVehicles.vehicles?.length > 0 ? (
                <Grid container spacing={2}>
                  {bookingWithVehicles.vehicles.map(vehicle => (
                    <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
                      <VehicleItem elevation={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle1">{vehicle.vin}</Typography>
                          <Button 
                            component={Link} 
                            to={`/vehicles/${vehicle.id}`} 
                            size="small"
                            variant="outlined"
                          >
                            View Details
                          </Button>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {vehicle.make} {vehicle.model}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Weight: {vehicle.weight} kg
                        </Typography>
                      </VehicleItem>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No vehicles found for this booking.
                </Typography>
              )}
            </>
          )}
        </ModalContent>
      </StyledModal>
    </Box>
  );
};

export default BookingsCalendar;