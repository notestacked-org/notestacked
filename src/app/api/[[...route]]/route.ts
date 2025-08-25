import { handle } from "hono/vercel";
import {auth} from "@/features/auth/server"
import { Hono } from "hono";

    const app = new Hono().basePath("/api")
    app.route("/auth",auth);
    


export const GET = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const POST = handle(app);
