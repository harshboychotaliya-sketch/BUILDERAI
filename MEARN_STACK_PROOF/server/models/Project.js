import mongoose from "mongoose"

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
)

const plannedFileSchema = new mongoose.Schema(
  {
    path: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
)

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, default: "untitled project" },
    description: { type: String, default: "" },
    prompt: { type: String, default: "" },
    files: { type: mongoose.Schema.Types.Mixed, default: {} },
    messages: { type: [messageSchema], default: [] },
    version: { type: Number, default: 1 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    published: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
    status: {
      type: String,
      enum: ["pending", "generating", "revising", "completed", "failed"],
      default: "pending",
    },
    filesPlanned: { type: [plannedFileSchema], default: [] },
    filesGenerated: { type: [String], default: [] },
    currentFile: { type: String, default: null },
    error: { type: String, default: null },
  },
  { timestamps: true }
)

const Project = mongoose.model("Project", ProjectSchema)

export default Project







// import mongoose from "mongoose"

// const messageSchema = new mongoose.Schema(
//   {
//     role: { type: String, enum: ["user", "assistant"], required: true },
//     content: { type: String, required: true },
//     timestamp: { type: Date, default: Date.now },
//   },
//   { _id: false }
// )

// const plannedFileSchema = new mongoose.Schema(
//   {
//     path: { type: String, required: true },
//     description: { type: String, required: true },
//   },
//   { _id: false }
// )

// const attachmentSchema = new mongoose.Schema(
//   {
//     url: { type: String, required: true },
//     name: { type: String, default: "" },
//     mimeType: { type: String, required: true },
//   },
//   { _id: false }
// )

// const ProjectSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//       default: "untitled project",
//     },
//     description: { type: String, default: "" },
//     prompt: { type: String, default: "" },

//     attachments: {
//       type: [attachmentSchema],
//       default: [],
//     },

//     files: { type: mongoose.Schema.Types.Mixed, default: {} },
//     messages: { type: [messageSchema], default: [] },
//     version: { type: Number, default: 1 },

//     owner: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//       required: false,
//     },

//     published: { type: Boolean, default: false },
//     publishedAt: { type: Date, default: null },
//     status: {
//       type: String,
//       enum: ["pending", "generating", "revising", "completed", "failed"],
//       default: "pending",
//     },
//     filesPlanned: { type: [plannedFileSchema], default: [] },
//     filesGenerated: { type: [String], default: [] },
//     currentFile: { type: String, default: null },
//     error: { type: String, default: null },
//   },
//   { timestamps: true }
// )

// const Project = mongoose.model("Project", ProjectSchema)

// export default Project