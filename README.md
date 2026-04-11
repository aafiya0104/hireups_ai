# HireUps AI

HireUps is a Next.js App Router platform with student, recruiter, alumni, and TPO workflows. The TPO module includes recruiter discovery, alumni radar, outreach automation, analytics, and drive history with safe fallbacks when MongoDB or Groq are unavailable.

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000` or the next free port shown by Next.js.

## Optional Environment Variables

The project works without any API keys. To enable external services, set:

```bash
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=hireups_ai
GROQ_API_KEY=your_groq_key
GROQ_MODEL=llama-3.1-8b-instant
```

If these values are missing, the TPO APIs automatically return built-in datasets and fallback outreach messages.

## TPO Pages

- `/tpo/dashboard`
- `/tpo/companies`
- `/tpo/alumni`
- `/tpo/outreach`
- `/tpo/analytics`
- `/tpo/drives`

## TPO API Routes

- `GET /api/tpo/companies`
- `POST /api/tpo/companies`
- `PUT /api/tpo/companies/:id`
- `GET /api/tpo/alumni`
- `POST /api/tpo/alumni`
- `GET /api/tpo/outreach`
- `POST /api/tpo/outreach/send`
- `PATCH /api/tpo/outreach/:id/approve`
- `GET /api/tpo/stats`
- `GET /api/tpo/drives`
