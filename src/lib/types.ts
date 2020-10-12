import { BloodGlucoseUnits } from "./enums";

export interface GlucoCheckUserDocument {
  defaultPointers: string[];
  glucoseUnit: BloodGlucoseUnits;
  nightscout: {
    token: string;
    url: string;
  };
}

export type SettingsFormData = {
  nightscoutUrl: string;
  nightscoutToken: string;
  glucoseUnit: BloodGlucoseUnits;
};