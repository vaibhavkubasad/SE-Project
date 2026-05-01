# Akalwadi-Associates

Wholesale FMCG site for Akalwadi Associates — React frontend + Express API backed by MongoDB.

## Run locally

1. `npm install`
2. Set `MONGO_URI` and `PORT` in `.env`
3. In one terminal: `npm run server` (starts the API on the configured `PORT`)
4. In another terminal: `npm run dev` (starts Vite, proxies `/api` to the API server)

## Project structure

- `src/App.jsx` — landing page + client-side router
- `src/About.jsx` — dedicated About Us page
- `src/UserType.jsx` — login (calls `/api/login`)
- `src/styles.css` — site styling
- `oillist.jsx` / `masalalist.jsx` — wholesale catalogue pages (fetch from `/api/oils`, `/api/masalas`)
- `oillistbeforelogin.jsx` / `masalalistbeforlogin.jsx` — public preview pages with login prompt
- `logout.jsx` — landing page shown after login
- `server.js` — Express API server (oils, masalas, toiletries, login)
