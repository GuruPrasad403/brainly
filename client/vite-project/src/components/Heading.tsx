    import React, { JSX } from 'react'
    import {HeadType} from '../types/HeadType'
    function Heading( prop : HeadType):JSX.Element{
        return(
            <h1 className='text-3xl md:text-4xl lg:text-5xl w-full h-full p-2 m-2 font-bold font-sans text-center'>
            {prop?.value}     
            </h1>
        )
    }

    export default React.memo(Heading)