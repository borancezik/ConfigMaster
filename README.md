# ConfigMaster: Centralized Application Configuration Management System

ConfigMaster is a centralized configuration management system designed to manage configurations across different environments (Test, Pre-Prod, Prod) and application types. It consists of a backend built with ASP.NET Core and a frontend built with React (Vite). PostgreSQL is used as the database.

## 🚀 Features

- **Application Management**: Add, edit, and delete applications.
- **Environment-Specific Configurations**: Manage configurations per environment (Test, Pre-Prod, Prod) for each application.
- **Easy Access**: Retrieve configurations for your applications via API.
- **Docker Support**: Quickly launch frontend and backend components using Docker Compose.

## 💠 Tech Stack

- **Backend**: ASP.NET Core 9.0
- **Frontend**: React (Vite)
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose

## ⚙️ Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- PostgreSQL (port 5432 open, database must be created)

---

## 📆 Setup and Run Steps

### 🔹 Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/ConfigMaster.git
cd ConfigMaster
```

> 📌 **Note:** Replace `YOUR_USERNAME` with your actual GitHub username.

---

### 🔹 Step 2: Prepare the Local PostgreSQL Database

1. Connect to your PostgreSQL server (via `psql`, `PgAdmin`, etc.)
2. Create the database and user:

```sql
CREATE DATABASE "ConfigMasterDb";
CREATE USER myuser WITH PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE "ConfigMasterDb" TO myuser;
```

> ⚠️ Replace `myuser` and `mypassword` with your own credentials.

3. Ensure your PostgreSQL server is listening on port `5432` and allows connections from `host.docker.internal`.

---

### 🔹 Step 3: Update `docker-compose.yml`

Example `docker-compose.yml`:

```yaml
version: '3.8'

services:
  configmaster_server:
    build:
      context: .
      dockerfile: ConfigMaster.Server/Dockerfile
    ports:
      - "8080:8080"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ASPNETCORE_URLS=http://+:8080
      - ConnectionStrings__DefaultConnection=Host=host.docker.internal;Port=5432;Database=ConfigMasterDb;Username=myuser;Password=mypassword
    networks:
      - configmaster_network

  configmaster_client:
    build:
      context: ./ConfigMaster.Client
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    depends_on:
      - configmaster_server
    networks:
      - configmaster_network

networks:
  configmaster_network:
    driver: bridge
```

> ⚠️ Make sure to update the `ConnectionStrings__DefaultConnection` with your actual PostgreSQL credentials.

---

### 🔹 Step 4: Automatic Application of Database Migrations

The backend project is configured to automatically apply any pending Entity Framework Core migrations each time the application starts. This ensures your database is always in sync with the required schema, with no manual intervention needed.

---

### 🔹 Step 5: Check Frontend API URL

Open `ConfigMaster.Client/src/App.js` and ensure the API URL is correctly set:

```js
const apiBase = 'http://localhost:8080/api';
```

---

### 🔹 Step 6: Start Docker Containers

```bash
docker compose down
docker compose up --build
```

You can follow the logs to confirm that the backend connects to the database and applies migrations.

---

### 🔹 Step 7: Access the Application

- **Frontend UI**: [http://localhost:3000](http://localhost:3000)
- **Backend Swagger UI**: [http://localhost:8080/swagger](http://localhost:8080/swagger)

---

## 📦 Using ConfigMaster.Nuget Package (For API Consumers)

### 1. Install the Package

```bash
dotnet add package ConfigMaster.Nuget
```

---

### 2. Register the Service in `Program.cs`

```csharp
builder.Services.CreateConfigMasterClient(
    builder.Configuration,
    builder.Environment
);
```

> This method reads `ConfigMaster:ServiceUrl`, `ApplicationId`, and `EnvironmentName` from `appsettings.json`.

---

### 3. Configure `appsettings.json`

```json
{
  "ConfigMaster": {
    "ServiceUrl": "http://localhost:8080",
    "ApplicationId": "YOUR_API_GUID"
  }
}
```

> 📌 `ApplicationId` is the GUID of the application you created via the ConfigMaster UI.

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch: `feature/your-feature`
3. Make your changes
4. Submit a Pull Request 🎉

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

