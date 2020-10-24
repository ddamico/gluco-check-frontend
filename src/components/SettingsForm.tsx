import React, { useState } from "react";
import {
  Button,
  FormLabel,
  Input,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
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
      <TextField
        data-testid="settings-form-field-url"
        defaultValue={nightscoutUrl}
        disabled={!canEditFields}
        inputRef={register}
        label={t("settings.form.labels.nightscoutUrl")}
        name="nightscoutUrl"
      />
      <TextField
        data-testid="settings-form-field-token"
        defaultValue={nightscoutToken}
        disabled={!canEditFields}
        helperText={t("settings.form.helperText.nightscoutToken")}
        inputRef={register}
        label={t("settings.form.labels.nightscoutToken")}
        name="nightscoutToken"
      />
      <Select
        data-testid="settings-form-field-bg"
        defaultValue={glucoseUnit}
        disabled={!canEditFields}
        label={t("settings.form.labels.glucoseUnits")}
        name="glucoseUnit"
        ref={register({ required: true })}
      >
        {Object.entries(BloodGlucoseUnits).map(([value, key]) => (
          <MenuItem value={key} key={key}>
            {key}
          </MenuItem>
        ))}
      </Select>

      <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={!canSubmitForm}
        data-testid="settings-form-submit"
      >
        {t("settings.form.submitButton")}
      </Button>
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
