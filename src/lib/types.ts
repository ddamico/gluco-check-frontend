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
  token: {
    isValid: boolean;
    parsed: string;
  };
  nightscout?: {
    minSupportedVersion: string;
    glucoseUnit: DiabetesMetric[];
    version: string;
  };
};
