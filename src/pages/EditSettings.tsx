import React from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { firestore } from "../lib/firebase";

import Container from "../components/Container";
import SettingsForm from "../components/SettingsForm";

interface EditSettingsProps {
  user: firebase.User;
}

export default function EditSettings({ user }: EditSettingsProps) {
  const [document, loading, error] = useDocument(
    firestore.doc(`users/${user.uid}`)
  );

  console.log(document, loading, error);

  return (
    <Container>
      {loading && <>Loading stuff!</>}
      {error && <>Something has gone horribly wrong</>}
      {document && <SettingsForm />}
    </Container>
  );
}
