# Contact Form Setup

## Local setup

1. From the project root, install the frontend dependencies:

   ```bash
   npm install
   ```

2. Install the backend dependencies:

   ```bash
   cd server
   npm install
   ```

3. Create a Resend account at [resend.com](https://resend.com) and create an API key.

4. Paste the key into `server/.env` as `RESEND_API_KEY`. Keep `MY_EMAIL=bawsed16@gmail.com` and `PORT=3001` unless you need different values.

5. Run the backend from the `server` directory:

   ```bash
   npm run dev
   ```

6. In a second terminal, run the Vite frontend from the project root:

   ```bash
   npm run dev
   ```

The frontend uses `VITE_API_URL=http://localhost:3001` from the root `.env` file. The Resend API key stays on the backend and is never exposed to Vite.

## Deployment notes

- Resend test mode only sends email to the account's registered email address.
- To send to other recipients, buy or use a domain, verify it in the Resend Domains panel with SPF and DKIM, then change the `from` address in `server/server.js` from `onboarding@resend.dev` to an address on that verified domain.
- On Railway or Render, add `RESEND_API_KEY`, `MY_EMAIL`, and `PORT` as environment variables. Do not commit `server/.env`.
- Replace the production placeholder in the CORS array in `server/server.js` with the real frontend URL.
- Set the production frontend `VITE_API_URL` to the deployed backend URL, then rebuild the Vite app.
