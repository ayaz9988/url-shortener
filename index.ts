import { Hono } from "hono";
import { auth } from "./src/lib/auth";
import { cors } from "hono/cors";
import authRoute from "./src/routes/v1/auth";

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
	"*", // or replace with "*" to enable cors for all routes
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

app.route("/", authRoute);

export default {
  port: 3000,
  fetch: app.fetch,
};