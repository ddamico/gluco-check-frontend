import React from "react";
import { useTranslation } from "react-i18next";
import { Container, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(2),
  },
}));

function Landing() {
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
    <Container maxWidth="xl" className={classes.container}>
      <Typography variant="h6" component="h2">
        {t("landing.title")}
      </Typography>
      <p>{t("landing.introduction.p1")}</p>
      <ul>
        {featuresList.map((feature, index) => (
          <li key={`feature-${index}`}>{feature}</li>
        ))}
      </ul>
    </Container>
  );
}

export default Landing;
