import Project from "../models/Project.js"
import { generateProject } from "../Services/Ai.js"

// POST /api/projects
// Create a new project and kick off AI generation in the background
export async function createProject(req, res) {
  try {
    const { prompt } = req.body

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "A prompt is required" })
    }

    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized user" })
    }

    const project = await Project.create({
      owner: req.userId,
      name: "Planning project...",
      description: prompt.trim(),
      prompt: prompt.trim(),
      status: "pending",
      files: {},
      filesGenerated: [],
      filesPlanned: [],
      currentFile: null,
      error: null,
      version: 1,
      messages: [
        { role: "user", content: prompt.trim(), timestamp: new Date() },
        { role: "assistant", content: "Planning project structure...", timestamp: new Date() },
      ],
    })

    runBackgroundGeneration(project._id.toString(), prompt.trim()).catch((error) => {
      console.error("Project generation error:", error)
    })

    return res.status(201).json(project)
  } catch (error) {
    console.error("Create project error:", error)
    return res.status(500).json({ message: "Couldn't create your project! Try again.." })
  }
}

// Background Work
// Generates the project's files via AI, updates status as it progresses
async function runBackgroundGeneration(projectId, prompt) {
  try {
    console.log(`[Background AI] Starting generation for project ${projectId}`)

    const result = await generateProject(prompt, {
      onPlan: async (plan) => {
        console.log(`[Background AI] Planned ${plan.files.length} files for ${projectId}`)
        const fileList = plan.files.map((f) => `- \`${f.path}\`: ${f.description}`).join("\n")

        await Project.findByIdAndUpdate(projectId, {
          name: plan.projectName || "Generated project",
          status: "generating",
          filesPlanned: plan.files,
          $push: {
            messages: {
              role: "assistant",
              content: `Planned website structure:\n${fileList}`,
              timestamp: new Date(),
            },
          },
        })
      },

      onFileStart: async (path) => {
        console.log(`[Background AI] Starting file ${path} for project ${projectId}`)
        await Project.findByIdAndUpdate(projectId, { currentFile: path })
      },

      onFileComplete: async (path, code) => {
        console.log(`[Background AI] Completed file ${path}`)
        const project = await Project.findById(projectId)
        if (!project) return

        project.files = project.files || {}
        project.files[path] = code
        project.filesGenerated = [...(project.filesGenerated || []), path]
        project.messages.push({
          role: "assistant",
          content: `Created file "${path}"`,
          timestamp: new Date(),
        })
        project.currentFile = null
        project.markModified("files")
        await project.save()
      },
    })

    console.log("[Background AI] Project generated")

    const project = await Project.findById(projectId)
    if (project) {
      project.status = "completed"
      project.version = 1
      if (result.description) {
        project.description = result.description
      }
      project.messages.push({
        role: "assistant",
        content: "Your website is complete — you can access it now.",
        timestamp: new Date(),
      })
      await project.save()
    }
  } catch (err) {
    console.error("Generation error:", err)
    await Project.findByIdAndUpdate(projectId, {
      status: "failed",
      error: err.message,
      currentFile: null,
      $push: {
        messages: {
          role: "assistant",
          content: "Generation failed. Please try again.",
          timestamp: new Date(),
        },
      },
    })
  }
}

// GET /api/projects
// List all projects owned by the current user
export async function listProject(req, res) {
  try {
    const projects = await Project.find({ owner: req.userId }).sort({ updatedAt: -1 })
    return res.status(200).json(projects)
  } catch (error) {
    console.error("List projects error:", error)
    return res.status(500).json({ message: "Couldn't load your projects" })
  }
}

// GET /api/projects/:id
// Get full project detail
export async function getProject(req, res) {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.userId })
    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }
    return res.status(200).json(project)
  } catch (error) {
    console.error("Get project error:", error)
    return res.status(500).json({ message: "Couldn't load project details" })
  }
}

// DELETE /api/projects/:id
// Delete a project
export async function deleteProject(req, res) {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.userId })
    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }
    return res.status(200).json({ message: "Project deleted" })
  } catch (error) {
    console.error("Delete project error:", error)
    return res.status(500).json({ message: "Couldn't delete this project" })
  }
}

// PUT /api/projects/:id/files
// Update a project's live-edited files (autosave from the code editor)
export async function updateProject(req, res) {
  try {
    const { files } = req.body

    if (!files || typeof files !== "object") {
      return res.status(400).json({ message: "Files object is required" })
    }

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      { files },
      { new: true }
    )

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    return res.status(200).json(project)
  } catch (error) {
    console.error("Update project error:", error)
    return res.status(500).json({ message: "Couldn't save your changes" })
  }
}

// POST /api/projects/:id/publish
// Publish a project so it's viewable at a public URL
export async function publishProject(req, res) {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      { published: true, publishedAt: new Date() },
      { new: true }
    )

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    return res.status(200).json(project)
  } catch (error) {
    console.error("Publish project error:", error)
    return res.status(500).json({ message: "Couldn't publish this project" })
  }
}

// GET /api/publish/:id
// Get a published project's data — public, no auth required
export async function getPublishProject(req, res) {
  try {
    const project = await Project.findOne({ _id: req.params.id, published: true })

    if (!project) {
      return res.status(404).json({ message: "This website is not available" })
    }

    return res.status(200).json(project)
  } catch (error) {
    console.error("Get published project error:", error)
    return res.status(500).json({ message: "Something went wrong" })
  }
}