import React from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { firestore } from "../lib/firebase";

import Container from "../components/Container";
import SettingsForm from "../components/SettingsForm";

interface EditSettingsProps {
  user: firebase.User;
}

export default function EditSettings({ user }: EditSettingsProps) {
  const documentPath = `users/${user.email}`;
  const [document, loading, error] = useDocument(firestore.doc(documentPath));

  return (
    <Container>
      {loading && <>Loading stuff!</>}
      {error && <>Something has gone horribly wrong: {error.message}</>}
      {document && <SettingsForm userData={document} />}
    </Container>
  );
}
