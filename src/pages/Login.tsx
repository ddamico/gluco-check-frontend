import React from "react";
import * as firebase from "firebase/app";
import * as firebaseui from "firebaseui";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { Container, makeStyles, Typography } from "@material-ui/core";
import { auth } from "../lib/firebase";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(2),
  },
}));

function Login() {
  const classes = useStyles();
  const firebaseUIConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInFlow: "redirect",
    signInSuccessUrl: "/",
    signInOptions: [
      // firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      // firebase.auth.GithubAuthProvider.PROVIDER_ID,
      // "apple.com",
    ],
  };

  const { t } = useTranslation();

  return (
    <Container maxWidth="xl" className={classes.container}>
      <Typography variant="h6" component="h2">
        {t("login.title")}
      </Typography>
      <StyledFirebaseAuth uiConfig={firebaseUIConfig} firebaseAuth={auth} />
    </Container>
  );
}

export default Login;
