import React from "react";
import { cleanup, render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import * as firestoreHooks from "react-firebase-hooks/firestore";
import EditSettings from "./EditSettings";

expect.extend(toHaveNoViolations);

jest.mock("../lib/firebase.ts");

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

beforeEach(() => {
  // what
});

describe("EditSettings", () => {
  const mockUser = {
    uid: "fred@bedrock.com",
  } as firebase.User;

  it("Renders the component when loading, with no axe violations", async () => {
    // @ts-ignore
    firestoreHooks.useDocument = jest
      .fn()
      .mockReturnValue([undefined, true, undefined]);

    const { container } = render(<EditSettings user={mockUser} />);
    expect(container.firstChild).toMatchSnapshot();

    expect(await axe(container)).toHaveNoViolations();
  });
});
