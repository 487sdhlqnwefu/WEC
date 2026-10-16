import { describe, expect, it } from "vitest";
import {
  COLOURS,
  COMPETITORS,
  CONTACT,
  FORBIDDEN,
  HOME,
  HOW,
  LUCK,
  NAV,
  SITTERS,
  WBT_PATHS,
  WEC_PAGE,
} from "./copy";

function flatten(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(flatten).join("\n");
  if (value && typeof value === "object") {
    return Object.values(value).map(flatten).join("\n");
  }
  return "";
}

const ALL_COPY = flatten({
  HOME,
  HOW,
  SITTERS,
  COMPETITORS,
  LUCK,
  WEC_PAGE,
  CONTACT,
  COLOURS,
  NAV,
});

describe("WBT public copy", () => {
  it("covers the seven required pages", () => {
    expect(NAV.map((item) => item.href)).toEqual([
      WBT_PATHS.home,
      WBT_PATHS.how,
      WBT_PATHS.sitters,
      WBT_PATHS.competitors,
      WBT_PATHS.luck,
      WBT_PATHS.wec,
      WBT_PATHS.contact,
    ]);
  });

  it("uses the four café colours only", () => {
    expect(COLOURS.map((c) => c.name)).toEqual(["Brown", "Gold", "Red", "Purple"]);
  });

  it("states the locked facts", () => {
    expect(ALL_COPY).toMatch(/no world’s best coffee/i);
    expect(ALL_COPY).toMatch(/for you/);
    expect(ALL_COPY).toMatch(/two (cups|drinks)/i);
    expect(ALL_COPY).toMatch(/espresso and filter/i);
    expect(ALL_COPY).toMatch(/two to five café coffees/);
    expect(ALL_COPY).toMatch(/Field of 16|Sixteen baristas/);
    expect(ALL_COPY).toMatch(/name the luck/i);
    expect(ALL_COPY).not.toMatch(/judging app/i);
  });

  it("keeps WEC as a sibling, not a replacement", () => {
    expect(WEC_PAGE.h1).toContain("WEC is the espresso knockout");
    expect(WEC_PAGE.h1).toContain("WBT is the café tournament");
    expect(ALL_COPY).toMatch(/does not seed WBT|does not crown WBT/);
  });

  it("avoids never-claim language", () => {
    const lower = ALL_COPY.toLowerCase();
    for (const phrase of FORBIDDEN) {
      expect(lower, phrase).not.toContain(phrase.toLowerCase());
    }
  });
});
