import { ChangeEvent, MouseEvent,  } from "react"

export type HeadType={
    value:string,
    link?:string,
    linkValue?:string
}
export enum types {
    text="text",
    password="password",
    email="email",

}
export type InputTypes = {
    name: string;
    lableName: string;
    type: types;
    value: string;
    placeholder:string;
    error:string,
    handelChange: (e: ChangeEvent<HTMLInputElement>) => void;
  };


  export interface UserDataType {
    name:string,
    password:string,
    email:string
  }

  export interface ButtonType {
    value: string;
    handelSubmit: (e: MouseEvent<HTMLDivElement>) => void;
  }
  
  export type UserType = {
    id?:string,
    name?: string;
    email?: string;
    created?: string,
    updated?: string,
    isValid?: boolean

  } | null;

 export interface UserContextType {
    user: UserType;
    setUser: React.Dispatch<React.SetStateAction<UserType>>;
  }
  