import "./config/loadEnv.js"
import express from "express"
import cors from "cors"
import cookieparse from "cookie-parser"
import { conntectTodatabase } from "./config/db.js"
import Authroute from "./Routes/AuthRoutes.js"
import projectRouter from "./Routes/ProjectRoutes.js"

const app = express()

conntectTodatabase().catch((error) => {
  console.error("Database connection failed:", error)
})

app.use(express.json())
app.use(cors({ origin: process.env.ORIGIN?.split(",") || ["http://localhost:5173"], credentials: true }))
app.use(cookieparse())
app.use("/api/auth", Authroute)
app.use("/api/projects", projectRouter)

app.get("/", (req, res) => {
  res.send("Server is live")
})

app.use((err, _req, res, _next) => {
  console.log(`[error] ${err.message}`)
  res.status(500).json({ error: err.message })
})

const port = process.env.PORT || 3000

app.listen(port, function () {
  console.log(`Server is running on port ${port}`)
})