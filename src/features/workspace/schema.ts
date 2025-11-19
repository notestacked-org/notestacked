import { z } from "zod"

export const createWorkspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required"),
  description: z.string().optional(),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens")
    .optional(),
})

export const updateWorkspaceSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
})
export const updateWorkspaceSchemaParams = z.object({
  workspaceId: z.string().uuid(),
})

export const addMembersSchema = z.object({
  workspaceId: z.string().uuid(),
  members: z.array(z.object({
    email: z.string().email("Invalid email address"),
    userId: z.string().uuid().optional(),
    role: z.enum(["ADMIN", "OWNER", "EDITOR", "VIEWER"])
  }))
})
export const removeMemberSchema = z.object({
  workspaceId:z.string().uuid(),
  memberEmail:z.string().email("Invalid email address"),  
})

export const updateMemberRoleSchema = z.object({
  workspaceId: z.string().uuid(),
  memberEmail: z.string().email("Invalid email address"),
  role: z.enum(["OWNER", "ADMIN", "EDITOR", "VIEWER"]),
})

export const deleteWorkspaceSchema = z.object({
  workspaceId: z.string().uuid(),
})


export const updateWorkspaceImageSchema = z.object({

  //still to write the schema for it 
  imageUrl: z.string().url(
    "Invalid image URL"
  )
})

export const getWorkspaceMembersSchema = z.object({
  workspaceId: z.string().uuid(),
})



