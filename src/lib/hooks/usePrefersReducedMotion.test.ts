import React from "react";
import usePrefersReducedMotion, {
  getInitialState,
} from "./usePrefersReducedMotion";

describe("usePrefersReducedMotion hook", () => {
  const originalMatchMedia = window.matchMedia;
  beforeAll(() => {
    window.matchMedia = jest.fn();
  });
  afterAll(() => {
    window.matchMedia = originalMatchMedia;
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe("getInitialState", () => {
    it("returns false when query matches", () => {
      (window.matchMedia as jest.Mock).mockReturnValueOnce({ matches: true });
      expect(getInitialState()).toBe(false);
    });
    it("returns true when query does not match", () => {
      (window.matchMedia as jest.Mock).mockReturnValueOnce({ matches: false });
      expect(getInitialState()).toBe(true);
    });
  });

  // fdescribe("usePrefersReducedMotion", () => {
  //   const mockStateSetter = jest.fn();
  //   beforeAll(() => {
  //     jest.spyOn(React, "useEffect").mockImplementation((f) => f());
  //     jest
  //       .spyOn(React, "useState")
  //       .mockImplementation((initialValue) => [initialValue, mockStateSetter]);
  //   });
  //   it("does the thing", () => {
  //     expect(usePrefersReducedMotion()).toBe(true);
  //   });
  // });
});
