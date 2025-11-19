import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { supabaseMiddleware } from "@/lib/supabase/supabaseMiddleware";
import {
    createWorkspaceSchema,
    getWorkspaceMembersSchema,
    deleteWorkspaceSchema,
    updateWorkspaceSchema,
    updateWorkspaceSchemaParams,
    updateMemberRoleSchema,
    addMembersSchema,
    removeMemberSchema
} from "./schema";
import prisma from "../../../prisma/client";
import { nanoid } from "nanoid"
import { getUserId, supabaseAuth } from "@/lib/supabase/supabaseAuth";
export const workspace = new Hono()
    .use("*", supabaseMiddleware())
    .use("*", supabaseAuth())
    .get("/getWorkspaces", async (c) => {
        const userId = getUserId(c);

        try {
            const memberships = await prisma.workspaceMember.findMany({
                where: {
                    userId: userId
                },
                include: {
                    workspace: true,
                    user: true,
                },
                orderBy: {
                    joinedAt: "desc"
                }
            })
            const workspaces = memberships.map(m => {
                return {
                    workspaceId: m.workspaceId,
                    name: m.workspace.name,
                    description: m.workspace.description,
                    slug: m.workspace.slug,
                    role: m.role,
                    joinedAt: m.joinedAt,
                }
            });
            return c.json({ workspaces: workspaces, success: true });

        } catch (err) {
            return c.json({ message: (err as Error).message, success: false }, 400)
        }
    })
    .get("/:workspaceId/members", zValidator("param", getWorkspaceMembersSchema), async (c) => {
        const { workspaceId } = c.req.valid("param")
        try {
            const members = await prisma.workspaceMember.findMany({
                where: { workspaceId: workspaceId },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            profile: {
                                select: {
                                    username: true,
                                    profilePic: true,
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    joinedAt: "asc"
                }
            })
            const workspaceMembers = members.map((member) => {
                return {
                    id: member.user.id,
                    email: member.user.email,
                    name: member.user.profile?.username,
                    profilePic: member.user.profile?.profilePic,
                    role: member.role,
                    joinedAt: member.joinedAt,
                }
            })
            return c.json({ workspaceMembers, success: true });

        } catch (err) {
            return c.json({ message: (err as Error).message, success: false }, 400);
        }
    })
    .post("/createWorkspace", zValidator("json", createWorkspaceSchema), async (c) => {
        const { name, description, slug } = c.req.valid("json")
        const userId = getUserId(c);
        const finalSlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + nanoid(6);
        try {
            const workspace = await prisma.$transaction(async (prisma) => {
                const createdWorkspace = await prisma.workspace.create({
                    data: {
                        name,
                        description,
                        slug: finalSlug,
                    },
                })
                await prisma.workspaceMember.create({
                    data: {
                        workspaceId: createdWorkspace.id,
                        userId: userId,
                        role: "OWNER",
                    }
                })
                return createdWorkspace;

            })
            return c.json({ workspace, success: true })
        } catch (err) {
            return c.json({ message: (err as Error).message, success: false }, 400);
        }

    })
    .post("/addMembers", zValidator("json", addMembersSchema), async (c) => {
        const { workspaceId, members } = c.req.valid("json")
        const userId = getUserId(c);
        try {
            const checkMembership = await prisma.workspaceMember.findFirst({
                where: {
                    workspaceId: workspaceId,
                    userId: userId,
                },
                select: {
                    role: true,
                }
            })
            if (!checkMembership || (checkMembership.role != "OWNER" && checkMembership.role != "ADMIN")) {
                return c.json({ message: "Only workspace owners and admins can add members", success: false, }, 403);
            }
            const users = await prisma.user.findMany({
                where: {
                    email: {
                        in: members.map(member => member.email)
                    }
                },
                select: {
                    id: true,
                    email: true,
                }
            })
            const workspaceMembersData = members.map(member => {
                const memberData = users.find(u => u.email === member.email);
                if (!memberData) return null;
                return {
                    workspaceId: workspaceId,
                    userId: memberData.id,
                    role: member.role || "VIEWER",
                }
            }).filter(data => data !== null);
            await prisma.workspaceMember.createMany({
                data: workspaceMembersData,
                skipDuplicates: true,
            })
            return c.json({ message: "Members added successfully", success: true }, 201);
        } catch (err) {
            return c.json({ message: (err as Error).message, success: false }, 400);
        }
    })
    .patch("/:workspaceId", zValidator("json", updateWorkspaceSchema), zValidator("param", updateWorkspaceSchemaParams), async (c) => {
        const { workspaceId } = c.req.valid("param")
        const { name, description } = c.req.valid("json")
        const userId = getUserId(c)
        const memberShip = await prisma.workspaceMember.findFirst({
            where: {
                workspaceId: workspaceId,
                userId: userId,

            }
        })
        if (!memberShip || (memberShip.role != "OWNER" && memberShip.role != "ADMIN")) {
            return c.json({ message: "Only workspace owners and admins can update the workspace", success: false }, 403);
        }
        try {
            const updatedWorkspace = await prisma.workspace.update({
                where: { id: workspaceId },
                data: {
                    name,
                    description,
                }
            })
            return c.json({ workspace: updatedWorkspace, success: true });
        } catch (err) {
            return c.json({ message: (err as Error).message, success: false }, 400)
        }
    })
    //Todo implement image upload + handling of the image url in an api endpoint
    
    .patch("/:workspaceId/members/:memberEmail/role", zValidator("param", updateMemberRoleSchema), async (c) => {
        const { workspaceId, memberEmail, role } = c.req.valid("param");
        if (role == "OWNER") {
            return c.json({ message: "Owner role cannot be assigned to non-personal workspaces", success: false }, 400);
        }
        const userId = getUserId(c)
        const memberShip = await prisma.workspaceMember.findFirst({
            where: {
                workspaceId,
                userId,
            },
            select: {
                role: true,
            }
        })
        if (!memberShip || (memberShip.role != "ADMIN" && memberShip.role != "OWNER")) {
            return c.json({ message: "Only workspace owners and admins can update member roles", success: false }, 403);
        }
        try {
            const member = await prisma.user.findUnique({
                where: {
                    email: memberEmail,
                },
                select: {
                    id: true,
                }
            })
            if (!member) return c.json({ message: "Member not found", success: false }, 404);
            await prisma.workspaceMember.updateMany({
                where: {
                    workspaceId,
                    userId: member.id,
                },
                data: {
                    role,
                }
            })
            return c.json({ message: "Member role updated successfully", success: true });
        } catch (err) {
            return c.json({ message: (err as Error).message, success: false, }, 400);
        }
    })
    .delete("/:workspaceId", zValidator("param", deleteWorkspaceSchema), async (c) => {
        const { workspaceId } = c.req.valid("param")
        const userId = getUserId(c);
        const memberShip = await prisma.workspaceMember.findFirst({
            where: {
                workspaceId: workspaceId,
                userId: userId,
            }
        })
        if (!memberShip || memberShip.role != "OWNER") {
            return c.json({ message: "Only workspace owners can delete the workspace", success: false }, 403);
        }
        try {
            await prisma.workspace.delete({
                where: { id: workspaceId }
            })
            return c.json({ message: "workspace deleted successfully", success: true });
        } catch (err) {
            return c.json({ message: (err as Error).message, success: false }, 400);
        }
    })
    .delete("/:workspaceId/members/:memberEmail", zValidator("param", removeMemberSchema), async (c) => {
        const { workspaceId, memberEmail } = c.req.valid("param")
        const userId = getUserId(c)
        try {
            const memberShip = await prisma.workspaceMember.findFirst({
                where: {
                    workspaceId,
                    userId,
                },
                select: {
                    role: true,
                }
            })
            if (!memberShip || (memberShip.role != "ADMIN" && memberShip.role != "OWNER")) {
                return c.json({ message: "Only workspace owners and admins can remove members", success: false }, 403);
            }
            const memberToRemove = await prisma.user.findUnique({
                where: {
                    email: memberEmail,
                },
                select: {
                    id: true,
                }
            })
            if (!memberToRemove) {
                return c.json({ message: "Member not founde", success: false }, 404);

            }
            const memberRecord = await prisma.workspaceMember.findFirst({
                where: {
                    workspaceId,
                    userId: memberToRemove.id,
                },
                select: {
                    role: true,
                }

            })
            if (!memberRecord) {
                return c.json({ message: "Member is not part of the workspace", success: false }, 404);
            }
            if (memberShip.role === "ADMIN" && (memberRecord.role === "ADMIN" || memberRecord.role === "OWNER")) {
                return c.json({ message: "Admins cannot remove other admins or owners", success: false }, 403);
            }
            await prisma.workspaceMember.delete({
                where: {
                    userId_workspaceId: {
                        userId: memberToRemove.id,
                        workspaceId,
                    }
                }
            })
            return c.json({ message: "Member removed successfully", success: true });
        } catch (err) {
            return c.json({ message: (err as Error).message, success: false }, 400);
        }

    })

