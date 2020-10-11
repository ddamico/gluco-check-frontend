import { BloodGlucoseUnits } from "../enums";
import { SettingsFormData } from "../types";

export const mockFormData: SettingsFormData = {
    nightscoutToken: 'I am a token',
    nightscoutUrl: 'https://example.com',
    glucoseUnit: BloodGlucoseUnits.mgdl
}
