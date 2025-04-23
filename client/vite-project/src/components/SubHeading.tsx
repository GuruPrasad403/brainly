import React, { JSX, useCallback } from 'react'
import {HeadType} from '../types/HeadType'
import { useNavigate } from 'react-router-dom'
function Heading( prop : HeadType):JSX.Element{
    const navigate = useNavigate();
    const handelClick = useCallback(()=>{
        navigate(`/${prop?.link}`)
    },[prop?.link,prop?.linkValue])
    return(
        <h1 className='text-lg sm:text-xl md:text-2xl h-full p-2 m-2 w-96  font-sans text-center'>
        {prop?.value} <span className='underline font-semibold cursor-pointer' onClick={handelClick}>{prop?.linkValue}</span>    
        </h1>
    )
}

export default React.memo(Heading)