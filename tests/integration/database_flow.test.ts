import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/db";

describe("Database Integration & Seeding Integrity (Sections 27, 28, 33)", () => {
  beforeAll(async () => {
    // Ensure DB connection
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("verifies seeded users and role assignments", async () => {
    const adminUser = await prisma.user.findUnique({
      where: { email: "curator@offform.art" },
    });
    expect(adminUser).not.toBeNull();
    expect(adminUser?.role).toBe("ADMIN");
    expect(adminUser?.isVerifiedDesigner).toBe(true);

    const sellerUser = await prisma.user.findUnique({
      where: { email: "nullform@offform.art" },
    });
    expect(sellerUser).not.toBeNull();
    expect(sellerUser?.role).toBe("SELLER");
    expect(sellerUser?.isApprovedSeller).toBe(true);

    const memberUser = await prisma.user.findUnique({
      where: { email: "elena@offform.art" },
    });
    expect(memberUser).not.toBeNull();
    expect(memberUser?.role).toBe("MEMBER");
    expect(memberUser?.age).toBeGreaterThanOrEqual(16);
  });

  it("verifies product types and customisation options exist", async () => {
    const products = await prisma.product.findMany({
      include: { customizationOptions: true },
    });

    expect(products.length).toBeGreaterThan(0);

    const customisableProduct = products.find((p) => p.productType === "CUSTOMISABLE");
    expect(customisableProduct).toBeDefined();
    expect(customisableProduct?.customizationOptions.length).toBeGreaterThan(0);

    const readyMadeProduct = products.find((p) => p.productType === "READY_MADE");
    expect(readyMadeProduct).toBeDefined();
    expect(readyMadeProduct?.stock).toBeGreaterThan(0);
  });

  it("verifies versioned platform policy records exist", async () => {
    const policies = await prisma.policyVersion.findMany();
    expect(policies.length).toBeGreaterThanOrEqual(8);

    const terms = policies.find((p) => p.type === "TERMS");
    expect(terms).toBeDefined();
    expect(terms?.version).toBe("1.0.0");

    const privacy = policies.find((p) => p.type === "PRIVACY");
    expect(privacy).toBeDefined();
    expect(privacy?.version).toBe("1.0.0");
  });

  it("verifies pending seller application exists for curator queue", async () => {
    const pendingApp = await prisma.sellerApplication.findFirst({
      where: { status: "PENDING" },
      include: { applicant: true },
    });

    expect(pendingApp).not.toBeNull();
    expect(pendingApp?.businessName).toBe("Atelier Kumo Studio");
    expect(pendingApp?.applicant.age).toBeGreaterThanOrEqual(18);
  });
});

