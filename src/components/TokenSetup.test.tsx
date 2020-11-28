import React from "react";
import { cleanup, render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import TokenSetup from "./TokenSetup";

expect.extend(toHaveNoViolations);

afterEach(() => {
  cleanup();
});

jest.mock("react-i18next", () => ({
  useTranslation: () => {
    return {
      t: jest.fn().mockImplementation((i) => {
        return i;
      }),
    };
  },
  Trans: () => {
    return <span>Trans</span>;
  },
}));

describe("TokenSetup component", () => {
  it("renders the component", () => {
    const { container } = render(<TokenSetup />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("has no axe violations", async () => {
    const { container } = render(<TokenSetup />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
