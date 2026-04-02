# ✈️ Airline Booking System — Microservices Architecture

A production-grade airline booking backend built with a microservices architecture, addressing real-world engineering challenges like **concurrency control**, **distributed transactions**, **idempotent payment flows**, and **inter-service communication**.

---

## 🏗️ Architecture Overview

The system is composed of independently deployable services, each owning its own database and responsibility:

```
                            ┌─────────────────────┐
                            │      Client /        │
                            │     Frontend App     │
                            └─────────┬───────────┘
                                      │
                                      ▼
                          ┌───────────────────────┐
                          │    API Gateway :3001   │
                          │  (Auth, Rate Limiting, │
                          │   Request Forwarding)  │
                          └───┬───────┬────────┬──┘
                              │       │        │
                 ┌────────────┘       │        └────────────┐
                 ▼                    ▼                     ▼
       ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
       │ Auth Service     │ │ Flight Service   │ │ Booking Service  │
       │     :3003        │ │     :3000        │ │     :3002        │
       │                  │ │                  │ │                  │
       │ • User Signup    │ │ • Flights CRUD   │ │ • Create Booking │
       │ • JWT Login      │ │ • Airports CRUD  │ │ • Cancel Booking │
       │ • Token Verify   │ │ • Cities CRUD    │ │ • List Bookings  │
       │ • Role-Based     │ │ • Airplanes CRUD │ │ • Seat Deduction │
       │   Access Control │ │ • Search/Filter  │ │ • Rollback Logic │
       │                  │ │ • Swagger Docs   │ │                  │
       └──────────────────┘ └──────────────────┘ └────────┬─────────┘
              │                      ▲                     │
              │                      │   HTTP (Axios)      │
           [Auth_DB]                 └─────────────────────┘
                                     │
                                  [Flights]            [Booking_DB]
```

Each service has its **own MySQL database** — no shared state.

---

## 🚀 Services

### 1. API Gateway (Port 3001)
Single entry point for all client requests. Handles cross-cutting concerns before forwarding to downstream services.

- **JWT Authentication** — validates `Authorization: Bearer <token>` on protected routes
- **Rate Limiting** — 200 requests per 15 minutes
- **Helmet & CORS** — security headers and cross-origin config
- **Request Forwarding** — proxies to Auth, Flight, and Booking services via Axios
- **User Context Injection** — decodes JWT and injects `userId` into booking requests

### 2. Auth Service (Port 3003)
Handles user identity, authentication, and access control.

- **JWT-based authentication** with 24-hour token expiry
- **bcrypt** password hashing (salt rounds: 10)
- **Role-based access control** — `user` and `admin` roles
- **Input validation** middleware on signup/login

### 3. Flight Service (Port 3000)
Manages everything related to flights, airports, cities, and airplane fleet.

- Full CRUD for flights, airports, cities, and airplanes
- **Complex search & filtering** — by route, price range, departure date
- **Sorting** — by price, departure time, arrival time (ASC/DESC)
- **Swagger API documentation** at `/api-docs`
- **Request ID tracing** — every request gets a UUID for debugging
- **Foreign key constraints** with cascade deletes (City → Airport → Flight)

### 4. Booking Service (Port 3002)
Core of the system — handles the full booking lifecycle with concurrency-safe seat reservation.

- **Pessimistic locking** (`SELECT ... FOR UPDATE`) to prevent race conditions
- **ACID-compliant transactions** across fetch → calculate → deduct operations
- **Automatic rollback** — if seat update fails, the booking is deleted
- **Inter-service HTTP calls** to Flight Service for seat availability and updates
- **Idempotency Keys** to safely handle duplicate payment requests

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MySQL (InnoDB Engine) |
| ORM | Sequelize |
| Migrations | Sequelize CLI |
| Authentication | JWT + bcrypt |
| Inter-service Comm | Axios (REST) |
| Logging | Winston |
| API Documentation | Swagger (OpenAPI) |
| Security | Helmet, CORS, Rate Limiting |

---

## 🔑 Key Engineering Concepts

### Concurrency Control — Pessimistic Locking
When multiple users attempt to book the same flight simultaneously, the Booking Service uses `SELECT ... FOR UPDATE` within a Sequelize transaction to lock the flight row until the operation completes — preventing race conditions and double bookings.

### ACID Transactions
Every booking operation is wrapped in a transaction ensuring:
- **Atomicity** — all steps succeed or none do
- **Consistency** — database constraints are never violated
- **Isolation** — concurrent bookings don't interfere
- **Durability** — committed bookings survive failures

### Idempotency Keys
Payment requests are tagged with a unique idempotency key. If the gateway retries the same request (due to network failure), the system detects the duplicate and returns the original response — preventing double charges.

### Temporary Booking with Timeout
When a user initiates payment, the seat is temporarily held. If payment is not confirmed within the timeout window, the seat is automatically released back to inventory.

### Winston Structured Logging
Each service logs structured JSON entries with severity levels, enabling easy debugging and tracing across distributed services.

---

## 📡 API Endpoints

All requests go through the **API Gateway** at `http://localhost:3001/api/v1`.

### Auth (Public)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/login` | Login and receive JWT token |
| GET | `/auth/verify` | Validate a JWT token |

### Flights (Public: GET | Authenticated: POST, PATCH, DELETE)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/flights` | Search flights with filters & sorting |
| POST | `/flights` | Create a new flight |
| GET | `/flights/:id` | Get flight by ID |
| PATCH | `/flights/:id` | Update flight details |
| DELETE | `/flights/:id` | Delete a flight |
| PATCH | `/flights/:id/seats` | Update remaining seats |

