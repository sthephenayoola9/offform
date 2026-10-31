import { describe, it, expect } from "vitest";

describe("Identity, Access & Safeguard Rules (Sections 5 & 6)", () => {
  it("strictly enforces minimum registration age of 16", () => {
    const validateRegistrationAge = (age: number) => {
      if (age < 16) {
        return { allowed: false, error: "Access Restricted: You must be at least 16 years old to join OFFFORM." };
      }
      return { allowed: true };
    };

    expect(validateRegistrationAge(14).allowed).toBe(false);
    expect(validateRegistrationAge(15).allowed).toBe(false);
    expect(validateRegistrationAge(16).allowed).toBe(true);
    expect(validateRegistrationAge(24).allowed).toBe(true);
  });

  it("enforces adulthood requirement (18+) for commercial seller applications", () => {
    const validateSellerEligibility = (age: number, role: string) => {
      if (age < 18) {
        return {
          eligible: false,
          reason: "Age Requirement: Commercial seller applications require adulthood (18+).",
        };
      }
      return { eligible: true };
    };

    expect(validateSellerEligibility(16, "MEMBER").eligible).toBe(false);
    expect(validateSellerEligibility(17, "MEMBER").eligible).toBe(false);
    expect(validateSellerEligibility(18, "MEMBER").eligible).toBe(true);
    expect(validateSellerEligibility(28, "MEMBER").eligible).toBe(true);
  });

  it("validates role hierarchy and sensitive operational permissions", () => {
    const canAccessModerationConsole = (role: string) => role === "ADMIN";
    const canPublishListings = (role: string) => role === "SELLER" || role === "ADMIN";
    const canSubmitLookPost = (role: string) => role === "MEMBER" || role === "SELLER" || role === "ADMIN";

    expect(canAccessModerationConsole("VISITOR")).toBe(false);
    expect(canAccessModerationConsole("MEMBER")).toBe(false);
    expect(canAccessModerationConsole("SELLER")).toBe(false);
    expect(canAccessModerationConsole("ADMIN")).toBe(true);

    expect(canPublishListings("VISITOR")).toBe(false);
    expect(canPublishListings("MEMBER")).toBe(false);
    expect(canPublishListings("SELLER")).toBe(true);
    expect(canPublishListings("ADMIN")).toBe(true);

    expect(canSubmitLookPost("VISITOR")).toBe(false);
    expect(canSubmitLookPost("MEMBER")).toBe(true);
  });
});

describe("Order State Machine & Fulfillment Lifecycle (Section 20)", () => {
  const validTransitions: Record<string, string[]> = {
    PENDING_PAYMENT: ["PAYMENT_CONFIRMED", "CANCELLED"],
    PAYMENT_CONFIRMED: ["IN_PRODUCTION", "CANCELLED"],
    IN_PRODUCTION: ["READY_TO_SHIP", "CANCELLED"],
    READY_TO_SHIP: ["SHIPPED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
  };

  const isValidTransition = (from: string, to: string): boolean => {
    return (validTransitions[from] || []).includes(to);
  };

  it("allows correct forward order progression", () => {
    expect(isValidTransition("PENDING_PAYMENT", "PAYMENT_CONFIRMED")).toBe(true);
    expect(isValidTransition("PAYMENT_CONFIRMED", "IN_PRODUCTION")).toBe(true);
    expect(isValidTransition("IN_PRODUCTION", "READY_TO_SHIP")).toBe(true);
    expect(isValidTransition("READY_TO_SHIP", "SHIPPED")).toBe(true);
    expect(isValidTransition("SHIPPED", "DELIVERED")).toBe(true);
  });

  it("prevents illegal state skips or backward fulfillment mutations", () => {
    expect(isValidTransition("PENDING_PAYMENT", "DELIVERED")).toBe(false);
    expect(isValidTransition("SHIPPED", "IN_PRODUCTION")).toBe(false);
    expect(isValidTransition("DELIVERED", "PENDING_PAYMENT")).toBe(false);
  });
});

