import React from "react";
import { auth } from "./lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import EditSettings from "./pages/EditSettings";
import { getDocumentPathForUser } from "./lib/firebase-helpers";

export const FirebaseUserDocumentContext = React.createContext("");

export default function App() {
  const [user, loading] = useAuthState(auth);
  let Content: React.ReactElement | null = null;
  if (user) {
    const docPath = getDocumentPathForUser(user);
    Content = (
      <FirebaseUserDocumentContext.Provider value={docPath}>
        <EditSettings />;
      </FirebaseUserDocumentContext.Provider>
    );
  } else {
    if (!loading) {
      Content = <Landing />;
    }
  }
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {!user && (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
          {user && (
            <li>
              <button
                onClick={() => {
                  auth.signOut();
                }}
              >
                  Logout
              </button>
            </li>
          )}
        </ul>

        <hr />
        <Switch>
          <Route exact path="/">
            {Content}
          </Route>
          <Route path="/login">
            <Login />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
