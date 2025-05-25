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

2. Install the required packages:
```bash
pip install django-vehicle-logistics
```

3. Add `vehicle_logistics` to your `INSTALLED_APPS` in `settings.py`:
```python
INSTALLED_APPS = [
    ...
    'vehicle_logistics',
]
```

4. Include the URLs in your project's `urls.py`:
```python
from django.urls import include, path

urlpatterns = [
    ...
    path('logistics/', include('vehicle_logistics.urls')),
]
```

5. Run migrations for database creation:
```bash
python manage.py migrate
```

6. Create a superuser:
```bash
python manage.py createsuperuser
```

7. Start the server:
```bash
python manage.py runserver
```

8. Access the admin panel at [http://localhost:8000/admin](http://localhost:8000/admin) to manage bookings and vehicles.

## Usage

- To create, read, update, or delete bookings and vehicles, use the Django admin panel or the provided REST API endpoints.
- To assign or disassociate vehicles from bookings, use the vehicle assignment functionality in the admin panel or the corresponding API endpoints.
- To delete vehicles with a booking ship arrival date older than 6 months, run the provided management command or use the corresponding API endpoint.
- To export data to CSV or Excel, use the export functionality in the admin panel or the corresponding API endpoints.
- For detailed API documentation, visit the Django Rest Framework browsable API at [http://localhost:8000/api/](http://localhost:8000/api/).

## Development

- To run tests, use the following command:
```bash
python manage.py test
```

- To run the development server with hot reloading, use the following command:
```bash
python manage.py runserver_plus --reload
```

## Troubleshooting

- If you encounter any issues, please check the following:
  - Ensure that all dependencies are installed.
  - Ensure that the database is properly configured and migrated.
  - Check the Docker container logs for any errors.
  - Consult the Django and Django Rest Framework documentation for any specific issues.

## Contributing

We welcome contributions to improve the UMTest Logistics Management System. To contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make the necessary changes and commit them with descriptive messages.
4. Push the changes to your forked repository.
5. Submit a pull request detailing your changes and the problem they solve.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Django: The web framework used for building the application.
- Django Rest Framework: The toolkit used for building the REST API.
- Docker: The platform used for containerizing the application.
- OpenAI: For providing the AI assistance in generating this documentation.

For any further questions or inquiries, please contact the project maintainer.

## Docker Setup and Configuration

The application is containerized using Docker and Docker Compose for easy deployment and development consistency. Our setup includes:

### Container Configuration

1. **PostgreSQL Container**
   - Uses PostgreSQL 13 Alpine for a lightweight database image
   - Data persisted through a Docker volume (postgres_data)
   - Exposed on port 5433 to prevent conflicts with local PostgreSQL installations
   - Includes health checks to ensure the database is ready before starting the application

2. **Django Web Container**
   - Python 3.12 with all dependencies pre-installed
   - Environment variables to configure Django settings
   - Automatic database migrations on startup
   - Collectstatic for serving static files

### Volume Management

The Docker setup uses several volume strategies:
- **Application Code**: Mounted as read-only to prevent container operations from modifying source code
- **Database Storage**: Persistent volume to maintain data between container restarts
- **Static and Media Files**: Separate volumes for proper serving of Django assets

### Database Configuration

The application automatically detects if it's running in Docker and uses the appropriate database:
- **In Docker**: Uses PostgreSQL with connection to the 'db' service
- **Local Development**: Uses SQLite for simplicity

### Environment Variables

Key configuration is managed through environment variables:
- `IN_DOCKER`: Flags whether the app is running in Docker
- `DEBUG`: Controls Django debug mode
- `SECRET_KEY`: Django secret key (customize for production)
- `DB_*`: Database connection parameters
  
### Running the Docker Setup

```bash
# Build the containers
sudo docker-compose build

# Start the services
sudo docker-compose up

# Create a superuser
sudo docker-compose exec web python [manage.py](http://_vscodecontentref_/1) createsuperuser

# Run migrations manually (if needed)
sudo docker-compose exec web python [manage.py](http://_vscodecontentref_/2) migrate
```