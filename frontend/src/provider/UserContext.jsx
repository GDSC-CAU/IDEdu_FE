import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [isTeacher, setIsTeacher] = useState(false);

  return (
    <UserContext.Provider value={{ isTeacher, setIsTeacher }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
