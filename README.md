# 6thtouch server

This repo contains the code for the 6thtouch learning platform server.

6thtouch is an online learning platform where you can get educated at simple cost.

# Project information

## Installed dependencies

- bcrypt
- cors
- dotenv
- express
- jsonwebtoken
- multer
- path
- pg
- pg-hstore
- otpauth
- nodemailer
- sequelize
- nodemon

## Database

This project works on the PostgreSQL database.
To connect to the PostgreSQL database on you local machine

Check out: [util.js](/util/util.js)

Use the .env file to configure your environment variables for you local machine

For information on the database structure

Check out: [The database models](/models/)

## dotenv configuration format

```env
JWT_SECRET = ***

DB_NAME = ***
DB_HOST = ***
DB_PASSWORD = ***
DB_PORT = ***
DB_USERNAME = ***

SERVER_PORT = ***
NODE_ENV = production || development


EMAIL_HOST = ***
EMAIL_PORT = ***
EMAIL_USER = ***
EMAIL_PASS = ***
OTP_EXPIRY_MINUTES = ***

```
