import React, { useEffect, useState } from "react";
import { debounce } from "debounce-promise-with-cancel";
import {
  Button,
  Checkbox,
  CircularProgress,
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
import semver from "semver";
import { Close, Lock } from "@material-ui/icons";
import MuiAlert from "@material-ui/lab/Alert";
import { useForm, Controller, DeepMap, FieldError } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BloodGlucoseUnit, DiabetesMetric } from "../lib/enums";
import { SettingsFormData } from "../lib/types";
import {
  ALERT_AUTOHIDE_DURATION,
  VALIDATION_DEBOUNCE_DURATION,
} from "../lib/constants";
import TokenSetup from "../components/TokenSetup";
import { NightscoutValidationClient } from "../lib/NightscoutValidationClient/NightscoutValidationClient";
import { NightscoutBloodGlucoseUnitMapping } from "../lib/mappings";

type SettingsFormProps = {
  nightscoutUrl: string;
  nightscoutToken: string;
  glucoseUnit: BloodGlucoseUnit;
  defaultMetrics: DiabetesMetric[];
  onSubmit: (data: SettingsFormData) => {};
  nightscoutValidator?: NightscoutValidationClient;
  alertAutohideDuration?: number;
  validationDebounceDuration?: number;
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
  helperWarning: {
    color: theme.palette.warning.main,
  },
  checkboxWithWarning: {
    "& .MuiFormControlLabel-label.Mui-disabled": {
      color: theme.palette.warning.light,
    },
    "& .MuiFormControlLabel-label": {
      color: theme.palette.warning.main,
    },
    "& .MuiFormControlLabel-label::after": {
      content: "' *'",
    },
    "& input[type=checkbox]:disabled + svg": {
      fill: theme.palette.warning.light,
    },
    "& input[type=checkbox] + svg": {
      fill: theme.palette.warning.main,
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
  nightscoutValidator,
  alertAutohideDuration,
  validationDebounceDuration,
}: SettingsFormProps) {
  const classes = useStyles();
  const [warnings, setWarnings] = useState<
    DeepMap<SettingsFormData, FieldError>
  >({});

  // until the backend tells us otherwise, assume
  // everything is supported
  const [supportedMetrics, setSupportedMetrics] = useState<DiabetesMetric[]>(
    Object.values(DiabetesMetric)
  );
  const [validationInProgress, setValidationInProgress] = useState(false);

  const debouncedValidator = debounce(async (data: SettingsFormData) => {
    if (nightscoutValidator) {
      try {
        setValidationInProgress(true);
        const nsvResponse = await nightscoutValidator.fetchValidationStatus(
          data.nightscoutUrl,
          data.nightscoutToken
        );
        let warnings: DeepMap<SettingsFormData, FieldError> = {};
        if (nsvResponse) {
          if (!nsvResponse.url.pointsToNightscout) {
            warnings.nightscoutUrl = {
              type: "validate",
              message: t(
                "settings.form.helperText.nightscoutUrl.notNightscout"
              ),
            };
          }
          if (nsvResponse.url.pointsToNightscout) {
            if (!nsvResponse.token.isValid) {
              warnings.nightscoutToken = {
                type: "validate",
                message: t("settings.form.helperText.nightscoutToken.invalid"),
              };
            }
            if (
              nsvResponse.nightscout.glucoseUnit !==
              NightscoutBloodGlucoseUnitMapping[data.glucoseUnit]
            ) {
              warnings.glucoseUnit = {
                type: "validate",
                message: t("settings.form.helperText.glucoseUnits.mismatch"),
              };
            }
            if (
              semver.valid(nsvResponse.nightscout.version) &&
              semver.valid(nsvResponse.nightscout.minSupportedVersion) &&
              semver.lt(
                nsvResponse.nightscout.version,
                nsvResponse.nightscout.minSupportedVersion
              )
            ) {
              warnings.nightscoutUrl = {
                type: "validate",
                message: t(
                  "settings.form.helperText.nightscoutUrl.needsUpgrade",
                  {
                    version: nsvResponse.nightscout.minSupportedVersion.toString(),
                  }
                ),
              };
            }
            const userHasSelectedUnsupportedMetrics = data.defaultMetrics
              .filter((metric) => metric !== DiabetesMetric.Everything)
              .map((metric) => nsvResponse.discoveredMetrics.includes(metric))
              .includes(false);
            if (userHasSelectedUnsupportedMetrics === true) {
              warnings.defaultMetrics = [
                {
                  type: "validate",
                  message: t(
                    "settings.form.helperText.defaultMetrics.notAvailable",
                    {
                      version: nsvResponse.nightscout.minSupportedVersion.toString(),
                    }
                  ),
                },
              ];
            }
          }

          // can't do this if component has already been unmounted,
          // you'll leave it (and the connection) hanging
          setSupportedMetrics(nsvResponse.discoveredMetrics);
          setWarnings(warnings);
          setValidationInProgress(false);
        }
      } catch (e) {
        console.log("Unable to fetch validation info for Nightscout site", e);
      }
    }

    // always return no errors, we are using resolver
    // for its lifecycle, but never want to block submission
    return {
      values: data,
      errors: {},
    };
  }, validationDebounceDuration!);

  // clean up any outstanding validation runs
  useEffect(() => {
    return function cleanup() {
      debouncedValidator.cancel();
    };
  }, [debouncedValidator]);

  // eslint-disable-next-line
  const {
    control,
    formState,
    getValues,
    handleSubmit,
    register,
    trigger,
  } = useForm<SettingsFormData>({
    mode: "onChange",
    // TODO: extract
    resolver: nightscoutValidator ? debouncedValidator : undefined,
  });

  // trigger form validation on first component render
  useEffect(() => {
    nightscoutValidator && trigger();
  }, [nightscoutValidator, trigger]);

  const { t } = useTranslation();
  const [formIsSubmitting, setFormIsSubmitting] = useState(false);
  const [formHasSubmissionError, setFormHasSubmissionError] = useState(false);
  const [formHasSubmittedSuccess, setFormHasSubmittedSuccess] = useState(false);
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);

  const canEditFields = !formState.isSubmitting;
  const canSubmitForm = formState.isDirty && !formState.isSubmitting;

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
      setFormIsSubmitting(true);
      await onSubmit(data);
      setFormIsSubmitting(false);
      setFormHasSubmittedSuccess(true);
    } catch (e) {
      setFormHasSubmissionError(true);
    }
  };

  const formReset = () => {
    setFormIsSubmitting(false);
    setFormHasSubmissionError(false);
    setFormHasSubmittedSuccess(false);
  };

  const handleFormSuccessAlertClose = () => {
    formReset();
  };

  const handleCheck = (newMetric: DiabetesMetric) => {
    const { defaultMetrics } = getValues();

    // toggle on or off
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
      <FormControl className="MaterialTextField" fullWidth={true}>
        <InputLabel htmlFor="settings-form-field-url">
          {t("settings.form.labels.nightscoutUrl")}
        </InputLabel>
        <Input
          defaultValue={nightscoutUrl}
          fullWidth={true}
          disabled={!canEditFields}
          id="settings-form-field-url"
          inputProps={{ "data-testid": "settings-form-field-url" }}
          inputRef={register}
          name="nightscoutUrl"
        ></Input>
        {warnings.nightscoutUrl && (
          <FormHelperText className={classes.helperWarning}>
            {warnings.nightscoutUrl.message}
          </FormHelperText>
        )}
      </FormControl>

      <FormControl className="MaterialTextField" fullWidth={true}>
        <InputLabel htmlFor="settings-form-field-token">
          {t("settings.form.labels.nightscoutToken")}
        </InputLabel>
        <Input
          defaultValue={nightscoutToken}
          fullWidth={true}
          disabled={!canEditFields}
          id="settings-form-field-token"
          inputProps={{ "data-testid": "settings-form-field-token" }}
          inputRef={register}
          name="nightscoutToken"
          startAdornment={
            <InputAdornment position="start">
              <Lock />
            </InputAdornment>
          }
        ></Input>
        {warnings.nightscoutToken && (
          <FormHelperText className={classes.helperWarning}>
            {warnings.nightscoutToken.message}
          </FormHelperText>
        )}
        <FormHelperText>
          <Link
            component="button"
            type="button"
            onClick={returnHandleOpenTokenDialog(
              tokenDialogOpen,
              setTokenDialogOpen
            )}
          >
            {t("settings.form.helperText.nightscoutToken.default")}
          </Link>
        </FormHelperText>
      </FormControl>

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

              return metrics.map((metric) => {
                const shouldPresentWarningLabel =
                  metric.value !== DiabetesMetric.Everything &&
                  !warnings.nightscoutUrl &&
                  !warnings.nightscoutToken &&
                  !supportedMetrics.includes(metric.value);

                return (
                  <FormControlLabel
                    className={
                      shouldPresentWarningLabel
                        ? classes.checkboxWithWarning
                        : undefined
                    }
                    control={
                      <Checkbox
                        onChange={() =>
                          props.onChange(handleCheck(metric.value))
                        }
                        checked={
                          everythingIsSelected ||
                          props.value.includes(metric.value)
                        }
                        disabled={
                          !canEditFields ||
                          (everythingIsSelected &&
                            metric.value !== DiabetesMetric.Everything)
                        }
                      />
                    }
                    key={metric.value}
                    label={metric.value}
                  />
                );
              });
            }}
          />
        </FormGroup>
        <FormHelperText
          className={
            warnings.defaultMetrics ? classes.helperWarning : undefined
          }
        >
          {warnings.defaultMetrics
            ? warnings.defaultMetrics[0]?.message
            : t("settings.form.helperText.defaultMetrics.default")}
        </FormHelperText>
      </FormControl>

      <FormControl fullWidth={true} className="MaterialSelect">
        <InputLabel htmlFor="settings-form-field-bg">
          {t("settings.form.labels.glucoseUnits")}
        </InputLabel>
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
        {warnings.glucoseUnit && (
          <FormHelperText className={classes.helperWarning}>
            {warnings.glucoseUnit.message}
          </FormHelperText>
        )}
      </FormControl>

      {validationInProgress && (
        <Container disableGutters={true} maxWidth="lg">
          <FormHelperText
            component="div"
            data-testid="settings-form-validation-progress-indicator"
          >
            <CircularProgress size={10} />{" "}
            {t("settings.form.validationInProgress")}
          </FormHelperText>
        </Container>
      )}

      <Container disableGutters={true} maxWidth="lg">
        <Button
          color="primary"
          data-testid="settings-form-submit"
          type="submit"
          variant="contained"
          disabled={!canSubmitForm}
        >
          {t("settings.form.submitButton")}
        </Button>
      </Container>
    </form>
  );

  return (
    <>
      <Snackbar
        autoHideDuration={alertAutohideDuration}
        open={formIsSubmitting}
      >
        <SettingsFormAlert
          data-testid="settings-form-submitting"
          severity="warning"
        >
          {t("settings.form.submitStatus.submitting")}
        </SettingsFormAlert>
      </Snackbar>
      <Snackbar
        autoHideDuration={alertAutohideDuration}
        onClose={handleFormSuccessAlertClose}
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
        autoHideDuration={alertAutohideDuration}
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

SettingsForm.defaultProps = {
  autohideDuration: ALERT_AUTOHIDE_DURATION,
  alertAutohideDuration: VALIDATION_DEBOUNCE_DURATION,
};
