# AI Usage

**Tool Used:** Claude (Anthropic)

**Tasks Assisted With:**

- **MongoDB backend logic** — Generated and improved code for database transactions, safe deletion patterns (checking references before deleting documents), and structuring Express route handlers in [backend/routes/projects.js](backend/routes/projects.js).
- **Deployment debugging** — Helped diagnose connection issues when deploying to Vercel and linking the backend to MongoDB Atlas, including environment variable configuration and `vercel.json` routing setup.
- **UI design** — Assisted in creating a clean, consistent frontend interface including layout structure, component styling, and user-facing feedback patterns.

**How Output Was Verified and Modified:**

All AI-generated code was reviewed manually before use. MongoDB transaction logic was tested against the live Atlas database to confirm correct behavior. Deployment suggestions were applied incrementally and verified by checking live Vercel logs and API responses. UI components were rendered locally and adjusted for spacing, color, and responsiveness to match the intended design. No AI output was used verbatim without review.
