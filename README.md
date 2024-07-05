# Node.js Project: Book Author Management System

## Project Description
This project is a Book Author Management System built with Node.js, using MongoDB as the database. It provides various features for managing books and authors, including authentication, user management, and more.

## Getting Started

### Prerequisites
Ensure you have the following installed on your machine:
- Node.js (v14 or higher recommended)
- npm (v6 or higher recommended)
- MongoDB

### Installation
1. Clone the repository:
   git clone https://github.com/HassanEssam0110/Book-Author-Management-API.git

2. Navigate to the project directory:
cd your-repo-name

3. Install the dependencies:
npm install

4. Environment Variables
Create a config.env file in the root directory of the project and add the following variables:

# PORT
PORT=3000

# ENVIRONMENT
NODE_ENV=development

# Database
DB_URI="your-database-URI"

# bcrypt
BCRYPT_SALT=10

# Token
JWT_SECRET_KEY="your-key"
JWT_EXPIRE_TIME=60d

# Mail service
MAIL_USER="your-gmail"
MAIL_PASS="your-app-password-gmail"
MAIL_FROM='"Books APP" <your-email>'

Running the Application
To start the application, you can use the following npm scripts:

Start the application:
npm start
This will run node index.js.

Start the application in development mode:
npm run start:dev
This will run nodemon index.js for automatic restarts on file changes.

Start the application in production mode:
npm run start:prod
This will run cross-env NODE_ENV=production node index.js.
