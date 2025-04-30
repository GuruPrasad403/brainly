import React, { JSX }  from "react";
import { ButtonType } from "../types/HeadType";

function Button(prop:ButtonType):JSX.Element{
    return(
        <div onClick={prop?.handelSubmit} className="w-full h-full bg-white text-black text-center  text-md md:text-lg py-2.5 px-5 cursor-pointer">
            {prop?.value}
        </div>
    )
}


export default React.memo(Button)