import React, { useState } from "react";
import {
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  Input,
  InputAdornment,
  InputLabel,
  Link,
  makeStyles,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from "@material-ui/core";
import { Lock } from "@material-ui/icons";
import MuiAlert from "@material-ui/lab/Alert";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BloodGlucoseUnits } from "../lib/enums";
import { SettingsFormData } from "../lib/types";
import { ALERT_AUTOHIDE_DURATION } from "../lib/constants";
import TokenSetup from "../components/TokenSetup";

type SettingsFormProps = {
  nightscoutUrl: string;
  nightscoutToken: string;
  glucoseUnit: BloodGlucoseUnits;
  onSubmit: (data: SettingsFormData) => {};
};

const SettingsFormAlert = (props: any) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const useStyles = makeStyles((theme) => ({
  form: {
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
  const {
    control,
    formState,
    handleSubmit,
    register,
    reset: resetForm,
  } = useForm<SettingsFormData>();
  const { t } = useTranslation();
  const [formHasSubmissionError, setFormHasSubmissionError] = useState(false);
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);

  const canEditFields = !formState.isSubmitting;
  const canSubmitForm = formState.isDirty && !formState.isSubmitting;

  const glucoseUnits = Object.entries(BloodGlucoseUnits).map(([k, v]) => {
    return { label: v, value: v };
  });

  const onFormSubmit = async (data: SettingsFormData) => {
    try {
      setFormHasSubmissionError(false);
      await onSubmit(data);
      formReset();
    } catch (e) {
      setFormHasSubmissionError(true);
    }
  };

  const formReset = () => {
    setFormHasSubmissionError(false);
    resetForm();
  };

  const handleFormAlertClose = () => {
    formReset();
  };

  const TokenDialog = (
    <Dialog open={tokenDialogOpen} aria-labelledby="token-dialog-title">
      <DialogTitle id="token-dialog-title">
        {t("tokenDialog.title")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <TokenSetup />
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );

  const SettingsForm = (
    <form
      className={classes.form}
      onSubmit={handleSubmit(onFormSubmit)}
      data-testid="settings-form"
    >
      <TextField
        defaultValue={nightscoutUrl}
        disabled={!canEditFields}
        fullWidth={true}
        helperText={t("settings.form.helperText.nightscoutUrl")}
        id="settings-form-field-url"
        inputRef={register}
        InputProps={{
          inputProps: {
            "data-testid": "settings-form-field-url",
          },
        }}
        label={t("settings.form.labels.nightscoutUrl")}
        name="nightscoutUrl"
      />
      <FormControl fullWidth={true}>
        <InputLabel>{t("settings.form.labels.nightscoutToken")}</InputLabel>
        <Input
          data-testid="settings-form-field-token"
          defaultValue={nightscoutToken}
          disabled={!canEditFields}
          id="settings-form-field-token"
          name="nightscoutToken"
          ref={register}
          startAdornment={
            <InputAdornment position="start">
              <Lock />
            </InputAdornment>
          }
        />
        <FormHelperText>
          <Link
            component="button"
            onClick={() => {
              setTokenDialogOpen(!tokenDialogOpen);
            }}
          >
            {t("settings.form.helperText.nightscoutToken")}
          </Link>
        </FormHelperText>
      </FormControl>

      <FormControl fullWidth={true} className="MaterialSelect">
        <InputLabel>{t("settings.form.labels.glucoseUnits")}</InputLabel>
        <Controller
          name="glucoseUnit"
          rules={{ required: true }}
          control={control}
          defaultValue={glucoseUnit}
          as={
            <Select
              disabled={!canEditFields}
              fullWidth={true}
              inputProps={{
                "data-testid": "settings-form-field-bg",
              }}
              id="settings-form-field-bg"
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

      <Container disableGutters={true} maxWidth="lg">
        <Button
          color="primary"
          data-testid="settings-form-submit"
          disabled={!canSubmitForm}
          type="submit"
          variant="contained"
        >
          {t("settings.form.submitButton")}
        </Button>
      </Container>
    </form>
  );

  return (
    <>
      <Snackbar
        autoHideDuration={ALERT_AUTOHIDE_DURATION}
        onClose={handleFormAlertClose}
        open={formState.isSubmitting}
      >
        <SettingsFormAlert
          data-testid="settings-form-submitting"
          severity="warning"
        >
          {t("settings.form.submitStatus.submitting")}
        </SettingsFormAlert>
      </Snackbar>
      <Snackbar
        autoHideDuration={ALERT_AUTOHIDE_DURATION}
        onClose={handleFormAlertClose}
        open={formState.isSubmitted}
      >
        <SettingsFormAlert
          data-testid="settings-form-submitted"
          severity="success"
        >
          {t("settings.form.submitStatus.submitted")}
        </SettingsFormAlert>
      </Snackbar>
      <Snackbar
        autoHideDuration={ALERT_AUTOHIDE_DURATION}
        onClose={handleFormAlertClose}
        open={formHasSubmissionError}
      >
        <SettingsFormAlert data-testid="settings-form-error" severity="error">
          {t("settings.form.submitStatus.error")}
        </SettingsFormAlert>
      </Snackbar>

      {SettingsForm}
      {TokenDialog}
    </>
  );
}