**Query Filters:** `?departureAirportId=DEL&arrivalAirportId=BOM&minPrice=2000&maxPrice=8000&departureTime=2026-04-15&sort=price&order=ASC`

### Cities (Public: GET | Authenticated: POST, PATCH, DELETE)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/cities` | Get all cities |
| POST | `/cities` | Create a city |
| GET | `/cities/:id` | Get city by ID |
| PATCH | `/cities/:id` | Update a city |
| DELETE | `/cities/:id` | Delete a city (cascades to airports) |

### Airports (Public: GET | Authenticated: POST, PATCH, DELETE)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/airports` | Get all airports (with city info) |
| POST | `/airports` | Create an airport |
| GET | `/airports/:id` | Get airport by ID |
| PATCH | `/airports/:id` | Update an airport |
| DELETE | `/airports/:id` | Delete an airport |

### Airplanes (Public: GET | Authenticated: POST, PATCH, DELETE)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/airplanes` | Get all airplanes |
| POST | `/airplanes` | Create an airplane |
| GET | `/airplanes/:id` | Get airplane by ID |
| PATCH | `/airplanes/:id` | Update an airplane |
| DELETE | `/airplanes/:id` | Delete an airplane |

### Bookings (All Authenticated)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/bookings` | Create a booking |
| GET | `/bookings` | List bookings (filter: `?userId=X`) |
| GET | `/bookings/:id` | Get booking details |
| PATCH | `/bookings/:id/cancel` | Cancel a booking |

---

## 📁 Project Structure

```
airline-booking-system/
├── api-gateway/
│   └── src/
│       ├── config/
│       ├── middlewares/         # JWT auth, rate limiting
│       └── routes/             # Request forwarding rules
│
├── auth-service/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/        # Validation, error handling
│       ├── migrations/
│       ├── models/             # User model
│       ├── repositories/
│       ├── routes/
│       ├── services/           # Auth logic, JWT, bcrypt
│       └── utils/
│
├── booking-service/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/        # Validation, error handling
│       ├── migrations/
│       ├── models/             # Booking model
│       ├── repositories/
│       ├── routes/
│       ├── services/           # Booking logic, seat mgmt
│       └── utils/
│
├── flight-service/
│   └── src/
│       ├── config/             # Swagger config
│       ├── controllers/
│       ├── middlewares/        # API key, request ID, validation
│       ├── migrations/
│       ├── models/             # Flight, Airport, City, Airplane
│       ├── repositories/
│       ├── routes/
│       ├── services/
│       └── utils/
│
└── .gitignore
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js v18+
- MySQL 8+

### 1. Clone the repository
```bash
git clone https://github.com/ankitsharma495/Airline-Booking-System---Microservice-Architecture.git
cd Airline-Booking-System---Microservice-Architecture
```

### 2. Setup each service
```bash
# For each service (flight-service, booking-service, auth-service, api-gateway)
cd <service-name>
npm install
```

### 3. Configure environment variables
Create a `.env` file in each service (refer to `flight-service/.env.example`):

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=your_db_name
JWT_SECRET=your_jwt_secret
FLIGHT_SERVICE_URL=http://localhost:3000
AUTH_SERVICE_URL=http://localhost:3003
BOOKING_SERVICE_URL=http://localhost:3002
```

### 4. Create databases
```sql
CREATE DATABASE Auth_DB;
CREATE DATABASE Booking_DB;
CREATE DATABASE Flights;
```

### 5. Run database migrations
```bash
# Inside each service directory
npx sequelize-cli db:migrate
```

### 6. Start all services
```bash
# Run each in a separate terminal
cd api-gateway && npm run dev
cd flight-service && npm run dev
cd booking-service && npm run dev
cd auth-service && npm run dev
```

---

## 🌍 Environment Variables

| Variable | Service | Description |
|---|---|---|
| `PORT` | All | Port number for the service |
| `DB_HOST` | Flight, Auth, Booking | MySQL host |
| `DB_USER` | Flight, Auth, Booking | MySQL username |
| `DB_PASSWORD` | Flight, Auth, Booking | MySQL password |
| `DB_NAME` | Flight, Auth, Booking | Database name |
| `JWT_SECRET` | Auth, Gateway | Secret for JWT signing/verification |
| `FLIGHT_SERVICE_URL` | Gateway, Booking | Flight service base URL |
| `AUTH_SERVICE_URL` | Gateway | Auth service base URL |
| `BOOKING_SERVICE_URL` | Gateway | Booking service base URL |
| `API_KEY` | Flight | Optional API key for extra security |

---

## 📌 What Makes This Production-Ready

- ✅ **Pessimistic locking** for concurrency safety
- ✅ **Full ACID transaction** support via InnoDB
- ✅ **Idempotent payment API** preventing double charges
- ✅ **Schema version control** via Sequelize migrations
- ✅ **Structured logging** with Winston
- ✅ **Input validation** middlewares with proper HTTP error codes
- ✅ **Rate limiting** on all services
- ✅ **Swagger API documentation** on Flight Service
- ✅ **Request ID tracing** for distributed debugging
- ✅ **Environment-based configuration** with no hardcoded secrets
- ✅ **Role-based access control** (user/admin)
- ✅ **Automatic rollback** on failed bookings
