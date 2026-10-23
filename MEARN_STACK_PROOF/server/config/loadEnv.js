import { config } from "dotenv"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const serverDirectory = dirname(fileURLToPath(import.meta.url))

config({ path: resolve(serverDirectory, "../.env") })
