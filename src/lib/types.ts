import { BloodGlucoseUnits, DiabetesPointer } from "./enums";

export interface GlucoCheckUserDocument {
  defaultPointers: DiabetesPointer[];
  glucoseUnit: BloodGlucoseUnits;
  nightscout: {
    token: string;
    url: string;
  };
}

export type SettingsFormData = {
  defaultPointers: DiabetesPointer[];
  nightscoutUrl: string;
  nightscoutToken: string;
  glucoseUnit: BloodGlucoseUnits;
};
