import type { Context } from "hono";
import auth from "../../../lib/auth";

type AuthContext = Context<{
    Variables: {
        user: typeof auth.$Infer.Session.user | null;
        session: typeof auth.$Infer.Session.session | null;
    };
}, "*", any>;

export const signin = async (c: AuthContext) => {
  try {
    const { email, password } = await c.req.json();
    if (!email) {
      return c.json({ error: "Email is required" }, 400);
    }
    if (!password) {
      return c.json({ error: "Password is required" }, 400);
    }
    const session = await auth.api.signInEmail({
      body: { 
        email,
        password,
      }
    });
    return c.json({ session });
  } catch (error) {
    return c.json({ error: "Invalid request" }, 400);
  }
}

export const signout = async (c: AuthContext) => {
  await auth.api.signOut({
    headers: c.req.header(),
  });
  return c.json({ success: true });
}

export const signup = async (c: AuthContext) => {
  try {
    const { name, email, password } = await c.req.json();
    if (!email) {
      return c.json({ error: "Email is required" }, 400);
    }
    if (!password) {
      return c.json({ error: "Password is required" }, 400);
    }
    const user = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });
    return c.json({ user });
  } catch (error) {
    return c.json({ error: "Invalid request" }, 400);
  }
}

export const changePassword = async (c: AuthContext) => {
  try {
    const { newPassword, currentPassword } = await c.req.json();
    if (!newPassword) {
      return c.json({ error: "New password is required" }, 400);
    }
    if (!currentPassword) {
      return c.json({ error: "Current password is required" }, 400);
    }
    await auth.api.changePassword({
      body: { 
        newPassword,
        currentPassword,
      },
    });
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: "Invalid request" }, 400);
  }
}