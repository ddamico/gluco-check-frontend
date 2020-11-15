import React from "react";
import {
  Box,
  Button,
  makeStyles,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
// import image1 from "../img/token-instructions/"

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 400,
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
}));

interface TokenStep {
  label: string;
  description: string;
  image?: string;
  image_alt?: string;
}

const TOKEN_IMAGE_PATH = "../img/token-instructions";

export default function TokenSetup() {
  const { t } = useTranslation();
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    console.log("handleback");
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const tokenSteps: TokenStep[] =
    t("tokenDialog.steps", {
      returnObjects: true,
    }) ?? [];

  const steps = tokenSteps.map((step) => step.label);
  const stepContent = tokenSteps.map((step) => step.description);

  return (
    <div className={classes.root}>
      <Typography>{t("tokenDialog.preamble")}</Typography>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => {
          const step = tokenSteps[index];
          const stepImage = step.image
            ? require(`${TOKEN_IMAGE_PATH}/${step.image}`)
            : undefined;
          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                <Typography>{step.description}</Typography>
                {stepImage && <img src={stepImage} alt={step.image_alt} />}
                <div className={classes.actionsContainer}>
                  <div>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className={classes.button}
                      data-testid="token-stepper-back"
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      className={classes.button}
                      data-testid="token-stepper-next"
                    >
                      {activeStep === steps.length - 1 ? "Finish" : "Next"}
                    </Button>
                  </div>
                </div>
              </StepContent>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button
            onClick={handleReset}
            className={classes.button}
            data-testid="token-stepper-reset"
          >
            Reset
          </Button>
        </Paper>
      )}
    </div>
  );
}
