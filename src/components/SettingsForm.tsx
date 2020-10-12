import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { BloodGlucoseUnits } from "../lib/enums";
import { SUBMIT_SETTINGS_FORM } from "../lib/strings";
import { SettingsFormData } from "../lib/types";

type SettingsFormProps = {
  nightscoutUrl: string;
  nightscoutToken: string;
  glucoseUnit: BloodGlucoseUnits;
  onSubmit: (data: SettingsFormData) => {};
};

export default function SettingsForm({
  nightscoutUrl,
  nightscoutToken,
  glucoseUnit,
  onSubmit,
}: SettingsFormProps) {
  const { register, handleSubmit, formState, watch, errors } = useForm<
    SettingsFormData
  >();
  const onFormSubmit = async (data: SettingsFormData) => {
    try {
      await onSubmit(data);
    } catch (e) {
      // TODO: probably can't just throw here, figure
      // out what hook form will do with this error
      console.log("threw on form submit");
      throw e;
    }
  };

  return (
    <>
      {formState.isSubmitting && <>Saving your settings</>}
      {!formState.isSubmitting && (
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
              {Object.entries(BloodGlucoseUnits).map(([value, key]) => (
                <option id={key} key={key}>
                  {key}
                </option>
              ))}
            </select>
          </label>
          <br />
          <button type="submit" disabled={!formState.isDirty}>
            {SUBMIT_SETTINGS_FORM}
          </button>
        </form>
      )}
    </>
  );
}
