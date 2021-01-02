import { BloodGlucoseUnit, DiabetesMetric } from "./enums";

export interface GlucoCheckUserDocument {
  defaultMetrics: DiabetesMetric[];
  glucoseUnit: BloodGlucoseUnit;
  nightscout: {
    token: string;
    url: string;
  };
}

export type SettingsFormData = {
  defaultMetrics: DiabetesMetric[];
  nightscoutUrl: string;
  nightscoutToken: string;
  glucoseUnit: BloodGlucoseUnit;
};

export type NightscoutValidationEndpointRequest = {};

export type NightscoutValidationEndpointResponse = {
  url: {
    isValid: boolean;
    parsed: string;
    pointsToNightscout: boolean;
  };
  token: {
    isValid: boolean;
    parsed: string;
  };
  nightscout: {
    glucoseUnit: BloodGlucoseUnit;
    minSupportedVersion: string;
    version: string;
  };
  discoveredMetrics: DiabetesMetric[];
};
