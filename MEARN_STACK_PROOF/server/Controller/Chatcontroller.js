import Project from "../models/Project.js"
import { reviseProject } from "../Services/Ai.js"

function normalizeFiles(files = {}) {
  if (!files || typeof files !== "object" || Array.isArray(files)) {
    return {}
  }

  return { ...files }
}

export async function chatWithProject(req, res) {
  try {
    const prompt = typeof req.body?.prompt === "string" ? req.body.prompt.trim() : ""

    if (!prompt) {
      return res.status(400).json({ message: "A prompt is required" })
    }

    if (!req.userId) {
      return res.status(401).json({ message: "Not authenticated" })
    }

    const project = await Project.findOne({ _id: req.params.id, owner: req.userId })

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    const existingFiles = normalizeFiles(project.files)
    const manifest = Object.keys(existingFiles)
    const recentFiles = Array.isArray(project.filesGenerated) ? project.filesGenerated : []

    await Project.findByIdAndUpdate(project._id, {
      status: "revising",
      currentFile: null,
      $push: {
        messages: {
          role: "user",
          content: prompt,
          timestamp: new Date(),
        },
      },
    })

    const result = await reviseProject(
      prompt,
      manifest,
      existingFiles,
      recentFiles,
      (event) => {
        if (event?.stage === "done") {
          console.log("Revision complete:", event.message)
        }
      }
    )

    const nextFiles = normalizeFiles(existingFiles)

    if (Array.isArray(result?.ops)) {
      for (const operation of result.ops) {
        if (!operation || typeof operation !== "object") continue

        if (operation.op === "delete" && operation.path) {
          delete nextFiles[operation.path]
          continue
        }

        if ((operation.op === "create" || operation.op === "update") && operation.path) {
          if (operation.content !== undefined && operation.content !== null) {
            nextFiles[operation.path] = operation.content
          }
        }
      }
    }

    const updatedProject = await Project.findByIdAndUpdate(
      project._id,
      {
        files: nextFiles,
        status: "completed",
        version: (project.version || 0) + 1,
        $push: {
          messages: {
            role: "assistant",
            content: result?.description || "I updated your project.",
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    )

    return res.status(200).json({
      reply: result?.description || "I updated your project.",
      project: updatedProject,
    })
  } catch (error) {
    console.error("Chat update error:", error)

    // Don't leave the project stuck in "revising" forever if the AI call fails
    await Project.findByIdAndUpdate(req.params.id, {
      status: "failed",
      error: error.message,
      currentFile: null,
    }).catch((e) => console.error("Failed to mark project as failed:", e))

    // Surface the real error message so the frontend/console shows the actual cause
    return res.status(500).json({ message: error.message || "Could not update the project from chat" })
  }
}

export default chatWithProject