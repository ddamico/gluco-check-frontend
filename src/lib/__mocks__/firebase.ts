import { BloodGlucoseUnits } from "../enums"
import { GlucoCheckUserDocument } from "../types"

// @TODO: fill in the test of this
export const mockUser: Partial<firebase.User> = {
    email: 'example@example.com',
    uid: "uid123"
}

export const mockUserDocument: GlucoCheckUserDocument = {
    defaultPointers: ["blood sugar"],
    glucoseUnit: BloodGlucoseUnits.mgdl,
    nightscout: {
        url: "https://example.com",
        token: "nstoken123"
    }
}