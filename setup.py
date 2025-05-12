from setuptools import setup, find_packages

setup(
    name="django-vehicle-logistics",
    version="0.1",
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        "Django>=3.2",
        "djangorestframework>=3.12.0",
        "django-import-export>=2.5.0",
        "xlwt>=1.3.0",
    ],
    author="Sinan Öndül",
    author_email="sinanondul@gmail.com",
    description="A Django app for managing vehicle logistics including bookings and vehicles",
    long_description="A reusable Django app for managing vehicle logistics including bookings and transport operations.",
    classifiers=[
        "Environment :: Web Environment",
        "Framework :: Django",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python",
    ],
)