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

1. **Prerequisites:**

   * [Docker](https://docs.docker.com/get-docker/) installed and running on your system.
   * [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop) installed.

2. **Configuration:**

   * Ensure your `docker-compose.yaml` file is correctly configured for your PostgreSQL service and application settings. You might need to adjust database credentials or port mappings if they differ from the defaults.

3. **Build and Run:**

   Navigate to the root directory of your project (where the `docker-compose.yaml` file is located) and run:

   ```bash
   docker compose up --build -d
   ```

   * `--build`: Builds (or rebuilds) the images before starting containers. This is crucial for the first run or after code changes.
   * `-d`: Runs the containers in detached mode (in the background).

4. **Access the Application:**

   * React Frontend: [http://localhost:5173](http://localhost:5173)
   * .NET Core Backend: [https://localhost:7045](https://localhost:7045)

5. **Stop Services:**

   To stop all running services and remove containers, networks, and volumes created by Docker Compose:

   ```bash
   docker compose down
   ```

### Option 2: Running Components Individually

If you prefer to run the Backend and Frontend separately (e.g., for specific development workflows), follow these steps:

#### 1. Database Setup

Install and configure a PostgreSQL database. Update the necessary database connection settings in the `appsettings.json` file or via environment variables.

#### 2. Run the Backend

Navigate to the root directory of the project (where the Backend folder is located) and run:

```bash
 dotnet run
```

This command will start the backend API, typically at [https://localhost:7045](https://localhost:7045) (or a similar port).

#### 3. Run the Frontend

Navigate to the `ConfigMaster.Client` directory, install dependencies, and start the application:

```bash
cd ConfigMaster.Client
npm install # or yarn install
npm run dev # or yarn dev
```

This command will start the React application, typically at [http://localhost:5173](http://localhost:5173) (or a similar port).

Open your browser and navigate to [http://localhost:5173](http://localhost:5173) to view the application.

## Contribution

There are plenty of opportunities to contribute to the ConfigMaster project. All contributions are welcome!

* If you encounter any bugs or issues, please feel free to open an **Issue**.
* If you'd like to propose a new feature or improve existing code, you can submit a **Pull Request**.
* Please review the `CONTRIBUTING.md` file (if it exists) before contributing.

## License

This project is licensed under the MIT License. For more information, see the `LICENSE` file.
