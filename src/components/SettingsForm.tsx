import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  makeStyles,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from "@material-ui/core";
import { Close, Lock } from "@material-ui/icons";
import MuiAlert from "@material-ui/lab/Alert";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BloodGlucoseUnits, DiabetesMetric } from "../lib/enums";
import { SettingsFormData } from "../lib/types";
import { ALERT_AUTOHIDE_DURATION } from "../lib/constants";
import TokenSetup from "../components/TokenSetup";

type SettingsFormProps = {
  nightscoutUrl: string;
  nightscoutToken: string;
  glucoseUnit: BloodGlucoseUnits;
  defaultMetrics: DiabetesMetric[];
  onSubmit: (data: SettingsFormData) => {};
};

const SettingsFormAlert = (props: any) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  form: {
    "& .MuiFormControl-root": {
      marginBottom: theme.spacing(4),
    },
  },
  checkboxArray: {
    "& label": {
      textTransform: "capitalize",
    },
  },
}));

export const returnHandleOpenTokenDialog = (
  tokenDialogOpen: boolean,
  setTokenDialogOpen: Function
) => {
  return () => {
    setTokenDialogOpen(!tokenDialogOpen);
  };
};

export default function SettingsForm({
  nightscoutUrl,
  nightscoutToken,
  glucoseUnit,
  defaultMetrics,
  onSubmit,
}: SettingsFormProps) {
  const classes = useStyles();
  // eslint-disable-next-line
  const { control, formState, getValues, handleSubmit, register } = useForm<
    SettingsFormData
  >();
  const { t } = useTranslation();
  const [formHasSubmissionError, setFormHasSubmissionError] = useState(false);
  const [formHasSubmittedSuccess, setFormHasSubmittedSuccess] = useState(false);
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);

  const canEditFields = !formState.isSubmitting;

  const glucoseUnits = Object.entries(BloodGlucoseUnits).map(([_, v]) => {
    return { label: v, value: v };
  });

  let everythingIsSelected = defaultMetrics.includes(DiabetesMetric.Everything);

  const metrics = Object.entries(DiabetesMetric).map(
    ([enumCase, enumValue]) => {
      return { label: t(`diabetesMetrics.${enumCase}`), value: enumValue };
    }
  );

  const onFormSubmit = async (data: SettingsFormData) => {
    try {
      setFormHasSubmissionError(false);
      await onSubmit(data);
      setFormHasSubmittedSuccess(true);
      formReset();
    } catch (e) {
      setFormHasSubmissionError(true);
    }
  };

  const formReset = () => {
    setFormHasSubmissionError(false);
    setFormHasSubmittedSuccess(false);
  };

  const handleFormAlertClose = () => {
    setFormHasSubmittedSuccess(false);
  };

  const handleCheck = (newMetric: DiabetesMetric) => {
    const { defaultMetrics } = getValues();
    let newMetrics = defaultMetrics?.includes(newMetric)
      ? defaultMetrics?.filter((metric) => metric !== newMetric)
      : [...defaultMetrics, newMetric];

    // if user is selecting everything, then return ONLY everything
    // and set everything selected flag to true
    if (newMetrics.includes(DiabetesMetric.Everything)) {
      newMetrics = [DiabetesMetric.Everything];
      everythingIsSelected = true;
    } else {
      everythingIsSelected = false;
    }
    return newMetrics;
  };

  const TokenDialog = (
    <Dialog
      open={tokenDialogOpen}
      aria-labelledby="token-dialog-title"
      fullWidth
    >
      <DialogTitle id="token-dialog-title">
        {t("tokenDialog.title")}
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={returnHandleOpenTokenDialog(
            tokenDialogOpen,
            setTokenDialogOpen
          )}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TokenSetup />
      </DialogContent>
    </Dialog>
  );

  const SettingsForm = (
    <form
      className={classes.form}
      onSubmit={handleSubmit(onFormSubmit)}
      data-testid="settings-form"
    >
      <FormControl
        component="fieldset"
        data-testid="settings-form-fieldset-metrics"
      >
        <FormLabel component="legend">
          {t("settings.form.labels.defaultMetrics")}
        </FormLabel>
        <FormGroup row className={classes.checkboxArray}>
          <Controller
            control={control}
            name="defaultMetrics"
            defaultValue={defaultMetrics}
            // @ts-ignore
            render={(props) => {
              return metrics.map((metric) => (
                <FormControlLabel
                  disabled={
                    !canEditFields ||
                    (everythingIsSelected &&
                      metric.value !== DiabetesMetric.Everything)
                  }
                  control={
                    <Checkbox
                      onChange={() => props.onChange(handleCheck(metric.value))}
                      checked={props.value.includes(metric.value)}
                    />
                  }
                  key={metric.value}
                  label={metric.value}
                />
              ));
            }}
          />
        </FormGroup>
        <FormHelperText>
          {t("settings.form.helperText.defaultMetrics")}
        </FormHelperText>
      </FormControl>
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
      <TextField
        defaultValue={nightscoutToken}
        disabled={!canEditFields}
        fullWidth={true}
        helperText={
          <Link
            component="button"
            type="button"
            onClick={returnHandleOpenTokenDialog(
              tokenDialogOpen,
              setTokenDialogOpen
            )}
          >
            {t("settings.form.helperText.nightscoutToken")}
          </Link>
        }
        id="settings-form-field-token"
        InputProps={{
          inputProps: {
            "data-testid": "settings-form-field-token",
          },
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
        open={formHasSubmittedSuccess}
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
