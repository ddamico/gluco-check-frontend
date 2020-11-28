import React from "react";
import {
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
}

export default function TokenSetup() {
  const { t } = useTranslation();
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  // TODO: get this out of here, move it into the actual strings file. too expensive.
  const tokenSteps = t("tokenSetup.steps", {
    returnObjects: true,
  }) as TokenStep[];
  return (
    <>
      <Stepper activeStep={activeStep} orientation="vertical">
        {tokenSteps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === 2 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {activeStep === tokenSteps.length - 1
                      ? "Finish"
                      : "Continue"}
                  </Button>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === tokenSteps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} className={classes.button}>
            Reset
          </Button>
        </Paper>
      )}
    </>
  );
}
