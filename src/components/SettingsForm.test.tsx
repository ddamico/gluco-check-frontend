import React from "react";
import {
  cleanup,
  findByRole,
  render,
  act,
  prettyDOM,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import { BloodGlucoseUnits } from "../lib/enums";
import SettingsForm from "./SettingsForm";
import { SUBMIT_SETTINGS_FORM } from "../lib/strings";

expect.extend(toHaveNoViolations);

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

describe("SettingsForm component", () => {
  const mockNsUrl = "https://example.com";
  const mockNsToken = "token123";
  const mockGlucoseUnits = BloodGlucoseUnits.mgdl;
  const mockOnSubmit = jest.fn();

  it("renders the component", async () => {
    const { container, findByText, findByLabelText } = render(
      <SettingsForm
        nightscoutToken={mockNsToken}
        nightscoutUrl={mockNsUrl}
        glucoseUnit={mockGlucoseUnits}
        onSubmit={mockOnSubmit}
      />
    );
    const submitButton = await findByText(SUBMIT_SETTINGS_FORM);
    const tokenField = await findByLabelText("Nightscout Token");
    const urlField = await findByLabelText("Nightscout URL");
    const glucoseUnitsSelect = await findByLabelText("Glucose Units");

    expect(container.firstChild).toMatchSnapshot();
    expect(submitButton).not.toBeEnabled();
    expect(tokenField).toHaveValue(mockNsToken);
    expect(urlField).toHaveValue(mockNsUrl);
    expect(glucoseUnitsSelect).toHaveValue(mockGlucoseUnits);
  });

  it("submits the form with the correct values", async () => {
    expect.assertions(1);
    mockOnSubmit.mockImplementationOnce(async (data) => {
      expect(data).toMatchInlineSnapshot(`
        Object {
          "glucoseUnit": "mg/dl",
          "nightscoutToken": "token123token",
          "nightscoutUrl": "https://example.com",
        }
      `);
    });

    const { findByText, findByLabelText } = render(
      <SettingsForm
        nightscoutToken={mockNsToken}
        nightscoutUrl={mockNsUrl}
        glucoseUnit={mockGlucoseUnits}
        onSubmit={mockOnSubmit}
      />
    );
    const submitButton = await findByText(SUBMIT_SETTINGS_FORM);
    const tokenField = await findByLabelText("Nightscout Token");

    act(() => {
      userEvent.type(tokenField, "token");
    });
    act(() => {
      userEvent.click(submitButton);
    });
  });

  it("whatever, error", async () => {
    mockOnSubmit.mockImplementationOnce(async () => {
      throw new Error("To err is human.");
    });

    const { findByText, findByLabelText } = render(
      <SettingsForm
        nightscoutToken={mockNsToken}
        nightscoutUrl={mockNsUrl}
        glucoseUnit={mockGlucoseUnits}
        onSubmit={mockOnSubmit}
      />
    );
    const submitButton = await findByText(SUBMIT_SETTINGS_FORM);
    const tokenField = await findByLabelText("Nightscout Token");

    act(() => {
      userEvent.type(tokenField, "token");
    });
    act(() => {
      userEvent.click(submitButton);
    });
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <SettingsForm
        nightscoutToken={mockNsToken}
        nightscoutUrl={mockNsUrl}
        glucoseUnit={mockGlucoseUnits}
        onSubmit={mockOnSubmit}
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
