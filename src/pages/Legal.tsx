import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { Container, Grid, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {},
  contentGrid: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    "& p, & h2, & h3": {
      marginBottom: theme.spacing(1),
    },
    "& section": {
      marginBottom: theme.spacing(3),
    },
  },
}));

function Legal() {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.contentGrid}
      >
        <Grid item>
          <Container component="section" maxWidth="md">
            <Typography variant="h5" component="h2">
              {t("termsOfService.title")}
            </Typography>
            <Typography variant="body1" component="h3">
              {t("termsOfService.subtitle")}
            </Typography>
            <Typography variant="body1" component="p">
              {t("termsOfService.p1")}
            </Typography>
            <Typography variant="body1" component="p">
              {t("termsOfService.p2")}
            </Typography>
            <Typography variant="body1" component="p">
              {t("termsOfService.p3")}
            </Typography>
          </Container>
          <Container component="section" maxWidth="md">
            <Typography variant="h5" component="h2">
              {t("medicalDisclaimer.title")}
            </Typography>
            <Typography variant="body1" component="p">
              {t("medicalDisclaimer.p1")}
            </Typography>
          </Container>
          <Container component="section" maxWidth="md">
            <Typography variant="h5" component="h2">
              {t("privacyPolicy.title")}
            </Typography>
            <Typography variant="body1" component="h3">
              {t("privacyPolicy.p1.title")}
            </Typography>
            <Typography variant="body1" component="p">
              {t("privacyPolicy.p1.body")}
            </Typography>
            <Typography variant="body1" component="h3">
              {t("privacyPolicy.p2.title")}
            </Typography>
            <Typography variant="body1" component="p">
              {t("privacyPolicy.p2.body")}
            </Typography>
            <Typography variant="body1" component="h3">
              {t("privacyPolicy.p3.title")}
            </Typography>
            <Typography variant="body1" component="p">
              <Trans key="privacyPolicy.p3.body">
                Your email address or Nightscout URL will <strong>never</strong>{" "}
                be shared with a third party. I just need it so I know which
                Nightscout site to check when you invoke the Action. Data from
                your Nightscout website is not saved, not even to log files.
              </Trans>
            </Typography>
            <Typography variant="body1" component="h3">
              {t("privacyPolicy.p4.title")}
            </Typography>
            <Typography variant="body1" component="p">
              {t("privacyPolicy.p4.body")}
            </Typography>
            <Typography variant="body1" component="h3">
              {t("privacyPolicy.p5.title")}
            </Typography>
            <Typography variant="body1" component="p">
              <Trans key="privacyPolicy.p5.body">
                After you sign in to this site, some anonymous statistics about
                your visit are collected using a cookie (Google Analytics). The
                cookie is not enabled until after you've accepted this Privacy
                Policy. I'm using Analytics to better understand how people are
                using this website, how they found it, and which demographic
                they're in. This only applies to this site, not to usage of the
                Assistant Action itself. If you'd like to opt-out of the Google
                Analytics cookie, you can do so by visiting{" "}
                <a href="https://tools.google.com/dlpage/gaoptout">
                  https://tools.google.com/dlpage/gaoptout/
                </a>
              </Trans>
            </Typography>
          </Container>
        </Grid>
      </Grid>
    </>
  );
}

export default Legal;
