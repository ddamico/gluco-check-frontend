import React, { ReactEventHandler } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    "& p": {
      fontSize: ".5rem",
    },
    "& a": {
      fontSize: ".6rem",
      cursor: "pointer",
    },
  },
}));

type BoilerplateProps = {
  handleSignoutClicked?: ReactEventHandler;
};

function Boilerplate({ handleSignoutClicked }: BoilerplateProps) {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography>
        <Trans i18nKey="boilerplate.terms">
          By continuing, you are indicating that you accept our{" "}
          <Link href={t("urls.termsAndConditions")}>Terms of Service</Link> and{" "}
          <Link href={t("urls.privacy")}>Privacy Policy</Link>.
        </Trans>
      </Typography>
      <Typography>{t("boilerplate.google")}</Typography>
      <Typography>
        <Trans i18nKey="boilerplate.nightscout">
          Not affiliated with the{" "}
          <Link href={t("urls.nightscoutProject")}>Nightscout Project</Link>
        </Trans>
      </Typography>
      {handleSignoutClicked && (
        <Link onClick={handleSignoutClicked}>{t("boilerplate.logout")}</Link>
      )}
    </div>
  );
}

export default Boilerplate;
