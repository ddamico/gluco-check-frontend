import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BloodGlucoseUnits } from "../lib/enums";
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
  const { t } = useTranslation();
  const [formHasSubmissionError, setFormHasSubmissionError] = useState(false);
  const canEditFields = !formState.isSubmitting;
  const canSubmitForm = formState.isDirty && !formState.isSubmitting;

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
        {t("settings.form.labels.nightscoutUrl")}
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
        {t("settings.form.labels.nightscoutToken")}
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
        {t("settings.form.labels.glucoseUnits")}
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
      <button
        type="submit"
        disabled={!canSubmitForm}
        data-testid="settings-form-submit"
      >
        {t("settings.form.submitButton")}
      </button>
    </form>
  );

  return (
    <>
      {formState.isSubmitting && (
        <p data-testid="settings-form-submitting">
          {t("settings.form.submitStatus.submitting")}
        </p>
      )}
      {formState.isSubmitted && (
        <p data-testid="settings-form-submitted">
          {t("settings.form.submitStatus.submitted")}
        </p>
      )}
      {formHasSubmissionError && (
        <p data-testid="settings-form-error">
          {t("settings.form.submitStatus.error")}
        </p>
      )}
      {SettingsForm}
    </>
  );
}
