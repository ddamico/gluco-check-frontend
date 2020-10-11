import React from "react";
import { useForm } from "react-hook-form";
import { BloodGlucoseUnits } from "../lib/enums";
import { SettingsFormData } from "../lib/types";

type SettingsFormProps = {
  // @TODO: pull these out into an object I think
  nightscoutUrl: string
  nightscoutToken: string
  glucoseUnit: BloodGlucoseUnits
  onSubmit: (data: SettingsFormData) => {}
};

export default function SettingsForm({ nightscoutUrl, nightscoutToken, glucoseUnit, onSubmit }: SettingsFormProps) {
  const { register, handleSubmit, watch, errors } = useForm<SettingsFormData>();
  const onFormSubmit = async (data: SettingsFormData) => {
    try {
      await onSubmit(data)
    } catch (e) {
      console.log('something has gone horribly wrong')
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
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
