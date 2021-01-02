export enum BloodGlucoseUnit {
  mgdl = "mg/dl",
  mmoll = "mmol/L",
}

export enum NightscoutBloodGlucoseUnit {
  mgdl = "mgdl",
  mmol = "mmol"
}

export const NightscoutBloodGlucoseUnitMapping = {
  [NightscoutBloodGlucoseUnit.mgdl]: BloodGlucoseUnit.mgdl,
  [NightscoutBloodGlucoseUnit.mmol]: BloodGlucoseUnit.mmoll
}

// @TODO: once this repo is properly part of the workspace,
// pull this in from gluco-check-core instead
// These are mapped to translations directly by case name,
// additions or changes here need to be reflected there
export enum DiabetesMetric {
  Everything = "everything",
  BloodSugar = "blood sugar",
  InsulinOnBoard = "insulin on board",
  CarbsOnBoard = "carbs on board",
  SensorAge = "sensor age",
  CannulaAge = "cannula age",
  PumpBattery = "pump battery",
}
