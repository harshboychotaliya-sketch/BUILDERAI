import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { generateObject } from "ai"
import { parse } from "@babel/parser"
import {
  GenerationResultSchema,
  RevisionResultSchema,
} from "./Ai_Schema.js"

const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY
const MODEL = process.env.GOOGLE_GENERATIVE_AI_MODEL || "gemini-3.8-flash"
const MAX_RETRIES = parseInt(process.env.AI_MAX_RETRIES || "3", 10)

const google = API_KEY
  ? createGoogleGenerativeAI({ apiKey: API_KEY })
  : null

if (!API_KEY) {
  console.error("[Ai.js] GOOGLE_GENERATIVE_AI_API_KEY is not configured. Add it to server/.env.")
} else {
  console.log(`[Ai.js] Using Google Gemini model: ${MODEL}`)
}

const BASE_RULES = `You are an expert full-stack developer building small web apps.

A project has two parts:

1. FRONTEND (always generated)
   - React + Tailwind CSS utility classes only. Tailwind is loaded via CDN — never create a tailwind config file.
   - Allowed imports: react, react-dom, lucide-react, axios.
   - Files live under "/frontend/..." (for example "/frontend/App.jsx", "/frontend/components/Hero.jsx").
   - Every component file must have a default export.
   - If the app needs a backend, call it using axios with relative paths like "/api/..." — never hardcode a full URL (no "http://localhost:3000").
   - When calling the backend, match the exact HTTP method and endpoint path used in the real backend route files you are shown. Never invent an endpoint that the backend doesn't actually implement.
   - Always handle loading and error states for every API call (e.g. try/catch around axios calls, and a visible message if a request fails) — never leave a blank or silently broken UI.

2. BACKEND (only when the request needs real data, auth, or persistence — skip it for static sites like a portfolio or landing page)
   - Node.js + Express + Mongoose (MongoDB). No other language or framework.
   - Files live under "/backend/..." using this exact structure:
     - "/backend/server.js" — the entry point. Must:
       - load environment variables with "import 'dotenv/config'" at the very top
       - read the port from "process.env.PORT" (fallback to 3000 if unset)
       - connect to MongoDB using "process.env.MONGODB_URI" via mongoose.connect, and log a clear message on success or failure
       - enable CORS allowing the origin(s) in "process.env.ORIGIN" (comma-separated list)
       - use "express.json()" middleware so request bodies parse correctly
       - mount every route file under "/api/..." (for example a "todos" router mounted at "/api/todos")
       - start listening only after requiring/importing all routes, so route mounting errors surface immediately
     - "/backend/models/*.js" — one Mongoose model per file, default-exported, with a sensible schema (correct types, required fields where it makes sense, timestamps: true).
     - "/backend/routes/*.js" — Express routers, default-exported, implementing full CRUD where relevant (GET list, GET one, POST create, PUT/PATCH update, DELETE), each handler wrapped in try/catch returning proper status codes (200/201 on success, 400/404/500 on failure with a JSON { message } body).
     - If authentication is needed: hash passwords with "bcryptjs" (never "bcrypt"), and sign/verify JSON Web Tokens with "jsonwebtoken" using "process.env.JWT_SECRET".
   - Never hardcode secrets, connection strings, or API keys — always read them from "process.env".
   - Write complete, runnable code. No placeholders, no "TODO", no truncated sections, no "// rest of the code stays the same" shortcuts.

General rules for every file:
- File paths always start with "/" and are prefixed with either "/frontend" or "/backend".
- Keep each file focused — don't put unrelated logic in one file.
- Every file must be fully self-contained and correct on its own — assume it will be saved exactly as written, with no further manual edits.`

async function notify(callback, event) {
  if (!callback) return
  if (typeof callback === "function") return callback(event)

  const handlerNames = {
    planned: "onPlan",
    generating: "onFileStart",
    file_done: "onFileComplete",
  }
  const handler = callback[handlerNames[event.stage]]
  if (!handler) return

  if (event.stage === "planned") return handler(event.plan)
  if (event.stage === "file_done") return handler(event.path, event.code)
  return handler(event.path)
}

function getUpstreamError(error) {
  // Some API errors include the provider's error payload in the response body.
  try {
    const body =
      typeof error?.responseBody === "string"
        ? JSON.parse(error.responseBody)
        : error?.responseBody
    return body?.error || null
  } catch {
    return null
  }
}

function getStatusCode(error) {
  return getUpstreamError(error)?.code || error?.statusCode || error?.status
}

