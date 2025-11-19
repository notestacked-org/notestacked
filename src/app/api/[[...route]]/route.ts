import { handle } from "hono/vercel";
import { auth } from "@/features/auth/server"
import { workspace } from "@/features/workspace/server"
import { Hono } from "hono";
import { notesRouter } from "@/features/notes/server";
const app = new Hono()
    .route("/api/auth", auth)
    .route("/api/workspace", workspace)
    .route("/api/notes", notesRouter);
export type appType = typeof app;



export const GET = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const POST = handle(app);
