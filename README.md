Test 
====

A logistics company has asked us to manage the transport of used vehicles. For this you need to know

Booking
* Booking Number (unique)
* Loading port
* Discharge port
* Ship arrival date
* Ship departure date

Vehicle
* VIN (Vehicle Identification Number: unique)
* Make
* Model
* Weight

It is intended that an exercise be done to make a CRUD of Bookings that will transport those vehicles (with the possibility of associating / disassociating them).

Goals:
-----

* Create a django app that can make a CRUD of bookings and is able to associate / disassociate used vehicles. You can give all the assumptions you want.
* Make basic API REST with Django Rest Framework
* Make a Command to delete all vehicles with a booking ship arrival date older than 6 months. If you prefer you can make an endpoint instead of a Command.
* Include a SOLUTION.md file describing the app, decisions and technical considerations that you have taken as well as any type of improvements that could be applied.

Bonus:
------

* Make this app reusable
* Make export results to XLS / PDF or import XLS files
* Make tests (backend / frontend)
* Make the frontend attractive


Observations:
-------------

This test can take some hours to make it but, as we know that sometimes it is hard to find the time to do it, you'll have up to a week of time to make it. Even so, don't worry if you run out of time. In the technical meeting we can discuss it.

Quickstart:
-----------

You can clone this repo and work with it locally:

```bash
# Clone the repo
git clone https://github.com/vilamatica/ultramar-test.git

# Create a virtualenv
python3.12 -m venv ven
. ven/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations for database creation
python manage.py migrate

# Create a superuser
python manage.py createsuperuser

# Start the server
python manage.py runserver
```

Open the browser and go to [http://localhost:8000/](http://localhost:8000/)

# Django Vehicle Logistics

A reusable Django app for managing vehicle logistics including bookings and vehicles.

## Features

- Full CRUD operations for bookings and vehicles
- REST API using Django Rest Framework
- Vehicle assignment/disassociation functionality
- Command to delete old vehicles
- Export data to CSV and Excel

## Installation

1. Install the package:
```bash
pip install django-vehicle-logistics