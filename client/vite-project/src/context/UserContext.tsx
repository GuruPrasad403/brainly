import  { createContext, useState, useContext, JSX, ReactNode } from "react";
import { UserType,UserContextType } from "../types/HeadType";

const userContext = createContext<UserContextType | undefined>(undefined);

export const useInfoContext  = ()=>{
    return useContext(userContext)
}

function UserProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<UserType>(null);

  return (
    <userContext.Provider value={{ user, setUser }}>
      {children}
    </userContext.Provider>
  );
}

export function useUser() {
  const context = useContext(userContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export default UserProvider;
