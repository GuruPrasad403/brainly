    import React, { JSX } from 'react'
    import {HeadType} from '../types/HeadType'
    import  {motion} from 'framer-motion'
    function Heading( prop : HeadType):JSX.Element{
        return(
            <motion.h1 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5,delay: 0.5 }}
            className='text-3xl md:text-4xl lg:text-5xl w-full h-full p-2 m-2 font-bold font-sans text-center'>
            {prop?.value}     
            </motion.h1>
        )
    }

    export default React.memo(Heading)