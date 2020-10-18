import React from "react";
import { useTranslation } from "react-i18next";

function Landing() {
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
    <div>
      <h2>{t("landing.title")}</h2>
      <p>{t("landing.introduction.p1")}</p>
      <ul>
        {featuresList.map((feature, index) => (
          <li key={`feature-${index}`}>{feature}</li>
        ))}
      </ul>
    </div>
  );
}

export default Landing;
