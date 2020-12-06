import { BloodGlucoseUnits, DiabetesMetric } from "./enums";
import { GlucoCheckUserDocument } from "./types";

export const DEFAULT_USER_DOCUMENT: GlucoCheckUserDocument = {
  defaultMetrics: [DiabetesMetric.BloodSugar],
  glucoseUnit: BloodGlucoseUnits.mgdl,
  nightscout: {
    token: "",
    url: "",
  },
};

export const getDocumentPathForUser = (user: firebase.User): string => {
  return `users/${user.email}`;
};
