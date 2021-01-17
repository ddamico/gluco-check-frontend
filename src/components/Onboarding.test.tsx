import React from "react";
import { cleanup, render } from "@testing-library/react";
import { axe } from "jest-axe";
import Onboarding from "./Onboarding";

jest.mock("react-i18next", () => ({
  useTranslation: () => {
    return {
      t: jest.fn().mockImplementation((i) => {
        return i;
      }),
    };
  },
}));

afterEach(cleanup);

describe("Landing page", () => {
  it("renders the component", () => {
    const { container } = render(<Onboarding />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Onboarding />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
