# ✈️ Airline Booking System — Microservices Architecture

A production-grade airline booking backend built with a microservices architecture, addressing real-world engineering challenges like **concurrency control**, **distributed transactions**, **idempotent payment flows**, and **inter-service communication**.

---

## 🏗️ Architecture Overview

The system is composed of independently deployable services, each owning its own database and responsibility:

```
┌──────────────┐     HTTP (Axios)     ┌──────────────────┐
│  API Gateway │ ──────────────────► │  Flight Service   │
└──────────────┘                      │  (Flights, Seats, │
       │                              │   Airports,Cities)│
       │ HTTP (Axios)                 └──────────────────┘
       ▼                                       ▲
┌──────────────────┐   Fetches flight data     │
│  Booking Service │ ─────────────────────────┘
│  (Bookings,      │
│   Payments,      │
│   Idempotency)   │
└──────────────────┘
       │
┌──────────────────┐
│   Auth Service   │
│  (JWT, Users,    │
│   Permissions)   │
└──────────────────┘
```

---

## 🚀 Services

### 1. Flight Service
Manages everything related to flights, airports, cities, and seat inventory.

- CRUD for flights, airports, and cities
- Complex filtering and sorting by price, departure time, and route
- Foreign key constraints linking airports → cities with cascade deletes
- Seat inventory updates triggered by Booking Service

### 2. Booking Service
The core of the system — handles the full booking lifecycle including concurrency-safe seat reservation and payment flow.

- Pessimistic locking (`SELECT ... FOR UPDATE`) to prevent race conditions
- ACID-compliant transactions across fetch → calculate → deduct operations
- Temporary booking with timeout mechanism — auto-releases seat if payment fails
- Idempotency Keys to safely handle duplicate payment gateway requests
- Inter-service HTTP communications via Axios

### 3. Auth Service
Handles user identity, authentication, and access control.

- JWT-based authentication
- Role-based access control (RBAC)
- Secure environment-based configuration

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express.js |
| Database | MySQL (InnoDB Engine) |
| ORM | Sequelize |
| Migrations | Sequelize CLI |
| Inter-service | Axios (REST) |
| Logging | Winston |
| Containerization | Docker |

---

## 🔑 Key Engineering Concepts

### Concurrency Control — Pessimistic Locking
When multiple users attempt to book the same seat simultaneously, the system uses `SELECT ... FOR UPDATE` raw SQL within a Sequelize transaction to lock the row until the operation completes — preventing race conditions and double bookings.

```js
const flight = await Flight.findOne({
  where: { id: flightId },
  lock: transaction.LOCK.UPDATE,
  transaction
});
```

### ACID Transactions
Every booking operation is wrapped in a transaction ensuring:
- **Atomicity** — all steps succeed or none do
- **Consistency** — database constraints are never violated
- **Isolation** — concurrent bookings don't interfere
- **Durability** — committed bookings survive failures

### Idempotency Keys
Payment requests are tagged with a unique idempotency key. If the gateway retries the same request (due to network failure), the system detects the duplicate and returns the original response — preventing double charges.

```
POST /api/v1/bookings/payments
Headers:
  X-Idempotency-Key: <unique-uuid>
```

### Temporary Booking with Timeout
When a user initiates payment, the seat is temporarily held. If payment is not confirmed within the timeout window, the seat is automatically released back to inventory.

### Winston Structured Logging
Each service logs structured JSON entries with severity levels, enabling easy debugging and tracing across distributed services.

```js
logger.info('Booking initiated', { flightId, userId, seats });
logger.error('Payment failed', { error, idempotencyKey });
```

---

## 📁 Project Structure

```
airline-booking-system/
├── flight-service/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── config/
│   ├── migrations/
│   └── .env.example
│
├── booking-service/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── config/
│   ├── migrations/
│   └── .env.example
│
├── auth-service/
│   ├── src/
│   └── .env.example
│
└── docker-compose.yml
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js v18+
- MySQL 8+
- Docker (optional)

### 1. Clone the repository
```bash
git clone https://github.com/ankitsharma495/airline-booking-system.git
cd airline-booking-system
```

### 2. Setup each service

```bash
# For each service (flight-service, booking-service, auth-service)
cd flight-service
npm install
cp .env.example .env
# Fill in your DB credentials in .env
```

### 3. Run database migrations

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all   # optional: seed sample data
```

### 4. Start services

```bash
# Run each in a separate terminal
cd flight-service && npm run dev
cd booking-service && npm run dev
cd auth-service && npm run dev
```

### 5. Using Docker

```bash
docker-compose up --build
```

---

## 📡 API Endpoints

### Flight Service
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/flights` | Get all flights with filters |
| GET | `/api/v1/flights/:id` | Get flight by ID |
| POST | `/api/v1/flights` | Create a flight |
| GET | `/api/v1/airports` | Get all airports |
| GET | `/api/v1/cities` | Get all cities |

### Booking Service
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/bookings` | Create a booking |
| POST | `/api/v1/bookings/payments` | Process payment (idempotent) |
| GET | `/api/v1/bookings/:id` | Get booking details |
| PATCH | `/api/v1/bookings/:id/cancel` | Cancel a booking |

### Auth Service
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/signup` | Register a user |
| POST | `/api/v1/auth/login` | Login and get JWT |

---

## 🌍 Environment Variables

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=flight_db
JWT_SECRET=your_jwt_secret
FLIGHT_SERVICE_URL=http://localhost:3001
```

---

## 📌 What Makes This Production-Ready

- ✅ Pessimistic locking for concurrency safety
- ✅ Full ACID transaction support via InnoDB
- ✅ Idempotent payment API
- ✅ Schema version control via migrations
- ✅ Structured logging with Winston
- ✅ Input validation middlewares with proper HTTP error codes
- ✅ Environment-based configuration
- ✅ Docker support for consistent deployment

---

## 👤 Author

**Ankit Sharma**  
[GitHub](https://github.com/ankitsharma495) · [LinkedIn](https://linkedin.com/in/ankitsharma90)
