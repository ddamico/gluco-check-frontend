import React from "react";
import { useTranslation } from "react-i18next";
import { Link, Typography } from "@material-ui/core";

function Boilerplate() {
  const { t } = useTranslation();
  return (
    <>
      <Typography variant="body2">
        By continuing, you are indicating that you accept our{" "}
        <Link href={t("urls.termsAndConditions")}>Terms of Service</Link> and{" "}
        <Link href={t("urls.privacy")}>Privacy Policy</Link>.
      </Typography>
      <Typography variant="body2">
        Google Assistant is a trademark of Google Inc.
      </Typography>
      <Typography variant="body2">
        Not affiliated with the{" "}
        <Link href={t("urls.nightscoutProject")}>Nightscout Project</Link>
      </Typography>
    </>
  );
}

export default Boilerplate;
