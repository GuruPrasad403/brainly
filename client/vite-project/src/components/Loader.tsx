import React, { JSX } from "react"
import { HashLoader } from "react-spinners"
function Loader():JSX.Element{
    
    return(
            <div className="flex justify-center items-center w-full">
                <HashLoader color="#fff" size={25}/>
            </div>
    )
}


export default React.memo(Loader)