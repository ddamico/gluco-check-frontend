import React, { useContext } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { firestore } from "../lib/firebase";
import { DEFAULT_USER_DOCUMENT } from "../lib/firebase-helpers";

import Container from "../components/Container";
import SettingsForm from "../components/SettingsForm";
import { SettingsFormData } from "../lib/types";
import {
  FIRESTORE_FIELD_PATH_GLUCOSE_UNITS,
  FIRESTORE_FIELD_PATH_NIGHTSCOUT_TOKEN,
  FIRESTORE_FIELD_PATH_NIGHTSCOUT_URL,
} from "../lib/constants";
import { userSettingsFormDataToUserSettingsDocument } from "../lib/transform";
import { FirebaseUserDocumentContext } from "../App";
import { useTranslation } from "react-i18next";

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

// @TODO: add success and error states to this, and set them in the handler?
export default function EditSettings() {
  const userDocumentPath = useContext(FirebaseUserDocumentContext);
  const userDocumentReference = firestore.doc(userDocumentPath);

  const [document, loading, error] = useDocument(userDocumentReference);

  const { t } = useTranslation();

  const nightscoutUrl =
    document?.get(FIRESTORE_FIELD_PATH_NIGHTSCOUT_URL) ?? "";
  const nightscoutToken =
    document?.get(FIRESTORE_FIELD_PATH_NIGHTSCOUT_TOKEN) ?? "";
  const glucoseUnit = document?.get(FIRESTORE_FIELD_PATH_GLUCOSE_UNITS) ?? "";

  return (
    <Container>
      <h2>{t("settings.title")}</h2>
      {loading && <>Loading stuff!</>}
      {error && <>Something has gone horribly wrong: {error.message}</>}
      {document && (
        <SettingsForm
          nightscoutUrl={nightscoutUrl}
          nightscoutToken={nightscoutToken}
          glucoseUnit={glucoseUnit}
          onSubmit={returnHandleSettingsSave(userDocumentPath)}
        />
      )}
    </Container>
  );
}
