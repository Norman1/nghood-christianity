# nghood-christianity


## Overview

**Live Application:** https://christianity.nghood.com  
**API Endpoint:** https://api.nghood.com

## Frontend
- The frontend lives entirely in the `/docs` folder.
- Only use plain HTML + CSS + JavaScript. Do not use any frameworks or libraries. Also do not use CSS libraries.
- Organize the app with Web Components.
- Serve the frontend via GitHub Pages.


## Backend
- The backend lives entirely in the `/backend` folder.
- Put images into `src/main/resources/static/xxx`. This ensures that they get served by Spring.
- Whenever redeploying, do so manually via the GitHub Actions button.
- When testing locally in the IDE, first spin up PostgreSQL. Do so via the `docker-compose up -d postgres` command.
For this have a local `.env` file with the following content:
  ```
  DB_USERNAME=dev
  DB_PASSWORD=dev
  POSTGRES_DB=quizdb_dev
  ```
- The `application.properties` file is checked in. The default values used there are for the local test environment and
the variables are for the production environment.

## Infrastructure
- Where possible or not too much hassle, use infrastructure as code. Put all infrastructure files into the `/infrastructure` folder.
