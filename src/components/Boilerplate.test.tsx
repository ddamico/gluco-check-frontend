import React from "react";
import { cleanup, render } from "@testing-library/react";
import { axe } from "jest-axe";
import Boilerplate from "./Boilerplate";

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

afterEach(cleanup);

describe("Landing page", () => {
  it("renders the component", () => {
    const { container } = render(<Boilerplate />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Boilerplate />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
