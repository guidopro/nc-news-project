# Northcoders News API

In order to get this repo set up locally. Please create two enviroment variables called:

.env.development
.env.test

Into each, add PGDATABASE=, with the correct database name for that environment (see /db/setup.sql for the database names). Double check that these .env files are .gitignored

In the package.JSON there are some scripts that can be run that you may find useful.

** If you would like to visit the hosted version of this repo you can do so here: https://guys-app.onrender.com/api **

This project simulates a production-grade backend service designed to interact seamlessly with front-end architectures, similar to those found in social media platforms and forum-style websites.

Leveraging a modular environment setup, the service supports three distinct configurations: test, development, and production. The backend is powered by a PostgreSQL database, with comprehensive API endpoint testing ensuring robustness and reliability across all stages of deployment.

Key Features:

Multi-environment configuration (test, development, production)
PostgreSQL database integration
Complete API endpoint testing for end-to-end validation
This project demonstrates proficiency in backend development, database management, and building scalable, production-ready web services.

Node v22.13.0 & PostgreSQL 16.6 are the minimum versions recommended to run this project.
