import React from "react";
import * as firebase from "firebase/app";
import * as firebaseui from "firebaseui";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { auth } from "../lib/firebase";

function Login() {
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

  return (
    <div>
      <h2>Login</h2>
      <StyledFirebaseAuth uiConfig={firebaseUIConfig} firebaseAuth={auth} />
    </div>
  );
}

export default Login;
