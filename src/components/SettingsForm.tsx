import React, { useEffect, useState } from "react";
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
import semver from "semver";
import { Close, Lock } from "@material-ui/icons";
import MuiAlert from "@material-ui/lab/Alert";
import { useForm, Controller, DeepMap, FieldError } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BloodGlucoseUnit, DiabetesMetric } from "../lib/enums";
import { SettingsFormData } from "../lib/types";
import {
  ALERT_AUTOHIDE_DURATION,
  NIGHTSCOUT_VALIDATION_ENDPOINT_URL,
} from "../lib/constants";
import TokenSetup from "../components/TokenSetup";
import { NightscoutValidationClient } from "../lib/NightscoutValidationClient";
import {
  MOCK_NSV_RESPONSE_VALID,
  MOCK_NSV_RESPONSE_NON_NS_URL,
  MOCK_NSV_RESPONSE_INVALID_TOKEN,
} from "../lib/__mocks__/gluco-check";

type SettingsFormProps = {
  nightscoutUrl: string;
  nightscoutToken: string;
  glucoseUnit: BloodGlucoseUnit;
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

const nsvClient = new NightscoutValidationClient({
  endpointUrl: NIGHTSCOUT_VALIDATION_ENDPOINT_URL,
});

export default function SettingsForm({
  nightscoutUrl,
  nightscoutToken,
  glucoseUnit,
  defaultMetrics,
  onSubmit,
}: SettingsFormProps) {
  const classes = useStyles();

  // eslint-disable-next-line
  const {
    control,
    errors,
    formState,
    getValues,
    handleSubmit,
    register,
    trigger,
  } = useForm<SettingsFormData>({
    mode: "onBlur",
    // TODO: extract
    resolver: async (data) => {
      const nsvResponse = await nsvClient.fetchValidationStatus(
        data.nightscoutUrl,
        data.nightscoutToken
      );
      // console.log(nsvResponse);
      // const nsvResponse = MOCK_NSV_RESPONSE_NON_NS_URL;
      let errors: DeepMap<SettingsFormData, FieldError> = {};
      if (!nsvResponse.url.pointsToNightscout) {
        errors.nightscoutUrl = {
          type: "validation",
          message: "This URL does not point to a Nightscout site",
        };
      }
      if (nsvResponse.url.pointsToNightscout) {
        if (!nsvResponse.token.isValid) {
          errors.nightscoutToken = {
            type: "validation",
            message: "Your Nightscout site is not accepting this token",
          };
        }
        if (nsvResponse.nightscout.glucoseUnit !== data.glucoseUnit) {
          errors.glucoseUnit = {
            type: "validation",
            message: "Chosen unit differs from your Nightscout site's units",
          };
        }
        if (
          semver.lt(
            nsvResponse.nightscout.version,
            nsvResponse.nightscout.minSupportedVersion
          )
        ) {
          // TODO: this especially will require some funny business to localize
          errors.nightscoutUrl = {
            type: "validation",
            message: `Your Nightscout site requires an upgrade to work with Gluco Check, please update to at least ${nsvResponse?.nightscout?.minSupportedVersion}`,
          };
        }
      }

      const userHasSelectedUnsupportedMetrics = true;
      // const userHasSelectedUnsupportedMetrics = data.defaultMetrics?
      //   .map((metric) => nsvResponse.discoveredMetrics.includes(metric))?
      //   .includes(false);
      if (userHasSelectedUnsupportedMetrics === true) {
        errors.defaultMetrics = [
          {
            type: "validation",
            message: `Some selected metrics are not supported by your Nightscout site, and/or require a valid token. To enable full support, please update Nightscout to at least ${nsvResponse?.nightscout?.minSupportedVersion} and enter a valid token`,
          },
        ];
      }

      // TODO: verify we do not block submission on errors
      return {
        values: {}, // TODO: clarify meaning of values
        errors,
      };
    },
  });

  // trigger form validation on first component render
  useEffect(() => {
    trigger();
  }, [trigger]);

  const { t } = useTranslation();
  const [formHasSubmissionError, setFormHasSubmissionError] = useState(false);
  const [formHasSubmittedSuccess, setFormHasSubmittedSuccess] = useState(false);
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);

  // nightscout validation state
  const [nightscoutUrlIsValid, setNightscoutUrlIsValid] = useState(false);
  const [nightscoutTokenIsValid, setNightscoutTokenIsValid] = useState(false);

  const canEditFields = !formState.isSubmitting;

  const glucoseUnits = Object.entries(BloodGlucoseUnit).map(([_, v]) => {
    return { label: v, value: v };
  });

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
    } catch (e) {
      setFormHasSubmissionError(true);
    }
  };

  const formReset = () => {
    setFormHasSubmissionError(false);
    setFormHasSubmittedSuccess(false);
  };

  const handleFormAlertClose = () => {
    formReset();
  };

  const handleCheck = (newMetric: DiabetesMetric) => {
    const { defaultMetrics } = getValues();
    let newMetrics = defaultMetrics?.includes(newMetric)
      ? defaultMetrics?.filter((metric) => metric !== newMetric)
      : [...defaultMetrics, newMetric];

    // if user is selecting everything, then return ONLY everything
    if (newMetrics.includes(DiabetesMetric.Everything)) {
      newMetrics = Object.values(DiabetesMetric);
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
              const { defaultMetrics: formStateDefaultMetrics } = getValues();
              const everythingIsSelected = formStateDefaultMetrics
                ? formStateDefaultMetrics.includes(DiabetesMetric.Everything)
                : defaultMetrics.includes(DiabetesMetric.Everything);

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
                      checked={
                        everythingIsSelected ||
                        props.value.includes(metric.value)
                      }
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
        id="settings-form-field-url"
        inputRef={register}
        InputProps={{
          inputProps: {
            "data-testid": "settings-form-field-url",
          },
        }}
        label={t("settings.form.labels.nightscoutUrl")}
        name="nightscoutUrl"
        error={!!errors.nightscoutUrl}
        helperText={
          errors.nightscoutUrl ? errors.nightscoutUrl.message : undefined
        }
        variant={errors.nightscoutUrl ? "outlined" : undefined}
      />
      <TextField
        defaultValue={nightscoutToken}
        disabled={!canEditFields}
        fullWidth={true}
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
        error={!!errors.nightscoutToken}
        helperText={
          errors.nightscoutToken ? (
            errors.nightscoutToken.message
          ) : (
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
          )
        }
        variant={errors.nightscoutToken ? "outlined" : undefined}
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
          error={!!errors.glucoseUnit}
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
