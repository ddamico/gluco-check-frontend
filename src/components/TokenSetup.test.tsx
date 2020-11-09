import React from "react";
import { cleanup, render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import TokenSetup from "./TokenSetup";

expect.extend(toHaveNoViolations);

afterEach(() => {
  jest.resetAllMocks();
  cleanup();
});

const mockTokenSteps = [
  {
    label: "Step 1 label",
    description: "Step 1 description",
  },
  {
    label: "Step 2 label",
    description: "Step 2 description",
  },
];

jest.mock("react-i18next", () => ({
  useTranslation: () => {
    return {
      t: jest.fn().mockImplementation((i, options) => {
        if (i === "tokenDialog.steps") {
          return mockTokenSteps;
        }
        return i;
      }),
    };
  },
}));

describe("Container component", () => {
  it("renders the component", () => {
    const { container } = render(<TokenSetup />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("has no axe violations", async () => {
    const { container } = render(<TokenSetup />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
