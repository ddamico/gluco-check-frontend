import { GlucoCheckUserDocument, SettingsFormData } from "./types"

export const userSettingsFormDataToUserSettingsDocument = (data: SettingsFormData): Partial<GlucoCheckUserDocument> => {
    return {
        glucoseUnit: data.glucoseUnit,
        nightscout: {
            token: data.nightscoutToken,
            url: data.nightscoutUrl
        }
    }
}