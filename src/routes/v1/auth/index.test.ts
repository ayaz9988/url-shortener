import { describe, it, expect, beforeEach, vi } from "bun:test";
import authRoute from "./index";
import { Hono } from "hono";
import auth from "../../../lib/auth";

// Create a test app that includes the auth routes
const createApp = () => {
  const app = new Hono();
  app.route("/", authRoute);
  return app;
};

describe("Auth Routes", () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    app = createApp();
    vi.clearAllMocks();
  });

  describe("POST /v1/api/auth/signin", () => {
    it("should return session on successful signin", async () => {
      const mockSession = {
        session: {
          token: "test-token",
          expiresAt: new Date().toISOString(),
        },
        user: {
          id: "user-1",
          email: "test@example.com",
          name: "Test User",
        },
      };

      // @ts-ignore - Mock the auth API
      auth.api.signInEmail = vi.fn().mockResolvedValue(mockSession);

      const res = await app.request("/v1/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });

      expect(res.status).toBe(200);
      const data = await res.json() as { session: typeof mockSession };
      expect(data.session).toEqual(mockSession);
    });

    it("should return 400 when email is missing", async () => {
      const res = await app.request("/v1/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: "password123" }),
      });

      expect(res.status).toBe(400);
    });

    it("should return 400 when password is missing", async () => {
      const res = await app.request("/v1/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      expect(res.status).toBe(400);
    });
  });

  describe("POST /v1/api/auth/signup", () => {
    it("should return user on successful signup", async () => {
      const mockUser = {
        id: "user-1",
        email: "new@example.com",
        name: "New User",
      };

      // @ts-ignore - Mock the auth API returns user object directly
      auth.api.signUpEmail = vi.fn().mockResolvedValue(mockUser);

      const res = await app.request("/v1/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "new@example.com",
          password: "password123",
          name: "New User",
        }),
      });

      expect(res.status).toBe(200);
      const data = await res.json() as { user: typeof mockUser };
      expect(data.user).toEqual(mockUser);
    });

    it("should return 400 when email is missing", async () => {
      const res = await app.request("/v1/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: "password123",
          name: "New User",
        }),
      });

      expect(res.status).toBe(400);
    });

    it("should return 400 when password is missing", async () => {
      const res = await app.request("/v1/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "new@example.com",
        }),
      });

      expect(res.status).toBe(400);
    });
  });

  describe("POST /v1/api/auth/signout", () => {
    it("should return success on successful signout", async () => {
      // @ts-ignore - Mock the auth API
      auth.api.signOut = vi.fn().mockResolvedValue(undefined);

      const res = await app.request("/v1/api/auth/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer test-token",
        },
      });

      expect(res.status).toBe(200);
      const data = await res.json() as { success: boolean };
      expect(data.success).toBe(true);
    });
  });

  describe("POST /v1/api/auth/change-password", () => {
    it("should return success on successful password change", async () => {
      // @ts-ignore - Mock the auth API
      auth.api.changePassword = vi.fn().mockResolvedValue(undefined);

      const res = await app.request("/v1/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer test-token",
        },
        body: JSON.stringify({
          currentPassword: "oldPassword123",
          newPassword: "newPassword456",
        }),
      });

      expect(res.status).toBe(200);
      const data = await res.json() as { success: boolean };
      expect(data.success).toBe(true);
    });

    it("should return 400 when newPassword is missing", async () => {
      const res = await app.request("/v1/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: "oldPassword123" }),
      });

      expect(res.status).toBe(400);
    });

    it("should return 400 when currentPassword is missing", async () => {
      const res = await app.request("/v1/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: "newPassword456" }),
      });

      expect(res.status).toBe(400);
    });
  });
});
