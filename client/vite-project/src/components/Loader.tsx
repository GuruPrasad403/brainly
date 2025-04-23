import React, { JSX } from "react"
import { HashLoader } from "react-spinners"
function Loader():JSX.Element{
    
    return(
            <div className="flex justify-center items-center w-full">
                <HashLoader />
            </div>
    )
}


export default React.memo(Loader)