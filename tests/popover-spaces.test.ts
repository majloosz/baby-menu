import { describe, expect, it } from "vitest";
import {
  POPOVER_BLUR_GRACE_MS,
  POPOVER_BLUR_HIDE_DELAY_MS,
  createPopoverOptions,
  shouldSuppressPopoverBlur,
} from "../src/main/popover";

describe("popover Spaces pinning (issue #117)", () => {
  it("creates a non-fullscreenable, non-movable popover that accepts first mouse", () => {
    const options = createPopoverOptions("/app/preload.js");
    expect(options.fullscreenable).toBe(false);
    expect(options.movable).toBe(false);
    expect(options.acceptFirstMouse).toBe(true);
    expect(options.alwaysOnTop).toBe(true);
    expect(options.show).toBe(false);
  });

  it("suppresses blur-hide during the grace window after show", () => {
    const now = 1_000_000;
    const suppressUntil = now + POPOVER_BLUR_GRACE_MS;
    expect(shouldSuppressPopoverBlur(suppressUntil, now)).toBe(true);
    expect(shouldSuppressPopoverBlur(suppressUntil, now + POPOVER_BLUR_GRACE_MS)).toBe(false);
    expect(shouldSuppressPopoverBlur(0, now)).toBe(false);
  });

  it("uses a hide delay longer than a frame so the tray toggle wins the race", () => {
    expect(POPOVER_BLUR_HIDE_DELAY_MS).toBeGreaterThanOrEqual(100);
    expect(POPOVER_BLUR_GRACE_MS).toBeGreaterThan(POPOVER_BLUR_HIDE_DELAY_MS);
  });
});
