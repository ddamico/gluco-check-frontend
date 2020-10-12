import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { BloodGlucoseUnits } from "../lib/enums";
import { SETTINGS_FORM_GLUCOSE_UNITS_FIELD_LABEL, SETTINGS_FORM_NSTOKEN_FIELD_LABEL, SETTINGS_FORM_NSURL_FIELD_LABEL, SETTINGS_FORM_SUBMITTED_STATUS_ERROR, SETTINGS_FORM_SUBMITTED_STATUS_TEXT, SETTINGS_FORM_SUBMITTING_STATUS_TEXT, SETTINGS_FORM_SUBMIT_BUTTON_LABEL } from "../lib/strings";
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
  // eslint-disable-next-line
  const { register, handleSubmit, formState, watch, errors } = useForm<
  SettingsFormData
  >();
  const [formHasSubmissionError, setFormHasSubmissionError] = useState(false);
  const canEditFields = !formState.isSubmitting
  const canSubmitForm = formState.isDirty && !formState.isSubmitting

  const onFormSubmit = async (data: SettingsFormData) => {
    try {
      setFormHasSubmissionError(false);
      await onSubmit(data);
    } catch (e) {
      setFormHasSubmissionError(true);
    }
  };

  const SettingsForm = (
    <form onSubmit={handleSubmit(onFormSubmit)} data-testid="settings-form">
      <label>
        {SETTINGS_FORM_NSURL_FIELD_LABEL}
        <input
          name="nightscoutUrl"
          defaultValue={nightscoutUrl}
          ref={register}
          disabled={!canEditFields}
          data-testid="settings-form-field-url"
        />
      </label>
      <br />
      <label>
        {SETTINGS_FORM_NSTOKEN_FIELD_LABEL}
        <input
          name="nightscoutToken"
          defaultValue={nightscoutToken}
          ref={register}
          disabled={!canEditFields}
          data-testid="settings-form-field-token"
        />
      </label>
      <br />
      <label>
        {SETTINGS_FORM_GLUCOSE_UNITS_FIELD_LABEL}
        <select
          name="glucoseUnit"
          defaultValue={glucoseUnit}
          ref={register({ required: true })}
          disabled={!canEditFields}
          data-testid="settings-form-field-bg"
        >
          {Object.entries(BloodGlucoseUnits).map(([value, key]) => (
            <option id={key} key={key}>
              {key}
            </option>
          ))}
        </select>
      </label>
      <br />
      <button type="submit" disabled={!canSubmitForm} data-testid="settings-form-submit">
        {SETTINGS_FORM_SUBMIT_BUTTON_LABEL}
      </button>
    </form>
  );

  return (
    <>
      {formState.isSubmitting && <p data-testid="settings-form-submitting">{SETTINGS_FORM_SUBMITTING_STATUS_TEXT}</p>}
      {formState.isSubmitted && <p data-testid="settings-form-submitted">{SETTINGS_FORM_SUBMITTED_STATUS_TEXT}</p>}
      {formHasSubmissionError && <p data-testid="settings-form-error">{SETTINGS_FORM_SUBMITTED_STATUS_ERROR}</p>}
      {SettingsForm}
    </>
  );
}
