import React from "react";
import { cleanup, render } from "@testing-library/react";
import { axe } from "jest-axe";
import Welcome from "./Welcome";

jest.mock("react-i18next", () => ({
  useTranslation: () => {
    return {
      t: jest.fn().mockImplementation((i) => {
        return i;
      }),
    };
  },
  Trans: function (props: any) {
    return <span>{props.i18nKey}</span>;
  },
}));

jest.mock("../components/Onboarding", () => {
  return {
    __esModule: true,
    default: () => {
      return <>Onboarding</>;
    },
  };
});

jest.mock("../components/Boilerplate", () => {
  return {
    __esModule: true,
    default: () => {
      return <>Boilerplate</>;
    },
  };
});

afterEach(cleanup);

describe("Welcome page", () => {
  it("renders the component", () => {
    const { container } = render(<Welcome />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Welcome />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
