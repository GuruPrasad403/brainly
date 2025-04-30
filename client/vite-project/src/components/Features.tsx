import React from 'react'
import Heading from './Heading'
import { SiKnowledgebase } from "react-icons/si";
import { FaBusinessTime } from "react-icons/fa";
import { GiArchiveResearch } from "react-icons/gi"
import {motion} from 'framer-motion'
function Features(){
    return (
        <div className='flex overflow-hidden justify-around flex-col  items-center w-full '>
            <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8,delay: 0.3 }}
            className='flex justify-center py-5 items-center w-full'>
                <Heading value='Features' />
            </motion.div>
            <div className='flex flex-col lg:flex-row justify-around items-center gap-10 md:flex-col  md:w-full w-96 '>
            <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5,delay: 0.5 }}
            className='flex justify-center items-center bg-gray-800 py-15 rounded-xl px-10 flex-col gap-2 '>
                <div>
                    <div className='text-8xl flex justify-center '>
                        <SiKnowledgebase />
                    </div>
                    <div className='flex justify-center items-center flex-col '>
                        <h1 className='font-semibold  text-2xl '>Effortless Knowledge Management</h1>
                        <p className=' text-center my-2 sm:text-2xl text-lg text-gray-400'>Store and organize your articles, links, and notes in a single, easily accessible space.</p>
                    </div>
                </div>
            </motion.div>
            <motion.div 
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5,delay: 0.6 }}
             className='flex justify-center items-center bg-gray-800 py-15 rounded-xl px-10 flex-col gap-2 '>
                <div>
                    <div className='text-8xl flex justify-center'>
                        <FaBusinessTime />
                    </div>
                    <div className='flex justify-center items-center flex-col'>
                        <h1 className='font-semibold  text-2xl'>Access Anytime, Anywhere</h1>
                        <p className=' text-center my-2 text-lg text-gray-400'>Retrieve your stored information offline, thanks to seamless PWA integration.</p>
                    </div>
                </div>
            </motion.div>
            <motion.div 
            initial={{ opacity: 0, y: 70 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5,delay: 0.8 }}
             className='flex justify-center items-center bg-gray-800  py-15 rounded-xl px-10 flex-col gap-2 '>
                <div>
                    <div className='text-8xl flex justify-center'>
                        <GiArchiveResearch />
                    </div>
                    <div className='flex justify-center items-center flex-col'>
                        <h1 className='font-semibold  text-2xl'>Fast Search Functionality</h1>
                        <p className=' text-center my-2 text-lg text-gray-400'>Use powerful search filters to quickly find the information you need.</p>
                    </div>
                </div>
            </motion.div>
            
            </div>
           
        </div>
    )
}

export default React.memo(Features)