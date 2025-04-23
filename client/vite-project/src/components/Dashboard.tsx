import React, { JSX } from "react";
import { useInfoContext } from "../context/UserContext";

function Dashoard():JSX.Element{
    const {user} :any = useInfoContext()
    return(
    )
}

export default React.memo(Dashoard)