// src/route/v1/auth.ts
import { Hono } from "hono";
import auth from "../../../lib/auth";
import { signin, signout, signup, changePassword } from "./controller";

const authRoute = new Hono().basePath("/v1/api/auth");

// Signin endpoint
authRoute.post("/signin", signin);

// Signout endpoint
authRoute.post("/signout", signout);

// Signup endpoint
authRoute.post("/signup", signup);

// Change password endpoint
authRoute.post("/change-password", changePassword);

export default authRoute;