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
import Boilerplate from "../components/Boilerplate";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(2),
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
    height: "90vh",
    "& img": {
      width: "54px",
      height: "54px",
      marginRight: theme.spacing(2),
      marginBottom: theme.spacing(2),
      verticalAlign: "middle",
    },
  },
  boilerplate: {
    textAlign: "center",
  },
}));

function Welcome() {
  const classes = useStyles();
  const { t } = useTranslation();

  // const featuresList = [
  //   t("landing.introduction.features1"),
  //   t("landing.introduction.features2"),
  //   t("landing.introduction.features3"),
  //   t("landing.introduction.features4"),
  //   t("landing.introduction.features5"),
  //   t("landing.introduction.features6"),
  //   t("landing.introduction.features7"),
  // ];

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
        <Typography variant="body1">
          Start by{" "}
          <Link href="/settings">
            adding configuration info for your Nightscout site
          </Link>
          .
        </Typography>
      </Grid>
      <Grid item className={classes.boilerplate}>
        <Boilerplate />
      </Grid>
    </Grid>
  );
}

export default Welcome;
