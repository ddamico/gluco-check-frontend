import React from "react";
import { auth } from "./lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { getDocumentPathForUser } from "./lib/firebase-helpers";
import { useTranslation } from "react-i18next";
import {
  AppBar,
  Container,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { ExitToApp, Home, Settings } from "@material-ui/icons";

import Landing from "./pages/Landing";
import Legal from "./pages/Legal";
import EditSettings from "./pages/EditSettings";
import Welcome from "./pages/Welcome";
import "./App.css";

export const FirebaseUserDocumentContext = React.createContext("");

const useStyles = makeStyles((theme) => ({
  root: {},
  container: {
    paddingTop: theme.spacing(2),
  },
  leftToolbar: {},
  rightToolbar: {
    marginLeft: "auto", // switch to logical
    marginRight: -12,
  },
  nav: {
    "&, & > li": {
      margin: 0,
      padding: 0,
      listStyle: "none",
    },
    "& > li": {
      display: "inline-block",
    },
  },
  toolbar: {},
  navTitle: {},
}));

export default function App() {
  const classes = useStyles();
  const [user, loading] = useAuthState(auth);
  const { t } = useTranslation();
  const docPath = user ? getDocumentPathForUser(user) : ""; // TODO: we don't want this empty path to be possible, AND we want to auth protect any other authed routes

  let Content: React.ReactElement | null = null;
  if (user) {
    Content = <Welcome />;
  } else {
    if (!loading) {
      Content = <Landing />;
    }
  }

  const navigation = (
    <AppBar position="static">
      <Toolbar variant="regular" className={classes.toolbar}>
        <section className={classes.leftToolbar}>
          <Typography
            variant="h6"
            component="h1"
            color="inherit"
            className={classes.navTitle}
          >
            {t("title")}
          </Typography>
        </section>
        <section className={classes.rightToolbar}>
          <ul className={classes.nav}>
            {user && (
              <li>
                <IconButton
                  aria-label={t("navigation.home")}
                  color="inherit"
                  component={Link}
                  data-testid="navigation-home"
                  to="/"
                >
                  <Home />
                </IconButton>
              </li>
            )}
            {user && (
              <li>
                <IconButton
                  aria-label={t("navigation.settings")}
                  color="inherit"
                  component={Link}
                  data-testid="navigation-settings"
                  to="/settings"
                >
                  <Settings />
                </IconButton>
              </li>
            )}
            {user && (
              <li>
                <IconButton
                  aria-label={t("navigation.logout")}
                  color="inherit"
                  onClick={() => {
                    auth.signOut();
                  }}
                  data-testid="logout"
                >
                  <ExitToApp />
                </IconButton>
              </li>
            )}
          </ul>
        </section>
      </Toolbar>
    </AppBar>
  );

  return (
    <Router>
      {navigation}
      <Container maxWidth="md">
        <Switch>
          <Route exact path="/">
            {Content}
          </Route>
          <Route path="/legal">
            <Legal />
          </Route>
          {user && (
            <Route path="/settings">
              <FirebaseUserDocumentContext.Provider value={docPath}>
                <EditSettings />
              </FirebaseUserDocumentContext.Provider>
            </Route>
          )}
        </Switch>
      </Container>
    </Router>
  );
}
