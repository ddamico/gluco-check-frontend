import React, { useContext } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { firestore } from "../lib/firebase";
import { DEFAULT_USER_DOCUMENT } from "../lib/firebase-helpers";

import SettingsForm from "../components/SettingsForm";
import { SettingsFormData } from "../lib/types";
import {
  FIRESTORE_FIELD_PATH_DEFAULT_POINTERS,
  FIRESTORE_FIELD_PATH_GLUCOSE_UNITS,
  FIRESTORE_FIELD_PATH_NIGHTSCOUT_TOKEN,
  FIRESTORE_FIELD_PATH_NIGHTSCOUT_URL,
} from "../lib/constants";
import { userSettingsFormDataToUserSettingsDocument } from "../lib/transform";
import { FirebaseUserDocumentContext } from "../App";
import { useTranslation } from "react-i18next";
import { Container, makeStyles, Typography } from "@material-ui/core";

export const returnHandleSettingsSave = (userDocumentPath: string) => {
  return async (data: SettingsFormData) => {
    const formDataAsDocument = userSettingsFormDataToUserSettingsDocument(data);
    try {
      await firestore.doc(userDocumentPath).set({
        ...DEFAULT_USER_DOCUMENT,
        ...formDataAsDocument,
      });
    } catch (e) {
      throw new Error(`error saving document ${e.message}`);
    }
  };
};

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(2),
    "& h2": {
      marginBottom: theme.spacing(2),
    },
  },
}));

export default function EditSettings() {
  const classes = useStyles();
  const userDocumentPath = useContext(FirebaseUserDocumentContext);
  const userDocumentReference = firestore.doc(userDocumentPath);

  const [document, loading, error] = useDocument(userDocumentReference);

  const { t } = useTranslation();

  const nightscoutUrl =
    document?.get(FIRESTORE_FIELD_PATH_NIGHTSCOUT_URL) ?? "";
  const nightscoutToken =
    document?.get(FIRESTORE_FIELD_PATH_NIGHTSCOUT_TOKEN) ?? "";
  const defaultPointers =
    document?.get(FIRESTORE_FIELD_PATH_DEFAULT_POINTERS) ?? [];
  const glucoseUnit = document?.get(FIRESTORE_FIELD_PATH_GLUCOSE_UNITS) ?? "";

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Typography variant="h6" component="h2">
        {t("settings.title")}
      </Typography>
      <p>{t("settings.content")}</p>
      {loading && <>{t("status.general.loading")}</>}
      {error && (
        <>
          {t("status.general.error")}: {error.message}
        </>
      )}
      {document && (
        <SettingsForm
          nightscoutUrl={nightscoutUrl}
          nightscoutToken={nightscoutToken}
          glucoseUnit={glucoseUnit}
          defaultPointers={defaultPointers}
          onSubmit={returnHandleSettingsSave(userDocumentPath)}
        />
      )}
    </Container>
  );
}
