import { Router } from "express"
import { createProject, deleteProject, getProject, getPublishProject, listProject, publishProject, updateProject } from "../Controller/Pojectcontroller.js"
import { chatWithProject } from "../Controller/Chatcontroller.js"
import { requireAuth } from "../Controller/AUTH_Middlevare.js"

const projectRouter = Router()

projectRouter.get("/public/:id", getPublishProject)
projectRouter.post("/public/:id", getPublishProject)

projectRouter.use(requireAuth)

projectRouter.post("/", createProject)
projectRouter.get("/", listProject)
projectRouter.get("/:id", getProject)
projectRouter.delete("/:id", deleteProject)
projectRouter.put("/:id/files", updateProject)
projectRouter.post("/:id/publish", publishProject)

projectRouter.post("/:id/chat", chatWithProject)

export default projectRouter


// 8.08