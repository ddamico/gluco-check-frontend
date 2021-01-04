export const FIRESTORE_FIELD_PATH_GLUCOSE_UNITS = "glucoseUnit";
export const FIRESTORE_FIELD_PATH_NIGHTSCOUT = "nightscout";
export const FIRESTORE_FIELD_PATH_DEFAULT_METRICS = "defaultMetrics";
export const FIRESTORE_FIELD_PATH_NIGHTSCOUT_URL = `${FIRESTORE_FIELD_PATH_NIGHTSCOUT}.url`;
export const FIRESTORE_FIELD_PATH_NIGHTSCOUT_TOKEN = `${FIRESTORE_FIELD_PATH_NIGHTSCOUT}.token`;

export const NIGHTSCOUT_VALIDATION_ENDPOINT_URL =
  process.env.REACT_APP_NIGHTSCOUT_VALIDATION_ENDPOINT_URL || "";

export const ALERT_AUTOHIDE_DURATION = 7000;
export const VALIDATION_DEBOUNCE_DURATION = 500;
