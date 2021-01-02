import { BloodGlucoseUnit, DiabetesMetric } from "../enums";
import { NightscoutValidationEndpointResponse } from "../types";

export const MOCK_NSV_RESPONSE_VALID: NightscoutValidationEndpointResponse = {
  token: {
    isValid: true,
    parsed: "token123",
  },
  url: {
    isValid: true,
    parsed: "https://example.com",
    pointsToNightscout: true,
  },
  nightscout: {
    glucoseUnit: BloodGlucoseUnit.mmoll,
    minSupportedVersion: "13.0.0",
    version: "14.0.7",
  },
  discoveredMetrics: [
    DiabetesMetric.BloodSugar,
    DiabetesMetric.InsulinOnBoard,
    DiabetesMetric.CarbsOnBoard,
    DiabetesMetric.SensorAge,
    DiabetesMetric.CannulaAge,
    DiabetesMetric.PumpBattery,
  ],
};

export const MOCK_NSV_RESPONSE_NON_NS_URL = {
  url: {
    parsed: "https://example.com",
    isValid: true,
    pointsToNightscout: false,
  },
  token: {
    parsed: "",
    isValid: false,
  },
  nightscout: {
    version: "",
    glucoseUnit: "",
    minSupportedVersion: "13.0.0",
  },
  discoveredMetrics: [],
};

export const MOCK_NSV_RESPONSE_INVALID_TOKEN = {
  url: {
    parsed: "https://example.com",
    isValid: true,
    pointsToNightscout: true,
  },
  token: {
    isValid: false,
    parsed: "token1234",
  },
  nightscout: {
    minSupportedVersion: "13.0.0",
    glucoseUnit: "mmol",
    version: "14.0.7",
  },
  discoveredMetrics: ["blood sugar"],
};
