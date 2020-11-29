import { GlucoCheckUserDocument, SettingsFormData } from "./types";

export const userSettingsFormDataToUserSettingsDocument = (
  data: SettingsFormData
): Partial<GlucoCheckUserDocument> => {
  return {
    defaultPointers: data.defaultPointers,
    glucoseUnit: data.glucoseUnit,
    nightscout: {
      token: data.nightscoutToken,
      url: data.nightscoutUrl,
    },
  };
};
