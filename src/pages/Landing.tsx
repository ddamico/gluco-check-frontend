import React from "react";
import { useTranslation } from "react-i18next";
import {
  Container,
  Grid,
  Link,
  makeStyles,
  Typography,
} from "@material-ui/core";
import Onboarding from "../components/Onboarding";

import * as firebase from "firebase/app";
import * as firebaseui from "firebaseui";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { auth } from "../lib/firebase";
import Boilerplate from "../components/Boilerplate";

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
  boilerplate: {
    textAlign: "center",
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
        <Onboarding />
      </Grid>
      <Grid item>
        <Container maxWidth="sm">
          <Typography variant="body1">
            {t("landing.introduction.p1")}
          </Typography>
        </Container>
      </Grid>
      <Grid item>
        <StyledFirebaseAuth uiConfig={firebaseUIConfig} firebaseAuth={auth} />
      </Grid>
      <Grid item className={classes.boilerplate}>
        <Boilerplate />
      </Grid>
    </Grid>
  );
}

export default Landing;
