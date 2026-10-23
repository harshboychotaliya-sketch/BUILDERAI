import { z } from "zod"

export const GenerationResultSchema = z.object({
  files: z.record(z.string(), z.string()),
  description: z.string().default("Generating Project"),
  projectName: z.string().default("Generated Project"),
  projectDescription: z.string().default("A React project"),
})

export const FileOpSchema = z.object({
  op: z.enum(["create", "update", "delete"]),
  path: z.string(),
  content: z.string().nullable().optional(),
  search: z.string().nullable().optional(),
  replace: z.string().nullable().optional(),
})

export const RevisionResultSchema = z.object({
  ops: z.array(FileOpSchema),
  description: z.string().default("Applied Revision"),
})
