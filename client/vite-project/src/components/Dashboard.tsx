import React, { JSX } from "react";
import { useInfoContext } from "../context/UserContext";
import Header from "./Header";
import AllNotes from "./AllNotes";
import ContentForm from "./ContentForm";

function Dashoard():JSX.Element{
    const {addContent} :any = useInfoContext()

    return(
        <div className="grid relative grid-cols-1 grid-rows-12   bg-gray-800 w-full h-full">
            {addContent?
                <div className="fixed inset-0 w-full h-full p-5 flex justify-center items-center z-50  bg-opacity-70 backdrop-blur-sm">
                <div className="px-5">
                  <ContentForm />
                </div>
              </div>
                  : null
            }
            <div className="row-span-2 md:row-span-1">
                <Header />
            </div>
            <div className="row-span-10 md:row-span-11">
            <AllNotes />
            </div>
        </div>
    )
}

export default React.memo(Dashoard)