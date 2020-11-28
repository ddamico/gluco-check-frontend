import { BloodGlucoseUnits, DiabetesPointer } from "../enums";
import { GlucoCheckUserDocument } from "../types";

export const mockUser: Partial<firebase.User> = {
  email: "example@example.com",
  uid: "uid123",
};

export const mockUserDocument: GlucoCheckUserDocument = {
  defaultPointers: [DiabetesPointer.BloodSugar],
  glucoseUnit: BloodGlucoseUnits.mgdl,
  nightscout: {
    url: "https://example.com",
    token: "nstoken123",
  },
};
