
# Command Pilot

Command Pilot turns natural requests into the single, correct terminal command for the user's platform — fast, reliable, and ready-to-run.

Command Pilot is a lightweight product composed of a backend API and a small React-based client (designed as a browser-extension-style UI). It helps developers, sysadmins and hobbyists discover the exact CLI command for installing packages, running tools, and performing common terminal tasks across Linux, macOS and Windows.

**Key ideas**
- **Single-line, production-ready commands**: The service returns one precise CLI command (no prose, no markdown).
- **Guest and authenticated modes**: Guests get instant commands; authenticated users can save and manage command history.
- **Cross-platform aware**: Detects or accepts the user's OS and chooses the appropriate package manager or native command.
- **Extensible LLM-driven assistant**: Uses a provider (configured via env) to synthesize the correct command.

**Product Highlights**
- **Instant command generation** — type an app or action, get one exact command.
- **Command history & profile** — authenticated users can save, view and delete past commands.
- **Simple integration** — REST API and a small client built with Vite + React.
- **Secure auth** — JWT-based authentication with cookie support.

Architecture
- Backend: Node.js + Express, MongoDB via Mongoose. Routes are under server/routes.
- Frontend: React + Vite (cli-client/cli-extension) — a compact UI intended for use as an extension-like client.
- LLM: External API calls (OpenRouter/OpenAI or similar) are used to produce the final CLI command.

Quickstart

1) Create an environment file in server (server/.env) with at least:
- PORT (e.g. 4000)
- MONGO_URI (your MongoDB connection string)
- OPENROUTER_API_KEY or equivalent LLM API key

2) Run the backend

	cd server
	npm install
	npm run start

3) Run the client (development)

	cd cli-client/cli-extension
	npm install
	npm run dev

The client expects the backend to be available at the URL defined in its utils (see client utils). If you run server locally set the BACKEND_URL in the client utils or run client with a local proxy.

Core Endpoints (overview)
- POST /api/command/forGuest — generate a command for a guest (not saved)
- POST /api/command/authenticUserCommand — generate and save command for authenticated users
- DELETE /api/command/delete/:id — delete a saved command
- POST /api/user/register — register new user
- POST /api/user/login — login (returns token and cookie)
- GET /api/user/logout — logout and clear cookie
- GET /api/user/getMyCommand — retrieve saved commands for authenticated user
- GET /api/user/getFullProfile — user profile and saved commands

Where things live
- Server entry: [server/index.js](server/index.js#L1)
- Command controller: [server/controllers/command.controller.js](server/controllers/command.controller.js#L1)
- User controller: [server/controllers/user.controller.js](server/controllers/user.controller.js#L1)
- Command model: [server/models/command.model.js](server/models/command.model.js#L1)
- User model: [server/models/user.model.js](server/models/user.model.js#L1)
- Client app: [cli-client/cli-extension/src/App.jsx](cli-client/cli-extension/src/App.jsx#L1)

Notes for contributors
- Keep responses strictly to a single line command (the backend enforces/cleans LLM output).
- Respect the enum of OS values in the Command model (linux, windows, macos, mac).
- Use the API client in cli-client/cli-extension/src/services/api.js for all frontend requests.

Security & environment
- Authentication uses JWT and cookies; the client stores a token in localStorage for header authorization.
- Do not commit secrets. Use environment variables for MONGO_URI and your LLM API keys.

Next steps & ideas
- Improve OS/distro detection to return distribution-specific commands (e.g., Ubuntu vs Debian vs Kali).
- Add a small CLI for offline usage that maps to the same backend.
- Add rate limit handling, usage analytics, and per-user quotas.

Thanks for exploring Command Pilot. To see or change the implementation details, check the server and client folders.

