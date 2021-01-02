import { BloodGlucoseUnits, DiabetesMetric } from "../enums";
import { NightscoutValidationEndpointResponse } from "../types";

export const MOCK_VALIDATION_ENDPOINT_RESPONSE_VALID: NightscoutValidationEndpointResponse = {
  token: {
    isValid: true,
    parsed: "token123",
  },
  url: {
    isValid: true,
    parsed: "",
    pointsToNightscout: true
  },
  nightscout: {
    glucoseUnit: BloodGlucoseUnits.mmoll,
    minSupportedVersion: "13.0.0",
    version: "14.0.7",
  },
  discoveredMetrics: [
      DiabetesMetric.BloodSugar,
      DiabetesMetric.BloodSugar,
      DiabetesMetric.InsulinOnBoard,
      DiabetesMetric.CarbsOnBoard,
      DiabetesMetric.SensorAge,
      DiabetesMetric.CannulaAge,
      DiabetesMetric.PumpBattery,
    ]
};
