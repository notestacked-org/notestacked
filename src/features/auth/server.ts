import { Hono } from "hono";
import { registerSchema, loginSchema } from "./schema";
import { supabaseMiddleware, getSupabase } from "../../lib/supabase/supabaseMiddleware";
import { zValidator } from "@hono/zod-validator";


export const auth = new Hono();

auth.use("*", supabaseMiddleware());
auth.post("/register", zValidator("json", registerSchema), async (c) => {
  const { email, password, username } = c.req.valid("json")
  const supabase = getSupabase(c);
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name:username
        }
      }
    });
    if (error) throw error;
    return c.json({ message: "User registered successfully, please verify your email" }, 200);
  } catch (error) {
    return c.json({ message: (error as Error).message }, 400)
  }
})
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json")
    try {
      const supabase = getSupabase(c)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error;
      return c.json({ message: "User is logged in successfully" }, 200)

    } catch (error) {
      return c.json({ message: (error as Error).message }, 400)
    }
  })
  .get("/logout", async (c) => {

    const supabase = getSupabase(c);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return c.json({ message: "User logged out successfully"},200)

    } catch (error) {
      return c.json({ message: (error as Error).message }, 400)
    }
  })