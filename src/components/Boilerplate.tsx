import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link, Typography } from "@material-ui/core";

function Boilerplate() {
  const { t } = useTranslation();
  return (
    <>
      <Typography variant="body2">
        <Trans i18nKey="boilerplate.terms">
          By continuing, you are indicating that you accept our{" "}
          <Link href={t("urls.termsAndConditions")}>Terms of Service</Link> and{" "}
          <Link href={t("urls.privacy")}>Privacy Policy</Link>.
        </Trans>
      </Typography>
      <Typography variant="body2">{t("boilerplate.google")}</Typography>
      <Typography variant="body2">
        <Trans i18nKey="boilerplate.nightscout">
          Not affiliated with the{" "}
          <Link href={t("urls.nightscoutProject")}>Nightscout Project</Link>
        </Trans>
      </Typography>
      <Typography variant="body2">
        <Link href={t("urls.faqs")}>{t("boilerplate.faqs")}</Link>
      </Typography>
    </>
  );
}

export default Boilerplate;
