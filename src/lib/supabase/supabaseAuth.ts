import {  MiddlewareHandler} from "hono"
import { getSupabase } from "./supabaseMiddleware"
import { Context } from "hono";

export const supabaseAuth=():MiddlewareHandler => {
    return async (c, next) => {
    const supabase = getSupabase(c);
    if(supabase===undefined){
        return c.json({ message: "Supabase client not found" ,success:false}, 500);
    }
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return c.json({ message: "Unauthorized" ,success:false}, 400);
        }
        c.set("userId", user.id);
        await next();
    } catch (error) {
        return c.json({ message: (error as Error).message ,success:false}, 400);
    }
}}

export const getUserId = (c: Context) => {
    return c.get("userId");
}

