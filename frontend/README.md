# ProdAI Frontend

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file for API URL (optional for development):

```bash
echo "VITE_API_URL=http://localhost:8000" > .env
```

3. Start development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

Build output will be in the `dist/` folder.

## Environment Variables

- `VITE_API_URL` - Backend API URL (default: `http://localhost:8000`)

## Tech Stack

- React 18
- Vite 5
- Tailwind CSS 3
- Framer Motion
- React Router DOM
- Zustand (State Management)
- Axios (HTTP Client)
- Lucide React (Icons)
- React Hot Toast (Notifications)
