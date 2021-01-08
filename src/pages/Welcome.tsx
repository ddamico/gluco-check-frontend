import React from "react";
import { useTranslation } from "react-i18next";
import {
  Container,
  Grid,
  Link,
  makeStyles,
  Typography,
} from "@material-ui/core";

const assistantIcon = require("../images/icon-assistant.svg");

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
      marginRight: theme.spacing(1),
    },
  },
}));

function Welcome() {
  const classes = useStyles();
  const { t } = useTranslation();

  const featuresList = [
    t("landing.introduction.features1"),
    t("landing.introduction.features2"),
    t("landing.introduction.features3"),
    t("landing.introduction.features4"),
    t("landing.introduction.features5"),
    t("landing.introduction.features6"),
    t("landing.introduction.features7"),
  ];

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
          <Typography variant="h3" component="h2">
            <img src={assistantIcon} alt="" />
            {t("landing.title")}
          </Typography>
        </Container>
      </Grid>
      <Grid item>
        <Container maxWidth="sm" className={classes.bodyContent}>
          <Typography variant="body1">
            Start by{" "}
            <Link href="/settings">
              adding configuration info for your Nightscout site
            </Link>
            .
          </Typography>
          <Typography variant="body1">
            Most metrics available on your Nightscout site can be accessed from
            Gluco Check. Ask it things like "Hey Google, ask Gluco Check...
          </Typography>
          <Typography variant="body1" component="ul">
            {featuresList.map((feature, index) => (
              <li key={`feature-${index}`}>{feature}</li>
            ))}
          </Typography>
        </Container>
      </Grid>
    </Grid>
  );
}

export default Welcome;
