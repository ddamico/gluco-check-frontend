import React, { useState } from "react";
import {
  Button,
  Container,
  InputAdornment,
  makeStyles,
  MenuItem,
  TextField,
} from "@material-ui/core";
import { Lock } from "@material-ui/icons";
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

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      marginInline: theme.spacing(1),
    },
  },
}));

export default function SettingsForm({
  nightscoutUrl,
  nightscoutToken,
  glucoseUnit,
  onSubmit,
}: SettingsFormProps) {
  const classes = useStyles();
  // eslint-disable-next-line
  const { register, handleSubmit, formState, watch, errors } = useForm<
    SettingsFormData
  >();
  const { t } = useTranslation();
  const [formHasSubmissionError, setFormHasSubmissionError] = useState(false);
  const canEditFields = !formState.isSubmitting;
  const canSubmitForm = formState.isDirty && !formState.isSubmitting;

  const glucoseUnits = Object.entries(BloodGlucoseUnits).map(([k, v]) => {
    return { label: v, value: v };
  });
  console.log(glucoseUnits);

  const onFormSubmit = async (data: SettingsFormData) => {
    try {
      setFormHasSubmissionError(false);
      await onSubmit(data);
    } catch (e) {
      setFormHasSubmissionError(true);
    }
  };

  const SettingsForm = (
    <form
      className={classes.root}
      onSubmit={handleSubmit(onFormSubmit)}
      data-testid="settings-form"
    >
      <TextField
        data-testid="settings-form-field-url"
        defaultValue={nightscoutUrl}
        disabled={!canEditFields}
        fullWidth={true}
        helperText={t("settings.form.helperText.nightscoutUrl")}
        inputRef={register}
        label={t("settings.form.labels.nightscoutUrl")}
        name="nightscoutUrl"
      />
      <TextField
        data-testid="settings-form-field-token"
        defaultValue={nightscoutToken}
        disabled={!canEditFields}
        fullWidth={true}
        helperText={t("settings.form.helperText.nightscoutToken")}
        InputProps={{
          startAdornment: (
            <InputAdornment position="end">
              <Lock />
            </InputAdornment>
          ),
        }}
        inputRef={register}
        label={t("settings.form.labels.nightscoutToken")}
        name="nightscoutToken"
      />
      <TextField
        data-testid="settings-form-field-bg"
        defaultValue={glucoseUnit}
        disabled={!canEditFields}
        fullWidth={true}
        inputRef={register({ required: true })}
        label={t("settings.form.labels.glucoseUnits")}
        name="glucoseUnit"
        select
      >
        {glucoseUnits.map((item) => (
          <MenuItem value={item.value} key={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </TextField>

      <Container
        disableGutters={true}
        maxWidth="lg"
        style={{ margin: "1em 0" }}
      >
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={!canSubmitForm}
          data-testid="settings-form-submit"
        >
          {t("settings.form.submitButton")}
        </Button>
      </Container>
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
