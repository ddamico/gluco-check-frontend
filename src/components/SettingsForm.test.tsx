import React from "react";
import {
  cleanup,
  render,
  waitFor,
  screen,
  act,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import { BloodGlucoseUnit, DiabetesMetric } from "../lib/enums";
import SettingsForm, { returnHandleOpenTokenDialog } from "./SettingsForm";
import { NightscoutValidationClient } from "../lib/NightscoutValidationClient/NightscoutValidationClient";
import {
  mockNsvResponseDtoInvalidToken,
  mockNsvResponseDtoNonNsUrl,
  mockNsvResponseDtoNsNeedsUpgrade,
} from "../lib/__mocks__/gluco-check";

expect.extend(toHaveNoViolations);

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

afterEach(() => {
  jest.resetAllMocks();
  cleanup();
});

describe("SettingsForm component", () => {
  const mockNsUrl = "https://example.com/ns";
  const mockNsToken = "token123";
  const mockGlucoseUnits = BloodGlucoseUnit.mgdl;
  const mockDefaultMetrics = [DiabetesMetric.BloodSugar];
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockReset();
  });

  it("renders the component", async () => {
    const { container } = render(
      <SettingsForm
        nightscoutToken={mockNsToken}
        nightscoutUrl={mockNsUrl}
        glucoseUnit={mockGlucoseUnits}
        defaultMetrics={mockDefaultMetrics}
        onSubmit={mockOnSubmit}
      />
    );
    const tokenField = await screen.findByTestId("settings-form-field-token");
    const urlField = await screen.findByTestId("settings-form-field-url");
    const glucoseUnitsSelect = await screen.findByTestId(
      "settings-form-field-bg"
    );

    expect(container.firstChild).toMatchSnapshot();
    expect(tokenField).toHaveValue(mockNsToken);
    expect(urlField).toHaveValue(mockNsUrl);
    expect(glucoseUnitsSelect).toHaveValue(mockGlucoseUnits);
  });

  it("submits the form and saves settings", async () => {
    expect.assertions(12);
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
        defaultMetrics={mockDefaultMetrics}
        onSubmit={mockOnSubmit}
        alertAutohideDuration={200}
      />
    );
    expect(screen.getByTestId("settings-form")).toBeInTheDocument();
    const submitButton = await screen.findByTestId("settings-form-submit");
    const tokenField = await screen.findByTestId("settings-form-field-token");
    const checkboxEverything = await screen.getByLabelText("everything", {
      exact: false,
    });
    const checkbox1 = await screen.getByLabelText("insulin on board", {
      exact: false,
    });
    const checkbox2 = await screen.getByLabelText("blood sugar", {
      exact: false,
    });

    await act(async () => {
      await userEvent.click(checkboxEverything);
    });
    expect(checkbox1).toBeDisabled();
    expect(checkbox1).toBeChecked();
    expect(checkbox2).toBeDisabled();
    expect(checkbox2).toBeChecked();

    await act(async () => {
      await userEvent.click(checkboxEverything);
    });
    expect(checkbox1).not.toBeDisabled();
    expect(checkbox2).not.toBeDisabled();

    await act(async () => {
      await userEvent.click(checkbox1);
      await userEvent.click(checkbox2);

      await userEvent.type(tokenField, "token");
      await userEvent.click(submitButton);
    });
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.getByTestId("settings-form-submitted")).toBeInTheDocument();
    });

    await waitForElementToBeRemoved(() =>
      screen.getByTestId("settings-form-submitted")
    );
  });

  it("attempts to save settings and handles submission error", async () => {
    expect.assertions(3);
    mockOnSubmit.mockRejectedValueOnce(new Error("To err is human"));

    render(
      <SettingsForm
        nightscoutToken={mockNsToken}
        nightscoutUrl={mockNsUrl}
        glucoseUnit={mockGlucoseUnits}
        defaultMetrics={mockDefaultMetrics}
        onSubmit={mockOnSubmit}
      />
    );
    expect(screen.getByTestId("settings-form")).toBeInTheDocument();
    const submitButton = await screen.findByTestId("settings-form-submit");
    const tokenField = await screen.findByTestId("settings-form-field-token");

    await act(async () => {
      await userEvent.type(tokenField, "token");
      await userEvent.click(submitButton);
    });
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.getByTestId("settings-form-error")).toBeInTheDocument();
    });
  });

  describe("Nightscout validation", () => {
    const mockNsvUrl = "https://example.com";
    const nsvClient = new NightscoutValidationClient({
      endpointUrl: mockNsvUrl,
    });
    const mockValidationMethodSpy = jest.spyOn(
      nsvClient,
      "fetchValidationStatus"
    );

    beforeEach(() => {
      mockValidationMethodSpy.mockReset();
    });

    it("Displays warning message for not-a-nightscout site", async () => {
      mockValidationMethodSpy.mockResolvedValue(mockNsvResponseDtoNonNsUrl);

      render(
        <SettingsForm
          nightscoutToken={mockNsToken}
          nightscoutUrl={mockNsUrl}
          glucoseUnit={mockGlucoseUnits}
          defaultMetrics={mockDefaultMetrics}
          onSubmit={mockOnSubmit}
          nightscoutValidator={nsvClient}
          validationDebounceDuration={0}
        />
      );

      expect(
        await screen.findByText(
          "settings.form.helperText.nightscoutUrl.notNightscout"
        )
      ).toBeTruthy();
    });

    it("Displays warning message for a nightscout site below minimum version threshold", async () => {
      mockValidationMethodSpy.mockResolvedValue(
        mockNsvResponseDtoNsNeedsUpgrade
      );

      render(
        <SettingsForm
          nightscoutToken={mockNsToken}
          nightscoutUrl={mockNsUrl}
          glucoseUnit={mockGlucoseUnits}
          defaultMetrics={mockDefaultMetrics}
          onSubmit={mockOnSubmit}
          nightscoutValidator={nsvClient}
          validationDebounceDuration={0}
        />
      );

      expect(
        await screen.findByText(
          "settings.form.helperText.nightscoutUrl.needsUpgrade"
        )
      ).toBeTruthy();
    });

    it("Displays warning message for empty token", async () => {
      mockValidationMethodSpy.mockResolvedValue(mockNsvResponseDtoInvalidToken);

      render(
        <SettingsForm
          nightscoutToken={""}
          nightscoutUrl={mockNsUrl}
          glucoseUnit={mockGlucoseUnits}
          defaultMetrics={mockDefaultMetrics}
          onSubmit={mockOnSubmit}
          nightscoutValidator={nsvClient}
          validationDebounceDuration={0}
        />
      );

      expect(
        await screen.findByText(
          "settings.form.helperText.nightscoutToken.empty"
        )
      ).toBeTruthy();
    });

    it("Displays warning message for invalid token", async () => {
      mockValidationMethodSpy.mockResolvedValue(mockNsvResponseDtoInvalidToken);

      render(
        <SettingsForm
          nightscoutToken={mockNsToken}
          nightscoutUrl={mockNsUrl}
          glucoseUnit={mockGlucoseUnits}
          defaultMetrics={mockDefaultMetrics}
          onSubmit={mockOnSubmit}
          nightscoutValidator={nsvClient}
          validationDebounceDuration={0}
        />
      );

      expect(
        await screen.findByText(
          "settings.form.helperText.nightscoutToken.invalid"
        )
      ).toBeTruthy();
    });

    it("Displays warning message for unsupported metrics", async () => {
      const allMetrics = [
        DiabetesMetric.BloodSugar,
        DiabetesMetric.CannulaAge,
        DiabetesMetric.CarbsOnBoard,
        DiabetesMetric.InsulinOnBoard,
        DiabetesMetric.PumpBattery,
        DiabetesMetric.SensorAge,
      ];
      mockValidationMethodSpy.mockResolvedValue(mockNsvResponseDtoInvalidToken);

      render(
        <SettingsForm
          nightscoutToken={mockNsToken}
          nightscoutUrl={mockNsUrl}
          glucoseUnit={mockGlucoseUnits}
          defaultMetrics={allMetrics}
          onSubmit={mockOnSubmit}
          nightscoutValidator={nsvClient}
          validationDebounceDuration={0}
        />
      );

      expect(
        await screen.findByText(
          "settings.form.helperText.defaultMetrics.notAvailable"
        )
      ).toBeTruthy();
    });
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <SettingsForm
        nightscoutToken={mockNsToken}
        nightscoutUrl={mockNsUrl}
        glucoseUnit={mockGlucoseUnits}
        defaultMetrics={mockDefaultMetrics}
        onSubmit={mockOnSubmit}
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("returnHandleOpenTokenDialog", () => {
  it("returns the curried handler", () => {
    const mockHandler = jest.fn();
    const mockState = true;
    const handler = returnHandleOpenTokenDialog(mockState, mockHandler);
    expect(handler).toMatchInlineSnapshot(`[Function]`);
    handler();
    expect(mockHandler).toHaveBeenCalledWith(!mockState);
  });
});
