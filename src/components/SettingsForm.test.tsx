import React from "react";
import { cleanup, render, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import { BloodGlucoseUnits } from "../lib/enums";
import SettingsForm from "./SettingsForm";

expect.extend(toHaveNoViolations);

afterEach(() => {
  jest.resetAllMocks();
  cleanup();
});

describe("SettingsForm component", () => {
  const mockNsUrl = "https://example.com";
  const mockNsToken = "token123";
  const mockGlucoseUnits = BloodGlucoseUnits.mgdl;
  const mockOnSubmit = jest.fn();

  it("renders the component", async () => {
    const { container } = render(
      <SettingsForm
        nightscoutToken={mockNsToken}
        nightscoutUrl={mockNsUrl}
        glucoseUnit={mockGlucoseUnits}
        onSubmit={mockOnSubmit}
      />
    );
    const submitButton = await screen.findByTestId("settings-form-submit");
    const tokenField = await screen.findByTestId("settings-form-field-token");
    const urlField = await screen.findByTestId("settings-form-field-url");
    const glucoseUnitsSelect = await screen.findByTestId(
      "settings-form-field-bg"
    );

    expect(container.firstChild).toMatchSnapshot();
    expect(submitButton).not.toBeEnabled();
    expect(tokenField).toHaveValue(mockNsToken);
    expect(urlField).toHaveValue(mockNsUrl);
    expect(glucoseUnitsSelect).toHaveValue(mockGlucoseUnits);
  });

  it("submits the form and saves settings", async () => {
    expect.assertions(6);
    mockOnSubmit.mockImplementationOnce(async (data) => {
      expect(data.nightscoutUrl).toBe(mockNsUrl);
      expect(data.glucoseUnit).toBe(mockGlucoseUnits);
      expect(data.nightscoutToken).toMatchInlineSnapshot(`"token123token"`);
      return Promise.resolve();
    });

    render(
      <SettingsForm
        nightscoutToken={mockNsToken}
        nightscoutUrl={mockNsUrl}
        glucoseUnit={mockGlucoseUnits}
        onSubmit={mockOnSubmit}
      />
    );
    expect(screen.getByTestId("settings-form")).toBeInTheDocument();
    const submitButton = await screen.findByTestId("settings-form-submit");
    const tokenField = await screen.findByTestId("settings-form-field-token");
    await userEvent.type(tokenField, "token");
    await waitFor(() => {
      userEvent.click(submitButton);
    });
    expect(mockOnSubmit).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByTestId("settings-form-submitted")).toBeInTheDocument();
    });
  });

  it("attempts to save settings and handles submission error", async () => {
    expect.assertions(3);
    mockOnSubmit.mockRejectedValueOnce(new Error("To err is human"));

    render(
      <SettingsForm
        nightscoutToken={mockNsToken}
        nightscoutUrl={mockNsUrl}
        glucoseUnit={mockGlucoseUnits}
        onSubmit={mockOnSubmit}
      />
    );
    expect(screen.getByTestId("settings-form")).toBeInTheDocument();
    const submitButton = await screen.findByTestId("settings-form-submit");
    const tokenField = await screen.findByTestId("settings-form-field-token");
    await userEvent.type(tokenField, "token");
    await waitFor(() => {
      userEvent.click(submitButton);
    });
    expect(mockOnSubmit).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByTestId("settings-form-error")).toBeInTheDocument();
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
