# Cemetery Management Backend

This is the backend for the Cemetery Management System built with Node.js and Express. The system allows managing graves, tracking burials, and updating the status of graves.

## Features

- Manage graves and buried persons
- Track the availability of graves based on burial dates
- Automatically mark graves as available after a 6-month period
- User authentication (if applicable)
- RESTful API for interacting with the system

## Technologies Used

- **Node.js** - JavaScript runtime for building the backend
- **Express.js** - Web framework for creating the RESTful APIs
- **MongoDB** - NoSQL database to store grave and burial data
- **Mongoose** - ODM to interact with MongoDB
- **JWT** - JSON Web Token for authentication (if needed)
- **Cron** - Scheduled tasks to update grave statuses

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cemetery-management-backend.git
   cd cemetery-management-backend
