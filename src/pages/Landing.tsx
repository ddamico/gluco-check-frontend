import React from "react";
import { useTranslation } from "react-i18next";
import { Container, Grid, makeStyles, Typography } from "@material-ui/core";

import * as firebase from "firebase/app";
import * as firebaseui from "firebaseui";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { auth } from "../lib/firebase";

const assistantIcon = require("../images/icon-assistant.svg");

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(2),
    textAlign: "center",
  },
  contentGrid: {
    height: "90vh",
  },
  utterance: {
    fontWeight: "bold",
  },
  callResponseContainer: {
    "& p": {
      marginBottom: theme.spacing(2),
    },
    display: "inline-block",
    "& img": {
      width: "54px",
      height: "54px",
      display: "block",
      paddingBottom: theme.spacing(2),
    },
    "& .assistantBubble-response": {
      padding: "14px 24px",
      border: "2px solid #e8eaed",
      borderRadius: "62px",
      display: "inline-block",
    },
    [theme.breakpoints.down("sm")]: {
      "& .assistantBubble-response": {
        fontSize: ".9rem",
      },
    },
  },
}));

function Landing() {
  const classes = useStyles();
  const { t } = useTranslation();

  const firebaseUIConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInFlow: "redirect",
    signInSuccessUrl: "/",
    signInOptions: [
      {
        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        fullLabel: "Let's get started",
      },
    ],
  };

  return (
    <Grid
      className={classes.contentGrid}
      container
      direction="column"
      justify="center"
      alignItems="center"
      spacing={2}
    >
      <Grid item>
        <Container maxWidth="md">
          <div className={classes.callResponseContainer}>
            <Typography variant="h5" component="p">
              Hey Google, ask Gluco Check my blood sugar
            </Typography>
            <div>
              <img src={assistantIcon} alt=""></img>
              <Typography
                variant="h5"
                component="p"
                className="assistantBubble-response"
                noWrap
              >
                6.5 and steady as of five minutes ago
              </Typography>
            </div>
          </div>
        </Container>
      </Grid>
      <Grid item>
        <Container maxWidth="sm">
          <Typography variant="body1">
            {t("landing.introduction.p1")}{" "}
            <span className={classes.utterance}>
              Hey Google, ask Gluco Check my BG
            </span>
            . Or{" "}
            <span className={classes.utterance}>
              Hey Google, ask Gluco Check my sensor's age
            </span>
            . Or{" "}
            <span className={classes.utterance}>
              Hey Google, ask Gluco Check my IOB
            </span>
            .
          </Typography>
        </Container>
      </Grid>
      <Grid item>
        <StyledFirebaseAuth uiConfig={firebaseUIConfig} firebaseAuth={auth} />
      </Grid>
    </Grid>
  );
}

export default Landing;
