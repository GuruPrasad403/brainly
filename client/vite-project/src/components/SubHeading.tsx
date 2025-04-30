import React, { JSX, useCallback } from 'react'
import {HeadType} from '../types/HeadType'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
function Heading( prop : HeadType):JSX.Element{
    const navigate = useNavigate();
    const handelClick = useCallback(()=>{
        navigate(`/${prop?.link}`)
    },[prop?.link,prop?.linkValue])
    return(
        <motion.h1
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}  
        transition={{ duration: 0.5,delay: 0.8 }}
        animate={{ scale: 1 }}
        className='text-md   sm:text-lg md:text-2xl h-full px-4 py-2    font-sans text-center'>
        {prop?.value} <span className=' font-semibold cursor-pointer' onClick={handelClick}>{prop?.linkValue}</span>    
        </motion.h1>
    )
}

export default React.memo(Heading)