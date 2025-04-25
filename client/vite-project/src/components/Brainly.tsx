import React, { JSX } from "react";
import { LuBrainCircuit } from "react-icons/lu";
import Heading from "./Heading";
function Brainly():JSX.Element{
    return(
        <div className="flex justify-start  items-center  text-white">
            
                <div className="flex justify-start items-center">
                    <LuBrainCircuit  className="text-5xl md:text-7xl"/>
                    <Heading value={"Brainly"}/>
                    </div>
        </div>
    )
}

export default React.memo(Brainly)