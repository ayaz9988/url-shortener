// src/route/v1/auth.ts
import { Hono } from "hono";
import auth from "../../lib/auth";

const authRoute = new Hono().basePath("/v1/api/auth");

// Signin endpoint
authRoute.post("/signin", async (c) => {
  const { email, password } = await c.req.json();
  const session = await auth.api.signInEmail({
    body: { 
      email,
      password,
    }
  });
  return c.json({ session });
});

// Signout endpoint
authRoute.post("/signout", async (c) => {
  await auth.api.signOut({
    headers: c.req.header(),
  });
  return c.json({ success: true });
});

// Signup endpoint
authRoute.post("/signup", async (c) => {
  const { name, email, password } = await c.req.json();
  const user = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
    },
  });
  return c.json({ user });
});

// Change password endpoint
authRoute.post("/change-password", async (c) => {
  const { newPassword, currentPassword } = await c.req.json();
  await auth.api.changePassword({
    body: { 
      newPassword,
      currentPassword,
    },
  });
  return c.json({ success: true });
});

export default authRoute;