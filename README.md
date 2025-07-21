# ConfigMaster

ConfigMaster is a robust configuration management application developed using .NET Core 8.0 and React. This application provides an intuitive interface to easily manage and store settings for your services and applications from a centralized location. While currently in the development phase, it is built upon a solid foundation with modern architectural approaches.

## Features (Under Development)

* **Centralized Configuration Management:** Manage all your application configurations from a single point.
* **Environment-Specific Settings:** Ability to manage separate configurations for different environments such as Test, Pre-Production, and Production.
* **Responsive & Modern User Interface:** A user-friendly and interactive frontend experience developed with React.
* **Live Configuration Updates (Planned):** Instantaneous distribution of configuration changes via SignalR integration.

## Technologies

The ConfigMaster project leverages various current technologies and architectural patterns to ensure a modern and scalable structure:

### Backend

* **.NET Core 8.0:** A powerful, high-performance, and cross-platform compatible backend framework.
* **Vertical Slice Architecture:** Improves development speed and maintainability by organizing the codebase into vertical slices.
* **Minimal API:** A modern approach to creating lightweight and performant API endpoints.
* **SignalR:** Used for real-time bidirectional communication (planned for live configuration updates).
* **PostgreSQL:** A reliable and flexible relational database.
* **Specification Design Pattern:** To encapsulate query logic in a reusable and testable manner.
* **Repository Design Pattern:** To separate the data access layer, enhancing flexibility and testability.
* **In-Memory and Distributed Caching:** Caching mechanisms to improve performance and reduce database load.

### Frontend

* **React:** A popular JavaScript library for building dynamic and interactive user interfaces.
* **MUI (Material-UI):** A comprehensive UI library for fast and beautiful React component development.
* **Vite:** A next-generation frontend tooling that provides a blazing-fast development experience.

## Getting Started

To run the project in your local development environment, you have two primary options: **using Docker Compose** for a quick setup, or **running components individually**.

### Option 1: Using Docker Compose (Recommended for Quick Setup)

This is the fastest way to get all services (Backend, Frontend, and PostgreSQL) up and running.

1.  **Prerequisites:**
    * [Docker](https://docs.docker.com/get-docker/) installed and running on your system.
    * [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop) installed.

2.  **Configuration:**
    * Ensure your `docker-compose.yaml` file is correctly configured for your PostgreSQL service and application settings. You might need to adjust database credentials or port mappings if they differ from the defaults.

3.  **Build and Run:**
    * Navigate to the root directory of your project (where the `docker-compose.yaml` file is located).
    * Execute the following command to build the images and start all services:

        ```bash
        docker compose up --build -d
        ```
        * `--build`: Builds (or rebuilds) the images before starting containers. This is crucial for the first run or after code changes.
        * `-d`: Runs the containers in detached mode (in the background).

4.  **Access the Application:**
    * Once the containers are up and running, you can access the React frontend typically at `http://localhost:5173` (or the port you've configured in your `docker-compose.yaml` for the frontend service).
    * The .NET Core Backend will typically be exposed on `https://localhost:7045` (or the port configured for the backend service).

5.  **Stop Services:**
    * To stop all running services and remove containers, networks, and volumes created by `docker compose up`:

        ```bash
        docker compose down
        ```

### Option 2: Running Components Individually

If you prefer to run the Backend and Frontend separately (e.g., for specific development workflows), follow these steps:

#### 1. Database Setup

Install and configure a PostgreSQL database. Update the necessary database connection settings in the `appsettings.json` file or via environment variables.

#### 2. Run the Backend

Navigate to the root directory of the project (where the Backend folder is located) and run the following command:

```bash
dotnet run