function describeError(error) {
  const upstream = getUpstreamError(error)
  if (upstream?.message) return upstream.message
  return error?.message || error?.cause?.message || String(error)
}

// Rate limits and server errors may recover on retry.
function isTemporaryError(error) {
  const code = getStatusCode(error)
  const message = describeError(error).toLowerCase()
  return (
    [408, 429, 500, 502, 503, 504].includes(code) ||
    message.includes("rate limit") ||
    message.includes("too many requests") ||
    message.includes("overloaded")
  )
}

// wrong key or wrong model name will never work on retry
function isFatalConfigError(error) {
  return [401, 403, 404].includes(getStatusCode(error))
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function generateObjectWithRetry(config, label, retries = MAX_RETRIES) {
  if (!google) {
    throw new Error("Google Gemini is not configured. Add GOOGLE_GENERATIVE_AI_API_KEY to server/.env.")
  }

  let lastError

  for (let attempt = 0; attempt <= retries; attempt++) {
    const startedAt = Date.now()
    const seconds = () => ((Date.now() - startedAt) / 1000).toFixed(1)

    try {
      const result = await generateObject({
        mode: "json",
        ...config,
        model: google(MODEL),
        maxRetries: 0,
      })
      console.log(`[Ai.js] ${label} completed with ${MODEL} in ${seconds()}s`)
      return result
    } catch (error) {
      lastError = error
      const code = getStatusCode(error)
      const temporary = isTemporaryError(error)
      console.error(
        `[Ai.js] ${label} (${MODEL}) attempt ${attempt + 1}/${retries + 1} failed after ${seconds()}s${code ? ` (HTTP ${code})` : ""}${temporary ? " [temporary]" : ""}:`,
        describeError(error)
      )

      if (error?.text) {
        console.error(`[Ai.js] ${label} (${MODEL}) raw response text:`, error.text)
      }

      if (isFatalConfigError(error)) break

      if (attempt < retries) {
        await sleep(temporary ? 5000 * (attempt + 1) : 500 * (attempt + 1))
      }
    }
  }

  throw new Error(`Google Gemini request failed: ${describeError(lastError)}`, { cause: lastError })
}

function validateCode(code) {
  try {
    parse(code, {
      sourceType: "module",
      plugins: ["jsx"],
      errorRecovery: false,
    })
    return { valid: true }
  } catch (error) {
    return {
      valid: false,
      message: `${error.message}${error.loc ? ` (line ${error.loc.line}, column ${error.loc.column})` : ""}`,
    }
  }
}

function findDuplicateSourceFiles(files) {
  const seen = new Map()
  const duplicates = []

  for (const [path, code] of Object.entries(files)) {
    if (!/\.(js|jsx)$/i.test(path)) continue

    const normalizedCode = code.replace(/\r\n/g, "\n").trim()
    const previousPath = seen.get(normalizedCode)
    if (previousPath) {
      duplicates.push([previousPath, path])
    } else {
      seen.set(normalizedCode, path)
    }
  }

  return duplicates
}

export async function generateProject(prompt, callback) {
  await notify(callback, {
    stage: "generating",
    message: "Generating your project…",
    path: "Generating project",
  })

  const generationPrompt = `Respond with ONLY one JSON object, exactly in this shape:
{
  "projectName": "short project name",
  "projectDescription": "one sentence about the project",
  "description": "short completion message",
  "files": {
    "/frontend/App.jsx": "the complete source code of this file as ONE string"
  }
}

Build a complete, runnable project for this request:
"${prompt}"

Every value inside "files" must be a plain string containing source code — never an object, never an array.
Choose the smallest coherent implementation that fully meets the request. Use one file
when that is enough; otherwise use no more than 5 files. Always include
"/frontend/App.jsx". Add backend files only when the request needs persistence, real data,
or authentication. If there is a backend, include its complete runnable entry point,
model(s), and route(s), and make frontend requests match those routes.

Use only paths prefixed with "/frontend/" or "/backend/". Include every local file needed
by imports in the returned "files" object. Each file must have a distinct purpose and
complete, path-appropriate source code; never copy the same implementation into multiple
files. Extract shared UI into one component and import it where needed. Frontend components must default-export.
Return only valid JSON matching the shape above, with no markdown fences, no commentary, and no extra keys.`

  const { object: initialResult } = await generateObjectWithRetry(
    {
      schema: GenerationResultSchema,
      system: BASE_RULES,
      prompt: generationPrompt,
      // this model "thinks" first, and thinking uses part of this budget
      maxOutputTokens: 32000,
    },
    "generateProject"
  )

  let result = initialResult
  let duplicateSourceFiles = findDuplicateSourceFiles(result.files)
  if (duplicateSourceFiles.length > 0) {
    const duplicatePaths = duplicateSourceFiles
      .map(([firstPath, duplicatePath]) => `${firstPath} and ${duplicatePath}`)
      .join("; ")
    console.warn(`[Ai.js] Duplicate source detected in ${duplicatePaths}; requesting one correction`)

    const corrected = await generateObjectWithRetry(
      {
        schema: GenerationResultSchema,
        system: BASE_RULES,
        prompt: `${generationPrompt}

Correction required: the previous response reused identical source code for these file pairs:
${duplicatePaths}
Regenerate the complete project. Give every file its own implementation appropriate to its path
and responsibility. Shared code should be imported from its own component, not copied into files.`,
        maxOutputTokens: 32000,
      },
      "generateProjectCorrection"
    )

    result = corrected.object
    duplicateSourceFiles = findDuplicateSourceFiles(result.files)
    if (duplicateSourceFiles.length > 0) {
      const paths = duplicateSourceFiles
        .map(([firstPath, duplicatePath]) => `${firstPath} and ${duplicatePath}`)
        .join("; ")
      throw new Error(`Generation failed: identical source code was returned for ${paths}`)
    }
  }

  const generatedFiles = result.files
  const filePaths = Object.keys(generatedFiles)
  if (!generatedFiles["/frontend/App.jsx"]) {
    throw new Error("Generation failed: no /frontend/App.jsx file was produced")
  }

  for (const path of filePaths) {
    if (!path.startsWith("/frontend/") && !path.startsWith("/backend/")) {
      throw new Error(`Generation failed: invalid project file path "${path}"`)
    }
    if (/\.(js|jsx)$/.test(path)) {
      const validation = validateCode(generatedFiles[path])
      if (!validation.valid) {
        throw new Error(`Generation failed: ${path} has invalid JavaScript: ${validation.message}`)
      }
    }
  }

  const plan = {
    projectName: result.projectName,
    projectDescription: result.projectDescription,
    files: filePaths.map((path) => ({
      path,
      description: path === "/frontend/App.jsx"
        ? "Main React application"
        : `Project file: ${path}`,
    })),
  }
  await notify(callback, {
    stage: "planned",
    message: `Generated ${filePaths.length} files`,
    plan,
  })

  for (const [path, code] of Object.entries(generatedFiles)) {
    await notify(callback, { stage: "file_done", path, code })
  }

  await notify(callback, { stage: "done", message: result.description })

  return {
    files: generatedFiles,
    name: result.projectName,
    description: result.projectDescription || result.description,
  }
}

export async function reviseProject(prompt, manifest, relevantFiles, recentFiles, callback) {
  callback?.({ stage: "thinking", message: "Working on your changes…" })

  const filesContext = Object.entries(relevantFiles)
    .map(([path, code]) => `--- ${path} ---\n${code}`)
    .join("\n\n")

  try {
    const { object } = await generateObjectWithRetry(
      {
        schema: RevisionResultSchema,
        system: BASE_RULES,
        prompt: `Respond with ONLY one JSON object, exactly in this shape:
{
  "description": "short summary of what you changed",
  "ops": [
        { "op": "update", "path": "/frontend/App.jsx", "content": "complete new file content" },
        { "op": "create", "path": "/frontend/components/New.jsx", "content": "complete file content" },
        { "op": "delete", "path": "/frontend/old.js" }
  ]
}

The user wants this change: "${prompt}"

Project file list:
${manifest.join("\n")}

Current contents of the relevant files:
${filesContext}

${recentFiles?.length ? `Recently changed: ${recentFiles.join(", ")}` : ""}

Return a list of file operations to make this change.
- Use "update" with full "content" when rewriting a file.
- Use "create" with full "content" for new files (frontend or backend — follow the exact
  backend structure and env var names described in your rules if adding backend code).
- Use "delete" when removing a file.
- If this request is a complete change of subject (e.g. the project is currently one kind
  of app and the user is asking for a completely different kind of app), treat it as building
  a new project from scratch: delete all old files that no longer make sense and create a
  full, coherent new set of files instead of patching unrelated old code.
Always return complete file contents, never partial snippets, and only valid JSON in the shape above.`,
        maxOutputTokens: 16000,
      },
      "reviseProject"
    )

    callback?.({ stage: "done", message: object.description })

    return object
  } catch (error) {
    console.error("[reviseProject] AI call failed:", error.message)
    throw error
  }
}

export { MODEL, MAX_RETRIES }