import { Hono } from "hono";
const app = new Hono();

app.get("/", (c) => c.text(`server time is : ${new Date()}`));

export default {
  port: 3000,
  fetch: app.fetch,
};