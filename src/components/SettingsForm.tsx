import React, { useState } from "react";
import {
  Button,
  Container,
  FormControl,
  InputAdornment,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { Lock } from "@material-ui/icons";
import { useForm, Controller } from "react-hook-form";
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
    "& .MuiFormControl-root": {
      marginBottom: theme.spacing(4),
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
  const { register, handleSubmit, formState, control, watch, errors } = useForm<
    SettingsFormData
  >();
  const { t } = useTranslation();
  const [formHasSubmissionError, setFormHasSubmissionError] = useState(false);

  const canEditFields = !formState.isSubmitting;
  const canSubmitForm = formState.isDirty && !formState.isSubmitting;

  const glucoseUnits = Object.entries(BloodGlucoseUnits).map(([k, v]) => {
    return { label: v, value: v };
  });

  console.log(formState);

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
            <InputAdornment position="start">
              <Lock />
            </InputAdornment>
          ),
        }}
        inputRef={register}
        label={t("settings.form.labels.nightscoutToken")}
        name="nightscoutToken"
      />

      <FormControl fullWidth={true} className="MaterialSelect">
        <InputLabel>{t("settings.form.labels.glucoseUnits")}</InputLabel>
        <Controller
          name="glucoseUnit"
          rules={{ required: true }}
          control={control}
          defaultValue={glucoseUnit}
          as={
            <Select
              data-testid="settings-form-field-bg"
              fullWidth={true}
              disabled={!canEditFields}
            >
              {glucoseUnits.map((item) => (
                <MenuItem value={item.value} key={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          }
        />
      </FormControl>

      {/* <TextField

        defaultValue={glucoseUnit}


        InputProps={{
          name: "glucoseUnit",
        }}
        select
      ></TextField> */}

      <Container disableGutters={true} maxWidth="lg">
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
