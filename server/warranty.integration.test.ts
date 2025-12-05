import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createTestContext(): TrpcContext {
  return {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("warranty.register integration", () => {
  it("should successfully register a warranty and store in database", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const testData = {
      name: "Integration Test User",
      email: "integration@test.com",
      phone: "0987654321",
      productModel: "One X",
      serialNumber: `TEST-${Date.now()}`,
      purchaseDate: new Date().toISOString(),
      purchaseChannel: "Official Website",
      notes: "Integration test warranty registration",
    };

    const result = await caller.warranty.register(testData);

    expect(result).toHaveProperty("success", true);
    expect(result).toHaveProperty("id");
    expect(typeof result.id).toBe("number");
    expect(result.id).toBeGreaterThan(0);
  });

  it("should fail when required field 'name' is empty", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const invalidData = {
      name: "",
      email: "test@example.com",
      phone: "0912345678",
      productModel: "One X",
      serialNumber: "TEST123456",
      purchaseDate: new Date().toISOString(),
    };

    await expect(caller.warranty.register(invalidData as any)).rejects.toThrow();
  });

  it("should fail when email format is invalid", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const invalidData = {
      name: "Test User",
      email: "invalid-email",
      phone: "0912345678",
      productModel: "One X",
      serialNumber: "TEST123456",
      purchaseDate: new Date().toISOString(),
    };

    await expect(caller.warranty.register(invalidData as any)).rejects.toThrow();
  });
});
