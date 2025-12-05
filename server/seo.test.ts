import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("SEO Management", () => {
  // Create a test context
  function createTestContext(): TrpcContext {
    return {
      user: null,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };
  }

  it("should return SEO settings for home page in zh-TW", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.public.getSeo({
      page: "home",
      language: "zh-TW",
    });

    expect(result).toBeDefined();
    expect(result?.page).toBe("home");
    expect(result?.language).toBe("zh-TW");
    expect(result?.title).toContain("Apolnus");
    expect(result?.description).toBeDefined();
  });

  it("should return SEO settings for home page in en", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.public.getSeo({
      page: "home",
      language: "en",
    });

    expect(result).toBeDefined();
    expect(result?.page).toBe("home");
    expect(result?.language).toBe("en");
    expect(result?.title).toContain("Apolnus");
  });

  it("should return null for non-existent page", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.public.getSeo({
      page: "non-existent-page",
      language: "zh-TW",
    });

    expect(result).toBeNull();
  });

  it("should return SEO settings for product-one-x page", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.public.getSeo({
      page: "product-one-x",
      language: "zh-TW",
    });

    expect(result).toBeDefined();
    expect(result?.page).toBe("product-one-x");
    expect(result?.title).toBeDefined();
  });
});
