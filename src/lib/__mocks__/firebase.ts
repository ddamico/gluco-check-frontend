import { BloodGlucoseUnits, DiabetesMetric } from "../enums";
import { GlucoCheckUserDocument } from "../types";

export const mockUser: Partial<firebase.User> = {
  email: "example@example.com",
  uid: "uid123",
};

export const mockUserDocument: GlucoCheckUserDocument = {
  defaultMetrics: [DiabetesMetric.BloodSugar],
  glucoseUnit: BloodGlucoseUnits.mgdl,
  nightscout: {
    url: "https://example.com",
    token: "nstoken123",
  },
};
