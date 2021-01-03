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
import { NightscoutValidationClient } from "../lib/NightscoutValidationClient/NightscoutValidationClient";
import {
  MOCK_NSV_RESPONSE_VALID,
  MOCK_NSV_RESPONSE_NON_NS_URL,
  MOCK_NSV_RESPONSE_INVALID_TOKEN,
  MOCK_NSV_RESPONSE_NS_NEEDS_UPGRADE,
} from "../lib/__mocks__/gluco-check";
import { NightscoutBloodGlucoseUnitMapping } from "../lib/mappings";

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
  const [warnings, setWarnings] = useState<
    DeepMap<SettingsFormData, FieldError>
  >({});

  // eslint-disable-next-line
  const {
    control,
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

      let warnings: DeepMap<SettingsFormData, FieldError> = {};
      if (!nsvResponse.url.pointsToNightscout) {
        warnings.nightscoutUrl = {
          type: "validation",
          message: t(
            "settings.form.validationText.nightscoutUrl.notNightscout"
          ),
        };
      }
      if (nsvResponse.url.pointsToNightscout) {
        if (!nsvResponse.token.isValid) {
          warnings.nightscoutToken = {
            type: "validation",
            message: t("settings.form.validationText.nightscoutToken.invalid"),
          };
        }
        if (
          nsvResponse.nightscout.glucoseUnit !==
          NightscoutBloodGlucoseUnitMapping[data.glucoseUnit]
        ) {
          warnings.glucoseUnit = {
            type: "validation",
            message: t("settings.form.validationText.glucoseUnits.mismatch"),
          };
        }
        if (
          semver.lt(
            nsvResponse.nightscout.version,
            nsvResponse.nightscout.minSupportedVersion
          )
        ) {
          warnings.nightscoutUrl = {
            type: "validation",
            message: t(
              "settings.form.validationText.nightscoutUrl.needsUpgrade",
              { version: nsvResponse.nightscout.minSupportedVersion.toString() }
            ),
          };
        }
      }

      const userHasSelectedUnsupportedMetrics = data.defaultMetrics
        .filter((metric) => metric !== DiabetesMetric.Everything)
        .map((metric) => nsvResponse.discoveredMetrics.includes(metric))
        .includes(false);
      if (userHasSelectedUnsupportedMetrics === true) {
        warnings.defaultMetrics = [
          {
            type: "validation",
            message: t(
              "settings.form.validationText.defaultMetrics.notAvailable",
              { version: nsvResponse.nightscout.minSupportedVersion.toString() }
            ),
          },
        ];
      }

      setWarnings(warnings);

      // always return no errors, we are using resolver
      // for its lifecycle, but never want to block submission
      return {
        values: data,
        errors: {},
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
        error={!!warnings.defaultMetrics}
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
          {warnings.defaultMetrics
            ? warnings.defaultMetrics[0]?.message
            : t("settings.form.helperText.defaultMetrics")}
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
        error={!!warnings.nightscoutUrl}
        helperText={
          warnings.nightscoutUrl ? warnings.nightscoutUrl.message : undefined
        }
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
        error={!!warnings.nightscoutToken}
        helperText={
          warnings.nightscoutToken ? (
            warnings.nightscoutToken.message
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
      />

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
          error={!!warnings.glucoseUnit}
        />
        {warnings.glucoseUnit && (
          <FormHelperText>{warnings.glucoseUnit.message}</FormHelperText>
        )}
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
