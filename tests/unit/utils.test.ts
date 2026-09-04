import { describe, it, expect } from "vitest";
import { formatINR, initials, timeAgo, cn } from "@/lib/utils";

describe("formatINR", () => {
  it("formats paise as INR currency", () => {
    expect(formatINR(99900)).toBe("₹999");
  });
  it("rounds to nearest rupee", () => {
    expect(formatINR(29900)).toBe("₹299");
  });
});

describe("initials", () => {
  it("returns first letters of up to two words", () => {
    expect(initials("Arjun Sharma")).toBe("AS");
  });
  it("handles a single word", () => {
    expect(initials("Madonna")).toBe("M");
  });
});

describe("timeAgo", () => {
  it("returns 'just now' for very recent timestamps", () => {
    expect(timeAgo(new Date().toISOString())).toBe("just now");
  });
  it("returns hours for timestamps within a day", () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 3600_000).toISOString();
    expect(timeAgo(twoHoursAgo)).toBe("2h ago");
  });
});

describe("cn", () => {
  it("merges class names and resolves tailwind conflicts", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});
