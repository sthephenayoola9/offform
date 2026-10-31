import { describe, it, expect } from "vitest";

describe("Customisation Rules & Option Pricing Engine (Section 11 & 12)", () => {
  interface CustomOption {
    label: string;
    extra: number;
  }

  interface ProductConfig {
    basePrice: number;
    supportedOptions: Record<string, CustomOption[]>;
  }

  const sampleGarment: ProductConfig = {
    basePrice: 310.0,
    supportedOptions: {
      "Distressing Level": [
        { label: "Moderate Editorial Laddering", extra: 0 },
        { label: "Heavy Asymmetrical Shredding", extra: 25 },
        { label: "Raw Unfinished Distressed Hem Only", extra: 0 },
      ],
      "Colorway Wash": [
        { label: "Ashen Charcoal / Bone", extra: 0 },
        { label: "Oxidized Crimson & Rust (+ Hand Overdye)", extra: 40 },
        { label: "Raw Unbleached Ecru", extra: 0 },
      ],
    },
  };

  const calculateTotalPrice = (
    garment: ProductConfig,
    selections: Record<string, string>
  ) => {
    let total = garment.basePrice;

    for (const [groupName, chosenLabel] of Object.entries(selections)) {
      const groupOptions = garment.supportedOptions[groupName];
      if (!groupOptions) {
        throw new Error(`Unsupported option group: ${groupName}`);
      }
      const match = groupOptions.find((opt) => opt.label === chosenLabel);
      if (!match) {
        throw new Error(`Option "${chosenLabel}" not permitted for group "${groupName}"`);
      }
      total += match.extra;
    }

    return total;
  };

  it("calculates base price when selecting standard options with 0 extra", () => {
    const selections = {
      "Distressing Level": "Moderate Editorial Laddering",
      "Colorway Wash": "Ashen Charcoal / Bone",
    };

    const price = calculateTotalPrice(sampleGarment, selections);
    expect(price).toBe(310.0);
  });

  it("accurately adds designer-configured upcharges for specialized treatments", () => {
    const selections = {
      "Distressing Level": "Heavy Asymmetrical Shredding", // +25
      "Colorway Wash": "Oxidized Crimson & Rust (+ Hand Overdye)", // +40
    };

    const price = calculateTotalPrice(sampleGarment, selections);
    expect(price).toBe(375.0); // 310 + 25 + 40
  });

  it("rejects unpermitted customisation options not authorized by the designer", () => {
    const invalidSelections = {
      "Distressing Level": "Neon Glitter Spray", // Unauthorized
    };

    expect(() => calculateTotalPrice(sampleGarment, invalidSelections)).toThrowError(
      /Option "Neon Glitter Spray" not permitted/
    );
  });
});

