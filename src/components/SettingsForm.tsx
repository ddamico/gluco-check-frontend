import React from "react";
import { useForm } from "react-hook-form";
import {
  FIRESTORE_FIELD_PATH_GLUCOSE_UNITS,
  FIRESTORE_FIELD_PATH_NIGHTSCOUT_TOKEN,
  FIRESTORE_FIELD_PATH_NIGHTSCOUT_URL,
} from "../lib/constants";
import { BloodGlucoseUnits } from "../lib/enums";

type SettingsFormProps = {
  userData?: firebase.firestore.DocumentData;
};

type SettingsFormData = {
  nightscoutUrl: string;
  nightscoutToken: string;
  glucoseUnit: BloodGlucoseUnits;
};

export default function SettingsForm({ userData }: SettingsFormProps) {
  const { register, handleSubmit, watch, errors } = useForm<SettingsFormData>();
  const onSubmit = (data: SettingsFormData) => {
    console.log(data);
  };

  const nightscoutUrl = userData?.get(FIRESTORE_FIELD_PATH_NIGHTSCOUT_URL);
  const nightscoutToken = userData?.get(FIRESTORE_FIELD_PATH_NIGHTSCOUT_TOKEN);
  const glucoseUnit = userData?.get(FIRESTORE_FIELD_PATH_GLUCOSE_UNITS);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Nightscout URL
        <input
          name="nightscoutUrl"
          defaultValue={nightscoutUrl}
          ref={register}
        />
      </label>
      <br />
      <label>
        Nightscout Token
        <input
          name="nightscoutToken"
          defaultValue={nightscoutToken}
          ref={register}
        />
      </label>
      <br />
      <label>
        Glucose Units
        <select
          name="glucoseUnit"
          defaultValue={glucoseUnit}
          ref={register({ required: true })}
        >
          <option id="mg/dl">mg/dl</option>
          <option id="mmol/l">mmol/l</option>
        </select>
      </label>
      <input type="submit" />
    </form>
  );
}
