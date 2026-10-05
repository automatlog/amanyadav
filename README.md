# Layer Lab (React + Vite)

Stack in this project:

- React + Vite
- Three.js + React Three Fiber + Drei
- GSAP + Framer Motion
- Howler.js
- Google Gemini API (browser demo mode)
- Tailwind CSS (v4)
- React Router v6

## Run

```bash
npm install
npm run dev
```

## Gemini key

Create `.env` from `.env.example` and set your key:

```bash
VITE_GEMINI_API_KEY=your_key_here
```

The chat page calls Gemini directly from the browser for demo convenience. Use a server proxy in production.
