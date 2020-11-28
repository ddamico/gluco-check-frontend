import React from "react";
import { useTranslation } from "react-i18next";

type TokenSetupProps = {};

export default function TokenSetup() {
  const { t } = useTranslation();
  return (
    <>
      <p>{t("tokenDialog.preamble")}</p>
      <ol>
        <li>{t("tokenDialog.step1")}</li>
        <li>{t("tokenDialog.step2")}</li>
        <li>{t("tokenDialog.step3")}</li>
        <li>{t("tokenDialog.step4")}</li>
        <li>{t("tokenDialog.step5")}</li>
        <li>{t("tokenDialog.step6")}</li>
        <li>{t("tokenDialog.step7")}</li>
      </ol>
    </>
  );
}
