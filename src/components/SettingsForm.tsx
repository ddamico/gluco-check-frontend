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
import { BloodGlucoseUnits, DiabetesPointer } from "../lib/enums";
import { SettingsFormData } from "../lib/types";
import { ALERT_AUTOHIDE_DURATION } from "../lib/constants";
import TokenSetup from "../components/TokenSetup";

type SettingsFormProps = {
  nightscoutUrl: string;
  nightscoutToken: string;
  glucoseUnit: BloodGlucoseUnits;
  defaultPointers: DiabetesPointer[]; // @TODO: not optional
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
  defaultPointers,
  onSubmit,
}: SettingsFormProps) {
  const classes = useStyles();
  // eslint-disable-next-line
  const {
    control,
    formState,
    getValues,
    handleSubmit,
    register,
    reset: resetForm,
  } = useForm<SettingsFormData>();
  const { t } = useTranslation();
  const [formHasSubmissionError, setFormHasSubmissionError] = useState(false);
  const [formHasSubmittedSuccess, setFormHasSubmittedSuccess] = useState(false);
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);

  const canEditFields = !formState.isSubmitting;
  const canSubmitForm = formState.isDirty && !formState.isSubmitting;

  const glucoseUnits = Object.entries(BloodGlucoseUnits).map(([_, v]) => {
    return { label: v, value: v };
  });

  const pointers = Object.entries(DiabetesPointer).map(
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
    resetForm();
  };

  const handleFormAlertClose = () => {
    setFormHasSubmittedSuccess(false);
  };

  const handleCheck = (newPointer: DiabetesPointer) => {
    const { defaultPointers } = getValues();
    const newPointers = defaultPointers?.includes(newPointer)
      ? defaultPointers?.filter((pointer) => pointer !== newPointer)
      : [...defaultPointers, newPointer];
    return newPointers;
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
          {t("settings.form.labels.defaultPointers")}
        </FormLabel>
        <FormGroup row className={classes.checkboxArray}>
          {/* see https://github.com/react-hook-form/react-hook-form/issues/1517,
          https://codesandbox.io/s/material-demo-forked-8lbmn?file=/demo.js:1808-1847 */}
          <Controller
            control={control}
            name="defaultPointers"
            defaultValue={defaultPointers}
            // @ts-ignore
            render={(props) => {
              return pointers.map((pointer) => (
                <FormControlLabel
                  disabled={!canEditFields}
                  control={
                    <Checkbox
                      onChange={() =>
                        props.onChange(handleCheck(pointer.value))
                      }
                      checked={props.value.includes(pointer.value)}
                    />
                  }
                  key={pointer.value}
                  label={pointer.value}
                />
              ));
            }}
          />
        </FormGroup>
        <FormHelperText>
          {t("settings.form.helperText.defaultPointers")}
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
