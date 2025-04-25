import  { createContext, useState, useContext, JSX, ReactNode } from "react";
import { UserType,UserContextType } from "../types/HeadType";
import { ContentTypes } from "../types/content.types";

const userContext = createContext<UserContextType | undefined>(undefined);

export const useInfoContext  = ()=>{
    return useContext(userContext)
}

function UserProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<UserType>(null);
  const [addContent,setAddContent] = useState<boolean>(false)
  const [notes,setNotes] = useState<ContentTypes[]>([{
    title:"",
    link:"",
    description:"",
    tags:[""],
    type : ""
  }])
  return (
    <userContext.Provider value={{ user, setUser, addContent,setAddContent, notes,setNotes}}>
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
