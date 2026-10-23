# Builder AI

Builder AI is a full-stack app builder. Describe a website in a prompt, let the AI generate its files, preview and refine the result, then publish it for viewing.

## Features

- Create an account and sign in
- Generate a website from a text prompt
- View generation progress and preview generated files
- Ask the AI to revise a project
- Save projects and edits in MongoDB
- Publish a project and view it at a public route

## Technology

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express, Mongoose
- Database: MongoDB
- AI generation and revisions: Google Gemini through the Google Generative AI API

## Requirements

Install or prepare these before running the app:

1. **Node.js 20.19+ or 22.12+**, which includes npm. The frontend uses Vite 8.
2. **MongoDB**, either a local MongoDB server or a MongoDB Atlas database.
3. **A Google AI API key** with access to a Gemini model. Generation and AI revisions need this key.
4. **Git** to clone the repository, and a modern web browser to use the app.

You do not need to install the npm packages one by one. Run `npm install` in each application folder as shown below.

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd MEARN_STACK_PROOF
```

### 2. Configure the backend

The backend reads its environment file from the project root: `MEARN_STACK_PROOF/.env`.
Create that file with the following values:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/builder-ai
JWT_SECRET=replace-with-a-long-random-secret
ORIGIN=http://localhost:5173
GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-api-key
```

For MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string and ensure your IP address and database user are allowed in Atlas.

`GOOGLE_GENERATIVE_AI_MODEL` and `AI_MAX_RETRIES` are optional. The server uses its configured default model and three retries if these are omitted. Keep API keys and secrets private; do not commit `.env`.

Install and start the backend:

```bash
cd server
npm install
npm run dev
```

The API listens on `http://localhost:3000` by default. Keep this terminal running.

### 3. Configure and start the frontend

Open a second terminal from the repository root. Create `Mearnproject/.env`:

```env
VITE_BASE_URL=http://localhost:3000
```

Install and start the frontend:

```bash
cd Mearnproject
npm install
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`.

## How the app works

1. **Register or sign in.** The backend verifies credentials and sets an HTTP-only session cookie.
2. **Describe an app.** On the home page, submit a prompt describing the website you want.
3. **Generate the project.** The backend creates a project record in MongoDB, asks Gemini to plan and generate files, and updates the project as generation proceeds.
4. **Preview and edit.** Open the generated project to preview its files. Changes made in the editor are saved to the backend.
5. **Refine with chat.** Send a follow-up request in the chat panel. The AI revises the relevant project files and saves a new version.
6. **Publish.** Choose publish to make the project available at a route such as `/publish/<project-id>`. This route is public within the running app; a shareable internet link requires deploying the frontend and backend.

Projects and account information are stored in MongoDB. The API protects account-specific project operations with the session cookie.

## Useful commands

Run these from the relevant folder:

| Folder | Command | Purpose |
| --- | --- | --- |
| `server` | `npm run dev` | Start the backend with automatic restarts |
| `server` | `npm start` | Start the backend |
| `Mearnproject` | `npm run dev` | Start the Vite development server |
| `Mearnproject` | `npm run build` | Build the frontend for production |
| `Mearnproject` | `npm run lint` | Run Oxlint |
| `Mearnproject` | `npm run preview` | Preview a production frontend build |

## Troubleshooting

- **MongoDB connection error:** confirm MongoDB is running, or check the Atlas connection string, database user, and IP access list.
- **AI generation fails:** check `GOOGLE_GENERATIVE_AI_API_KEY` and ensure the key has access to the configured Gemini model.
- **Frontend cannot reach the API:** confirm the backend is running on port 3000 and `Mearnproject/.env` has the correct `VITE_BASE_URL`. Restart Vite after changing its environment file.
- **Browser reports a CORS error:** set the backend `ORIGIN` to the exact frontend origin, including its port.
- **Missing package or build dependency:** run `npm install` again in the folder where the error occurred.

## Project layout

```text
MEARN_STACK_PROOF/
├── Mearnproject/   # React/Vite frontend
└── server/         # Express API, MongoDB models, and AI services
```

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE).
