# CodeQuests Project

This project contains the source code for the CodeQuests application, which is a platform that helps businesses publish projects (called Quests) and ask a community of developers and designers to compete to build the best, highest quality implementation or design.

## Overview

This project is divided into two main components: the frontend and the backend.

### Frontend

The frontend is responsible for providing the user interface for the CodeQuests application. It is built using Next.js and Tailwind CSS.

### Backend

The backend is responsible for providing the API endpoints and handling business logic for the CodeQuests application. It is built using Feathers.js and TypeScript.

## Prerequisites

Before running the project, make sure you have the following installed:

- Node.js (version 21.6.1)
- Docker
- Docker Compose

## Installation

To install and run the project locally, follow these steps:

1. Clone the repository:

```
git clone https://github.com/Ahmedfathyy/codequests.git

```

1. Navigate to the project directory:
```
cd codequests
```
1. Install dependencies for the frontend and backend: 

```
cd quests/code-quests-web
npm install

cd ../code-quests-backend
npm install

```
## Usage
To start the project, you can use Docker Compose to run both the frontend and backend services together.
```
docker-compose up
```
This command will build and start the containers for the frontend, backend, PostgreSQL, and MailHog services.

# Dockerfiles
## Frontend Dockerfile
The frontend Dockerfile is responsible for building the frontend application using Next.js and serving it using Nginx.

## Backend Dockerfile
The backend Dockerfile is responsible for building the backend application using Feathers.js and TypeScript.

## Docker Compose
The `docker-compose.yml` file defines the services required to run the CodeQuests application. It includes services for the frontend, backend, PostgreSQL database, and MailHog SMTP server.

# GitHub Actions
## Frontend CI/CD Workflow
The `frontend.yml` GitHub Actions workflow is triggered on push to the main branch. It checks out the repository, installs dependencies, lints and tests the frontend code, builds the frontend application, and uploads the built artifacts to an FTP server.

## Backend CI/CD Workflow
The `backend.yml` GitHub Actions workflow is triggered on push to the main branch. It checks out the repository, installs dependencies, builds the backend application, and uploads the built artifacts to an FTP server..


