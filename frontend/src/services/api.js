import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const bookingAPI = {
  getBookings: () => api.get('/bookings/', { params: { limit: 100 } }), // Increase limit
  getBooking: (id) => api.get(`/bookings/${id}/`),
  createBooking: (data) => api.post('/bookings/', data),
  updateBooking: (id, data) => api.put(`/bookings/${id}/`, data),
  deleteBooking: (id) => api.delete(`/bookings/${id}/`),
  addVehicleToBooking: (bookingId, vehicleId) =>
    api.post(`/bookings/${bookingId}/add_vehicle/`, { vehicle_id: vehicleId }),
  deleteOldVehicles: () =>
    api.delete('/bookings/delete_old_vehicles/'),
  exportBookingsCSV: () =>
    api.get('/bookings/export_csv/', { responseType: 'blob' }),
  exportBookingsExcel: () =>
    api.get('/bookings/export_excel/', { responseType: 'blob' }),
};

export const vehicleAPI = {
  getVehicles: (params) => api.get('/vehicles/', { params: { ...params, limit: 100 } }), // Increase limit
  getVehicle: (id) => api.get(`/vehicles/${id}/`),
  createVehicle: (data) => api.post('/vehicles/', data),
  updateVehicle: (id, data) => api.put(`/vehicles/${id}/`, data),
  deleteVehicle: (id) => api.delete(`/vehicles/${id}/`),
  createCustomVehicle: (data) => api.post('/vehicles/create_vehicle/', data),
  createRandomVehicle: (bookingId) =>
    api.post('/vehicles/create_random_vehicle/', bookingId ? { booking: bookingId } : {}),
  addToBooking: (vehicleId, bookingId) =>
    api.post(`/vehicles/${vehicleId}/add_to_booking/`, { booking_id: bookingId }),
  exportVehiclesCSV: () =>
    api.get('/vehicles/export_csv/', { responseType: 'blob' }),
  exportVehiclesExcel: () =>
    api.get('/vehicles/export_excel/', { responseType: 'blob' }),
};

export default api;