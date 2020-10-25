import React from "react";
import { auth } from "./lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import EditSettings from "./pages/EditSettings";
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

export const FirebaseUserDocumentContext = React.createContext("");

const useStyles = makeStyles((theme) => ({
  root: {},
  nav: {
    alignItems: "flex-end",
    "&, & > li": {
      margin: 0,
      padding: 0,
      listStyle: "none",
    },
    "& > li": {
      display: "inline-block",
    },
  },
  toolbar: {
    display: "flex",
    flexGrow: 1,
  },
  navTitle: {
    alignItems: "flex-start",
  },
}));

export default function App() {
  const [user, loading] = useAuthState(auth);
  const { t } = useTranslation();
  const classes = useStyles();
  let Content: React.ReactElement | null = null;
  const docPath = user ? getDocumentPathForUser(user) : ""; // TODO: we don't want this empty path to be possible, AND we want to auth protect any other authed routes
  if (user) {
    Content = <>Welcome</>;
  } else {
    if (!loading) {
      Content = <Landing />;
    }
  }
  return (
    <Router>
      <AppBar position="static">
        <Toolbar variant="regular" className={classes.toolbar}>
          <Typography
            variant="h6"
            component="h1"
            color="inherit"
            className={classes.navTitle}
          >
            {t("title")}
          </Typography>
          <ul className={classes.nav}>
            <li>
              <IconButton
                aria-label={t("navigation.home")}
                color="inherit"
                component={Link}
                data-testid="navigation-home"
                to="/home"
              >
                <Home />
              </IconButton>
            </li>
            {!user && (
              <li>
                <Link to="/login" data-testid="navigation-login">
                  {t("navigation.login")}
                </Link>
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
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl">
        <Switch>
          <Route exact path="/">
            {Content}
          </Route>
          <Route path="/login">
            <Login />
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
