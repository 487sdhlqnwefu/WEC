import { describe, expect, it } from "vitest";
import {
  isActiveWbtPath,
  isUmbrellaHost,
  isWbtRootHost,
  wbtHref,
  wbtPathKey,
  wecHomeHref,
} from "./host";

describe("WBT host routing", () => {
  it("keeps WBT under /wbt on the WEC app and the umbrella", () => {
    expect(isWbtRootHost("localhost")).toBe(false);
    expect(isUmbrellaHost("worldcoffeetournaments.com")).toBe(true);
    expect(wbtHref("home", "localhost")).toBe("/wbt");
    expect(wbtHref("festival", "worldcoffeetournaments.com")).toBe("/wbt/festival");
    expect(wecHomeHref("localhost")).toBe("/");
    expect(wecHomeHref("worldcoffeetournaments.com")).toBe("/");
  });

  it("uses root paths on worldbaristatournament.com", () => {
    expect(isWbtRootHost("worldbaristatournament.com")).toBe(true);
    expect(wbtHref("home", "www.worldbaristatournament.com")).toBe("/");
    expect(wbtHref("sitters", "worldbaristatournament.com")).toBe("/sitters");
    expect(wecHomeHref("worldbaristatournament.com")).toBe(
      "https://worldespressochampionship.com",
    );
  });

  it("treats /wbt and root aliases as the same page key", () => {
    expect(wbtPathKey("/wbt")).toBe("/");
    expect(wbtPathKey("/wbt/festival")).toBe("/festival");
    expect(wbtPathKey("/festival")).toBe("/festival");
    expect(isActiveWbtPath("/wbt/results", "results")).toBe(true);
    expect(isActiveWbtPath("/results", "results")).toBe(true);
    expect(isActiveWbtPath("/wbt", "home")).toBe(true);
  });
});
