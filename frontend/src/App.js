import React from "react";
import { IDEduRouter } from "./router/routes";
import { UserProvider } from "./provider/UserContext";

function App() {
  return (
    <main className="min-h-screen max-h-screen h-full w-full bg-white flex items-center justify-center">
      <UserProvider>
        <IDEduRouter />
      </UserProvider>
    </main>
  );
}

export default App;
