export enum BloodGlucoseUnits {
  mgdl = "mg/dl",
  mmoll = "mmol/L",
}

// @TODO: once this repo is properly part of the workspace,
// pull this in from gluco-check-core instead
export enum DiabetesPointer {
  Everything = "everything",
  BloodSugar = "blood sugar",
  InsulinOnBoard = "insulin on board",
  CarbsOnBoard = "carbs on board",
  SensorAge = "sensor age",
  CannulaAge = "cannula age",
  PumpBattery = "pump battery",
}
