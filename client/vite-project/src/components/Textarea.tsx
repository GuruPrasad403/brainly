import React, { JSX } from "react"
import { InputTypes } from "../types/HeadType"

function Textarea(prop : InputTypes):JSX.Element{
    return(
        <div className="flex justify-around items-start w-full h-full gap-5 flex-col my-1 font-semibold">
            <label htmlFor={prop?.name} className="text-md md:text-lg lg:text-xl">{prop?.lableName}</label>
            <textarea  value={prop?.value} name={prop?.name} autoComplete="off" onChange={prop?.handelChangeTextarea} placeholder={prop?.placeholder} className="outline-none border-2 px-5 py-2 w-full rounded-2xl"  ></textarea>
            <p className="text-md md:text-lg text-red-300 w-96">{prop?.error}</p>
        </div>
    )
}

export default React.memo(Textarea)