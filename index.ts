import { Hono } from "hono";
import { auth } from "./src/lib/auth";
import { cors } from "hono/cors";

const app = new Hono<{
	Variables: {
		user: typeof auth.$Infer.Session.user | null;
		session: typeof auth.$Infer.Session.session | null
	}
}>();

app.use("*", async (c, next) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers });

  	if (!session) {
    	c.set("user", null);
    	c.set("session", null);
    	await next();
        return;
  	}

  	c.set("user", session.user);
  	c.set("session", session.session);
  	await next();
});

app.use(
	"/api/auth/*", // or replace with "*" to enable cors for all routes
	cors({
		origin: process.env.BETTER_AUTH_URL!,
		allowHeaders: ["Content-Type", "Authorization"],
		allowMethods: ["POST", "GET", "OPTIONS"],
		exposeHeaders: ["Content-Length"],
		maxAge: 600,
		credentials: true,
	}),
);

app.get("/", (c) => c.text(`server time is : ${new Date()}`));

app.on(["POST", "GET"], "/api/auth/*", (c) => {
	return auth.handler(c.req.raw);
});

app.get("/session", (c) => {
	const session = c.get("session")
	const user = c.get("user")
	
	if(!user) return c.body(null, 401);

  	return c.json({
	  session,
	  user
	});
});

export default {
  port: 3000,
  fetch: app.fetch,
};