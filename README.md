# Healthcare Backend

A healthcare REST API built with Node.js, Express 5, TypeScript, PostgreSQL, Prisma, JWT, bcryptjs, and Zod.

## Requirements

- Node.js 22 or newer
- PostgreSQL
- npm

## Setup

Install the packages:

```bash
npm install
```

Create your local environment file from the example:

```bash
cp .env.example .env
```

Edit `.env` and set your PostgreSQL connection string and JWT secret:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/healthcare_db?schema=public"
JWT_SECRET="replace-this-with-a-long-random-secret"
PORT=5000
```

Create a PostgreSQL database named `healthcare_db`, or change the database name in `DATABASE_URL` to one you already have.

Create the database tables and generate Prisma Client:

```bash
npx prisma migrate dev --name init
npm run db:generate
```

Start the development server:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

## API routes

Routes other than registration and login require this header:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

### Authentication

| Method | Route                | Purpose                                                |
| ------ | -------------------- | ------------------------------------------------------ |
| POST   | `/api/auth/register` | Create an account with `name`, `email`, and `password` |
| POST   | `/api/auth/login`    | Log in and receive a JWT token                         |

### Patients

Patients belong to the user who created them. A user can only view, update, or delete their own patients.

| Method | Route               | Purpose                                                      |
| ------ | ------------------- | ------------------------------------------------------------ |
| POST   | `/api/patients`     | Create a patient with `name`, `age`, `gender`, and `address` |
| GET    | `/api/patients`     | List your patients                                           |
| GET    | `/api/patients/:id` | Get one of your patients                                     |
| PUT    | `/api/patients/:id` | Update one of your patients                                  |
| DELETE | `/api/patients/:id` | Delete one of your patients                                  |

### Doctors

| Method | Route              | Purpose                                                                                   |
| ------ | ------------------ | ----------------------------------------------------------------------------------------- |
| POST   | `/api/doctors`     | Create a doctor with `name`, `specialty`, and `email`; `phone` and `address` are optional |
| GET    | `/api/doctors`     | List doctors                                                                              |
| GET    | `/api/doctors/:id` | Get a doctor and their patient mappings                                                   |
| PUT    | `/api/doctors/:id` | Update a doctor                                                                           |
| DELETE | `/api/doctors/:id` | Delete a doctor                                                                           |

### Patient-doctor mappings

A mapping connects one patient with one doctor. A patient can have multiple doctors, and a doctor can have multiple patients. The same patient-doctor pair cannot be added twice.

| Method | Route                      | Purpose                                          |
| ------ | -------------------------- | ------------------------------------------------ |
| POST   | `/api/mappings`            | Assign a doctor using `patientId` and `doctorId` |
| GET    | `/api/mappings`            | List mappings for your patients                  |
| GET    | `/api/mappings/:patientId` | List doctors assigned to that patient            |
| DELETE | `/api/mappings/:id`        | Delete a mapping by its mapping ID               |

The GET and DELETE routes use the same URL shape, but their HTTP methods differ. For GET, the number is a **patient ID**. For DELETE, it is a **mapping ID**.

## Example requests

Register an account:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Asha Rao","email":"asha@example.com","password":"StrongPass123"}'
```

Log in and copy the returned token:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"asha@example.com","password":"StrongPass123"}'
```

Use that token in authenticated requests. Replace the example IDs with IDs returned by your API:

```bash
export TOKEN='paste-your-token-here'

curl -X POST http://localhost:5000/api/patients \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ravi Kumar","age":42,"gender":"male","address":"Pune"}'

curl -X POST http://localhost:5000/api/doctors \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Dr. Meera Shah","specialty":"Cardiology","email":"meera@example.com"}'

curl -X POST http://localhost:5000/api/mappings \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"patientId":1,"doctorId":1}'

curl http://localhost:5000/api/mappings/1 \
  -H "Authorization: Bearer $TOKEN"
```

## Production build

```bash
npm run build
npm start
```

## Environment file safety

`.env` contains local database credentials and should not be committed to GitHub. Commit `.env.example` so others know which settings they need to provide.
