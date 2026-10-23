import { detectDependencies } from "./sandpackUtils.js"

function downloadBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Splits the flat files map into frontend/backend groups based on path prefix.
// Older projects with no "/frontend" or "/backend" prefix are treated entirely
// as frontend files, so this stays backward-compatible.
function splitFiles(fileMap) {
    const frontend = {};
    const backend = {};

    for (const [path, content] of Object.entries(fileMap)) {
        if (path.startsWith("/frontend/")) {
            frontend[path.slice("/frontend".length)] = content;
        } else if (path.startsWith("/backend/")) {
            backend[path.slice("/backend".length)] = content;
        } else {
            // legacy project with flat paths like "/App.jsx"
            frontend[path] = content;
        }
    }

    return { frontend, backend };
}

export async function exportProjectZip(project) {
    if (!project) return;
    try {
        const jszip = (await import("jszip")).default;
        const zip = new jszip();

        const fileMap = {};
        for (const [path, content] of Object.entries(project.files || {})) {
            const fileCode = typeof content === "string" ? content : content?.content || "";
            fileMap[path] = fileCode;
        }

        const { frontend, backend } = splitFiles(fileMap);
        const hasBackend = Object.keys(backend).length > 0;
        const projectSlug = (project.name || "my-website").toLowerCase().replace(/[^a-z0-9]+/g, "-");

        // ---------- FRONTEND ----------
        const frontendRoot = hasBackend ? zip.folder("frontend") : zip;
        const detectedFrontendDeps = detectDependencies(frontend);

        frontendRoot.file(
            "package.json",
            JSON.stringify(
                {
                    name: `${projectSlug}-frontend`,
                    private: true,
                    version: "0.1.0",
                    type: "module",
                    scripts: {
                        dev: "vite",
                        build: "vite build",
                        preview: "vite preview",
                    },
                    dependencies: {
                        react: "^18.2.0",
                        "react-dom": "^18.2.0",
                        ...detectedFrontendDeps,
                    },
                    devDependencies: {
                        "@vitejs/plugin-react": "^4.2.0",
                        vite: "^5.0.0",
                        tailwindcss: "^3.4.0",
                        autoprefixer: "^10.4.0",
                        postcss: "^8.4.0",
                    },
                },
                null,
                2
            )
        );

        frontendRoot.file(
            "vite.config.js",
            `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx',
    include: /src\\/.*\\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
});
`
        );

        frontendRoot.file(
            "index.html",
            `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${project.name || "My Website"}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/index.jsx"></script>
</body>
</html>
`
        );

        frontendRoot.file(
            "src/index.jsx",
            `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')).render(<App />);
`
        );

        for (const [path, content] of Object.entries(frontend)) {
            const cleanPath = path.startsWith("/") ? path.slice(1) : path;
            frontendRoot.file(`src/${cleanPath}`, content);
        }

        // ---------- BACKEND (only if the project actually has one) ----------
        if (hasBackend) {
            const backendRoot = zip.folder("backend");
            const detectedBackendDeps = detectDependencies(backend);

            // Sensible defaults for common backend packages, in case the AI's
            // generated code imports them but detectDependencies only knows
            // the import name (it can't know exact safe version ranges).
            const knownBackendVersions = {
                express: "^4.19.2",
                mongoose: "^8.5.0",
                cors: "^2.8.5",
                dotenv: "^16.4.5",
                bcryptjs: "^2.4.3",
                jsonwebtoken: "^9.0.2",
                "cookie-parser": "^1.4.6",
                nodemon: "^3.1.4",
            };

            const backendDependencies = {};
            for (const dep of Object.keys(detectedBackendDeps)) {
                backendDependencies[dep] = knownBackendVersions[dep] || "latest";
            }
            // express + mongoose are near-universal for this kind of generated
            // backend — include them even if detection missed them (e.g. if the
            // project only has model files without an explicit server.js import).
            if (!backendDependencies.express) backendDependencies.express = knownBackendVersions.express;
            if (!backendDependencies.mongoose) backendDependencies.mongoose = knownBackendVersions.mongoose;

            backendRoot.file(
                "package.json",
                JSON.stringify(
                    {
                        name: `${projectSlug}-backend`,
                        private: true,
                        version: "0.1.0",
                        type: "module",
                        main: "server.js",
                        scripts: {
                            start: "node server.js",
                            dev: "nodemon server.js",
                        },
                        dependencies: backendDependencies,
                        devDependencies: {
                            nodemon: knownBackendVersions.nodemon,
                        },
                    },
                    null,
                    2
                )
            );

            backendRoot.file(
                ".env.example",
                `# Copy this file to ".env" and fill in your own values before running the backend.
PORT=3000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=replace_with_a_random_secret
ORIGIN=http://localhost:5173
`
            );

            for (const [path, content] of Object.entries(backend)) {
                const cleanPath = path.startsWith("/") ? path.slice(1) : path;
                backendRoot.file(cleanPath, content);
            }

            // ---------- ROOT README (only needed when both halves exist) ----------
            zip.file(
                "README.md",
                `# ${project.name || "My Website"}

This project has two parts — a frontend and a backend. Run each one separately.

## Frontend

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

Opens at http://localhost:5173 by default.

## Backend

\`\`\`bash
cd backend
npm install
cp .env.example .env
# edit .env with your own MongoDB URI and secrets
npm run dev
\`\`\`

Runs on the port set in your .env (default 3000).

> Note: the backend needs a real MongoDB connection string in \`.env\` to work —
> see .env.example for the required variables.
`
            );
        }

        const blob = await zip.generateAsync({ type: "blob" });
        const fileName = `${projectSlug}.zip`;
        downloadBlob(blob, fileName);
    } catch (error) {
        console.error("Export project error:", error);
    }
}