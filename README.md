Test 
====

A logistics company has asked us to manage the transport of used vehicles. For this you need to know

Booking
* loading port
* discharge port
* Ship arrival date
* Boat departure date

Vehicle
* Registration
* Model
* Weight

It is intended that an exercise be done to make a CRUD of Bookings that will transport those vehicles (with the possibility of associating / disassociating them).

Goals:
-----

* Create a django (version> = 2) app that can make a CRUD of bookings and is able to associate / disassociate used vehicles. You can give all the assumptions you want.
* Include a README.md file describing the app, decisions and technical considerations that you have taken as well as any type of improvements that could be applied.

Bonus:
------

* Make this app reusable
* Make tests (backend / frontend)
* Make export results to XLS / PDF or import XLS files
* Make the frontend attractive
* Make API REST with Django Rest Framework
* Make a little application with Vue / React


Observations:
-------------

This test can take a couple of hours to do, but we know that sometimes it is hard to find the time to do it, so you have up to a week of time to make it. Even so, don't worry if you run out of time. In the technical meeting you can argue it in oral way.

Quickstart:
-----------

You can clone this repo and work with it locally:

```bash
# Clone the repo
git clone https://github.com/vilamatica/ultramar-test.git

# Create a virtualenv
python3 -m venv venv
. venv/bin/activate

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