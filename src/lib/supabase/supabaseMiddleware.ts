import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { MiddlewareHandler, type Context } from "hono";
import { setCookie } from "hono/cookie";

declare module "hono"{
    interface ContextVariableMap{
        supabase : SupabaseClient
    }
}

export const getSupabase = (c:Context) => {
    return c.get("supabase");
}

export const supabaseMiddleware = () : MiddlewareHandler=>{
    return async(c,next)=>{
        const supabase = createServerClient(process.env.SUPABASE_URL!,process.env.SUPABASE_ANON_KEY!,{
            cookies:{
                getAll:()=>{
                    return parseCookieHeader(c.req.header("Cookie") ?? "") as {name:string,value:string}[] | null;
                },
                setAll:(cookies:{
                    name:string,
                    value:string,
                    options:{[key:string]:any}
                }[])=>{
                    cookies.forEach(({name,value,options})=> setCookie(c,name,value,options))
                    }
                }
            });
            c.set("supabase",supabase)
            await next();
        }
    }

