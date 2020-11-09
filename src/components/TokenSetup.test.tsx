import React from "react";
import {
  cleanup,
  render,
  waitFor,
  screen,
  prettyDOM,
} from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import TokenSetup from "./TokenSetup";
import userEvent from "@testing-library/user-event";

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
  {
    label: "Step 3 label",
    description: "Step 3 description",
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

  it("can step through the component's steps", async () => {
    const { container } = render(<TokenSetup />);
    let nextButton: HTMLElement | null, backButton: HTMLElement | null;

    // can traverse stepper forward
    for (let n = 0; n <= mockTokenSteps.length; n++) {
      nextButton = await screen.queryByTestId("token-stepper-next");
      if (nextButton) {
        await waitFor(() => {
          userEvent.click(nextButton);
        });
        expect(container.firstChild).toMatchSnapshot(`Step ${n}, forward`);
      }
    }

    // can traverse stepper backward
    for (let i = 0; i <= mockTokenSteps.length; i++) {
      backButton = await screen.queryByTestId("token-stepper-back");
      if (backButton) {
        await waitFor(() => {
          userEvent.click(backButton);
        });
        expect(container.firstChild).toMatchSnapshot(`Step ${i}, backward`);
      }
    }
  });

  it("has no axe violations", async () => {
    const { container } = render(<TokenSetup />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
