import React from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  Container,
  Grid,
  Link,
  makeStyles,
  Typography,
} from "@material-ui/core";
import Onboarding from "../components/Onboarding";
import Boilerplate from "../components/Boilerplate";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(2),
    textAlign: "center",
  },
  subtitle: {
    marginBottom: theme.spacing(2),
    textAlign: "center",
  },
  bodyContent: {
    "& p": {
      marginBottom: theme.spacing(2),
    },
    "& ul li": {
      listStyle: "none",
      marginBottom: theme.spacing(1),
      fontWeight: 600,
    },
  },
  contentGrid: {
    minHeight: "90vh",
  },
  boilerplate: {
    textAlign: "center",
    marginTop: theme.spacing(2),
    "& p": {
      marginBottom: theme.spacing(1),
    },
  },
}));

function Welcome() {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Grid
      className={classes.contentGrid}
      container
      direction="column"
      justify="center"
      alignItems="center"
      spacing={2}
      wrap="nowrap"
    >
      <Grid item className={classes.subtitle}>
        <Container maxWidth="sm">
          <Typography variant="h5" component="h2">
            {t("welcome.subtitle")}
          </Typography>
        </Container>
      </Grid>
      <Grid item>
        <Onboarding />
      </Grid>
      <Grid item>
        <Typography variant="body1">
          <Trans i18nKey="welcome.cta">
            Start by{" "}
            <Link href="/settings">
              adding configuration info for your Nightscout site
            </Link>
            .
          </Trans>
        </Typography>
      </Grid>
      <Grid item className={classes.boilerplate}>
        <Boilerplate />
      </Grid>
    </Grid>
  );
}

export default Welcome;
