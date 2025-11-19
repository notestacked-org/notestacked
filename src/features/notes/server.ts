import { Hono } from "hono";
import prisma from "../../../prisma/client";
import { zValidator } from "@hono/zod-validator";
import { supabaseMiddleware, getSupabase } from "@/lib/supabase/supabaseMiddleware";
import { supabaseAuth, getUserId } from "@/lib/supabase/supabaseAuth";
import { createNoteSchema, deleteNoteSchema, getNotes, saveNoteSchema } from "./schema";
export const notesRouter = new Hono()
    .use("*", supabaseMiddleware())
    .use("*", supabaseAuth())
    //get Routes are here
    .get("/recentNotes", async (c) => {
        const userId = getUserId(c);
        if (!userId) {
            return c.json({ success: false, message: "Unauthorized" }, 401);

        }
        try {
            const recentNotes = await prisma.recentNote.findMany({
                where: {
                    userId: userId
                },
                include:{
                    note:{
                        select:{
                            title:true,
                        }
                    }
                },
                orderBy: {
                    lastOpened: "desc",
                }
            })
            return c.json({ success: true, recentNotes: recentNotes }, 200);
        } catch (error) {
            return c.json({ success: false, message: "Internal Server Error" }, 500);
        }
    })
    
    .get("/getNotes/:workspaceId", zValidator("param", getNotes), async (c) => {
        const { workspaceId } = c.req.valid("param")
        const userId = getUserId(c);
        if (!userId) {
            return c.json({ success: false, message: "Unauthorized" }, 401);
        }
        try {
            const notes = await prisma.note.findMany({
                where: {
                    workspaceId: workspaceId,
                },
                orderBy: {
                    updatedAt: "desc",
                }
            })
            return c.json({ success: true, notes: notes }, 200);
        } catch (error) {
            return c.json({ success: false, message: "Internal Server Error" }, 500);
        }
    })
    //post Routes starts here
    .post("/saveNote", zValidator("json", saveNoteSchema), async (c) => {
        const { noteVersion, noteId, workspaceId, content } = c.req.valid("json")
        const userId = getUserId(c);
        const membership = await prisma.workspaceMember.findFirst({
            where: {
                userId: userId,
                workspaceId: workspaceId,
            },
            select: {
                role: true,
            }
        })
        if (!membership || membership.role === "VIEWER") {
            return c.json({ success: false, message: "Viewer cant save note" }, 401);
        }
        try {
            const note = await prisma.note.findUnique({
                where: {
                    id: noteId,
                    workspaceId: workspaceId,
                },
                select: {
                    noteVersion: true,
                }

            })
            if (!note || note.noteVersion !== noteVersion) {
                return c.json({ success: false, message: "Note version mismatch" }, 409);
            }
            const updatedNote = await prisma.note.update({
                where: {
                    workspaceId: workspaceId,
                    id: noteId,
                },
                data: {
                    content: content,
                    noteVersion: noteVersion + 1,
                }
            })
            return c.json({ success: true, note: updatedNote }, 200);
        } catch (error) {
            return c.json({ success: false, message: "Internal Server Error" }, 500);
        }
    })
    .post("/createNote", zValidator("json", createNoteSchema), async (c) => {
        const { title, workspaceId, content,description } = c.req.valid("json")
        const userId = getUserId(c);
        const membership = await prisma.workspaceMember.findFirst({
            where: {
                userId: userId,
                workspaceId: workspaceId,
            },
            select: {
                role: true,
            }
        })
        if (!membership || membership.role === "VIEWER") {
            return c.json({ success: false, message: "Viewer cant create note" }, 401);
        }
        try{
            const newNote = await prisma.note.create({
                data:{
                    title:title,
                    content:content || " ",
                    workspaceId:workspaceId,
                    createdAt:new Date(),
                    updatedAt:new Date(),
                    noteVersion:1,
                    description:null,
                }
            })
            return c.json({success:true,note:newNote},200);
        }
        catch(error){
            return c.json({ success: false, message: "Internal Server Error" }, 500);
        }
    })
    //delete routes starts here
    .delete("/deleteNote",zValidator("json",deleteNoteSchema),async(c)=>{
        const {noteId,workspaceId}=c.req.valid("json")
        const userId = getUserId(c)
        const membership = await prisma.workspaceMember.findFirst({
            where:{
                workspaceId,
                userId,
            },
            select:{
                role:true,
            }
        })
        if(!membership || membership.role === "VIEWER"){
            return c.json({success:false,message:"Viewer cant delete note"},401);
        }
        try{
            await prisma.note.deleteMany({
                where:{
                    workspaceId,
                    id:noteId,
                }
            })
            return c.json({success:true,message:"Note deleted successfully"},200);
        }catch(error){
            return c.json({ success: false, message: "Internal Server Error" }, 500);
        }
    })