import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Export API services for Bookings
export const bookingAPI = {
  getBookings: () => api.get('/bookings/'),
  getBooking: (id) => api.get(`/bookings/${id}/`),
  createBooking: (data) => api.post('/bookings/', data),
  updateBooking: (id, data) => api.put(`/bookings/${id}/`, data),
  deleteBooking: (id) => api.delete(`/bookings/${id}/`),
};

// Export API services for Vehicles
export const vehicleAPI = {
  getVehicles: () => api.get('/vehicles/'),
  getVehicle: (id) => api.get(`/vehicles/${id}/`),
  createVehicle: (data) => api.post('/vehicles/', data),
  updateVehicle: (id, data) => api.put(`/vehicles/${id}/`, data),
  deleteVehicle: (id) => api.delete(`/vehicles/${id}/`),
  createRandomVehicle: (bookingId) => api.post('/vehicles/create_random_vehicle/',
    bookingId ? { booking: bookingId } : {}),
  addToBooking: (vehicleId, bookingId) =>
    api.post(`/vehicles/${vehicleId}/add_to_booking/`, { booking_id: bookingId }),
};

export default api;