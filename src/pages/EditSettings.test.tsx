import React from "react";
import { cleanup, render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import * as firestoreHooks from "react-firebase-hooks/firestore";
import EditSettings, { returnHandleSettingsSave } from "./EditSettings";
import { mockFirebase } from "firestore-jest-mock";
import { mockUser, mockUserDocument } from "../lib/__mocks__/firebase";

expect.extend(toHaveNoViolations);

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

beforeEach(() => {
  mockFirebase({
    database: {
      users: {
        "alf@melmac.com": mockUserDocument,
      },
    },
  });
});

describe("EditSettings", () => {
  it("Renders the component when loading, with no axe violations", async () => {
    // @ts-ignore
    firestoreHooks.useDocument = jest
      .fn()
      .mockReturnValue([undefined, true, undefined]);

    // @ts-ignore
    const { container } = render(
      <EditSettings userDocumentPath="users/alf@melmac.com" />
    );
    expect(container.firstChild).toMatchSnapshot();

    expect(await axe(container)).toHaveNoViolations();
  });

  it("Renders the component when in error state, with no axe violations", async () => {});

  it("Renders the component with data, with no axe violations", async () => {
    const mockDocument = {
      get: jest.fn().mockReturnValue("mock data"),
    };
  });
});

describe("returnHandleSettingsSave", () => {
  it("returns a submit handler", () => {
    // @ts-ignore
    const handler = returnHandleSettingsSave(mockUser);
    expect(handler).toBeInstanceOf(Function);
  });
});
