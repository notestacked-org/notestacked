import {z} from "zod"

export const saveNoteSchema = z.object({
    noteVersion:z.number().min(1,"Note version is required"),
    content:z.string().optional(),
    workspaceId:z.string().uuid(),
    noteId:z.string().uuid(),
})

export const createNoteSchema = z.object({
    title:z.string().min(1,"Title is required"),
    content:z.string().optional(),
    description:z.string().optional(),
    workspaceId:z.string().uuid(),
})

export const editNoteSchema = z.object({
    noteId:z.string().uuid(),
    title:z.string().min(1,"Title is required"),
    content:z.string().optional(),
    workspaceId:z.string().uuid(),
})

export const getNotes = z.object({
    workspaceId:z.string().uuid(),
})

export const uploadNoteImageSchema = z.object({
     image: z
    .instanceof(File)
    .refine(
      (f) => ["image/png", "image/jpeg", "image/webp"].includes(f.type),
      "Only PNG, JPG, and WEBP files are allowed"
    )
    .refine((f) => f.size <= 5 * 1024 * 1024, "File must be less than 5MB"),
})

export const duplicateNoteSchema = z.object({
    noteId:z.string().uuid(),
    workspaceId:z.string().uuid(),
    name:z.string().min(1,"Name is required"),
})

export const deleteNoteSchema = z.object({
    noteId:z.string().uuid(),
    workspaceId:z.string().uuid(),
})