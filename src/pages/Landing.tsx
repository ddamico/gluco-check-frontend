import React from "react";
import { useTranslation } from "react-i18next";
import {
  Container,
  Grid,
  Link,
  makeStyles,
  Typography,
} from "@material-ui/core";

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
    "& .assistantBubble img": {
      width: "54px",
      height: "54px",
      display: "block",
      paddingBottom: theme.spacing(2),
      float: "right",
    },
    "& .assistantBubble-question, & .assistantBubble-response": {},
    "& .assistantBubble p": {
      clear: "both",
      marginBottom: theme.spacing(2),
      padding: "14px 30px",
      borderRadius: "62px",
      borderWidth: "2px",
      borderStyle: "solid",
    },
    "& .assistantBubble-question": {
      textAlign: "start",
      alignSelf: "flex-start",
    },
    "& .assistantBubble-question p": {
      backgroundColor: "#ccc",
      borderColor: "#ccc",
      maxWidth: "70%",
    },
    "& .assistantBubble-response": {
      textAlign: "end",
      alignSelf: "flex-end",
    },
    "& .assistantBubble-response p": {
      borderColor: "#e8eaed",
      textAlign: "inline-end",
    },
    [theme.breakpoints.down("sm")]: {
      "& .assistantBubble-response, & .assistantBubble-response": {
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
        fullLabel: t("login.buttonLabel"),
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
          <Grid
            container
            direction="column"
            className={classes.callResponseContainer}
          >
            <Grid item className="assistantBubble assistantBubble-question">
              <Typography variant="h5" component="p">
                Hey Google, ask Gluco Check my blood sugar
              </Typography>
            </Grid>
            <Grid item className="assistantBubble assistantBubble-response">
              <img src={assistantIcon} alt=""></img>
              <Typography variant="h5" component="p">
                6.5 and steady as of five minutes ago
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Grid>
      <Grid item>
        <Container maxWidth="sm">
          <Typography variant="body1">
            {t("landing.introduction.p1")}{" "}
            <span className={classes.utterance}>
              "Hey Google, ask Gluco Check my BG"
            </span>
            . Or{" "}
            <span className={classes.utterance}>
              "Hey Google, ask Gluco Check my sensor's age"
            </span>
            . Or{" "}
            <span className={classes.utterance}>
              "Hey Google, ask Gluco Check my IOB"
            </span>
            .
          </Typography>
        </Container>
      </Grid>
      <Grid item>
        <StyledFirebaseAuth uiConfig={firebaseUIConfig} firebaseAuth={auth} />
      </Grid>
      <Grid item>
        <Typography variant="body2">
          By continuing, you are indicating that you accept our{" "}
          <Link href={t("urls.termsAndConditions")}>Terms of Service</Link> and{" "}
          <Link href={t("urls.privacy")}>Privacy Policy</Link>.
        </Typography>
      </Grid>
    </Grid>
  );
}

export default Landing;
