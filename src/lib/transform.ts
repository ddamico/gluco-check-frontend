import { GlucoCheckUserDocument, SettingsFormData } from "./types";

export const userSettingsFormDataToUserSettingsDocument = (
  data: SettingsFormData
): Partial<GlucoCheckUserDocument> => {
  return {
    defaultMetrics: data.defaultMetrics,
    glucoseUnit: data.glucoseUnit,
    nightscout: {
      token: data.nightscoutToken,
      url: data.nightscoutUrl,
    },
  };
};
