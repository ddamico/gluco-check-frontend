import { DiabetesMetric } from "../enums";
import { NightscoutValidationEndpointResponse } from "../types";

export const MOCK_VALIDATION_ENDPOINT_RESPONSE_VALID: NightscoutValidationEndpointResponse = {
  token: {
    isValid: true,
    parsed: "token123",
  },
  nightscout: {
    minSupportedVersion: "13.0.0",
    glucoseUnit: [
      DiabetesMetric.BloodSugar,
      DiabetesMetric.BloodSugar,
      DiabetesMetric.InsulinOnBoard,
      DiabetesMetric.CarbsOnBoard,
      DiabetesMetric.SensorAge,
      DiabetesMetric.CannulaAge,
      DiabetesMetric.PumpBattery,
    ],
    version: "14.0.7",
  },
};

export const MOCK_VALIDATION_ENDPOINT_RESPONSE_NOT_VALID: NightscoutValidationEndpointResponse = {
  token: {
    isValid: false,
    parsed: "",
  },
};
