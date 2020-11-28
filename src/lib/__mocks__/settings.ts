import { BloodGlucoseUnits, DiabetesPointer } from "../enums";
import { SettingsFormData } from "../types";

export const mockFormData: SettingsFormData = {
  defaultPointers: [DiabetesPointer.BloodSugar],
  nightscoutToken: "I am a token",
  nightscoutUrl: "https://example.com",
  glucoseUnit: BloodGlucoseUnits.mgdl,
};
