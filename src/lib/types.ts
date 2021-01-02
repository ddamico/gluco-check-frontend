import { BloodGlucoseUnits, DiabetesMetric } from "./enums";

export interface GlucoCheckUserDocument {
  defaultMetrics: DiabetesMetric[];
  glucoseUnit: BloodGlucoseUnits;
  nightscout: {
    token: string;
    url: string;
  };
}

export type SettingsFormData = {
  defaultMetrics: DiabetesMetric[];
  nightscoutUrl: string;
  nightscoutToken: string;
  glucoseUnit: BloodGlucoseUnits;
};

export type NightscoutValidationEndpointRequest = {};

export type NightscoutValidationEndpointResponse = {
  url: {
    isValid: boolean;
    parsed: string;
    pointsToNightscout: boolean;
  };
  token?: {
    isValid: boolean;
    parsed: string;
  };
  nightscout?: {
    glucoseUnit: BloodGlucoseUnits;
    minSupportedVersion: string;
    version: string;
  };
  discoveredMetrics?: DiabetesMetric[];
};
