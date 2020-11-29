import { BloodGlucoseUnits, DiabetesPointer } from "./enums";
import { GlucoCheckUserDocument } from "./types";

export const DEFAULT_USER_DOCUMENT: GlucoCheckUserDocument = {
  defaultPointers: [DiabetesPointer.BloodSugar],
  glucoseUnit: BloodGlucoseUnits.mgdl,
  nightscout: {
    token: "",
    url: "",
  },
};

export const getDocumentPathForUser = (user: firebase.User): string => {
  return `users/${user.email}`;
};
