# UMTest - Logistics Management System

A comprehensive logistics management system for tracking shipments, bookings, and vehicles. This application provides a robust platform for managing logistics operations with a clean web interface and powerful REST API.

## Features

- **Comprehensive Management**
  - Full CRUD operations for bookings and vehicles
  - Shipment tracking with status updates
  - Advanced search and filtering capabilities
  - User role-based permissions

- **REST API Integration**
  - Complete API built with Django Rest Framework
  - Interactive API documentation with Swagger/OpenAPI (drf-yasg)
  - Secure authentication and authorization
  - Filterable and paginated endpoints

- **Vehicle Functionality**
  - Vehicle assignment/disassociation to bookings
  - Vehicle maintenance tracking
  - Automated command to delete old vehicles from system
  - Vehicle status monitoring

- **Data Management**
  - Export data to CSV and Excel formats
  - Import data from various formats
  - Data validation and cleaning
  - Regular database maintenance

- **User Interface**
  - Responsive design for mobile and desktop
  - Interactive dashboards
  - Real-time notifications
  - Role-based views

## Technical Requirements

- Python 3.12+
- Django 5.2.x
- PostgreSQL 13+

## Local Development Setup

### Prerequisites
- Python 3.12+
- PostgreSQL (for production-like environment) or SQLite (for simple development)

### Setting Up the Development Environment

1. Create and activate a virtual environment:
```bash
python -m venv ven
source ven/bin/activate
```
