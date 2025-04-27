import React from 'react'
import Heading from './Heading'
import { SiKnowledgebase } from "react-icons/si";
import { FaBusinessTime } from "react-icons/fa";
import { GiArchiveResearch } from "react-icons/gi"
function Features(){
    return (
        <div className='flex overflow-hidden justify-around flex-col items-center w-full '>
            <div className='flex justify-center py-5 items-center w-full'>
                <Heading value='Features' />
            </div>
            <div className='flex flex-col md:flex-row justify-around items-center gap-10'>
            <div className='flex justify-center items-center bg-gray-800 py-15 rounded-xl px-10 flex-col gap-2 '>
                <div>
                    <div className='text-8xl flex justify-center'>
                        <SiKnowledgebase />
                    </div>
                    <div className='flex justify-center items-center flex-col'>
                        <h1 className='font-semibold text-amber-300 text-2xl'>Effortless Knowledge Management</h1>
                        <p className='w-96 text-center my-2 text-lg'>Store and organize your articles, links, and notes in a single, easily accessible space.</p>
                    </div>
                </div>
            </div>
            <div className='flex justify-center items-center bg-gray-800 py-15 rounded-xl px-10 flex-col gap-2 '>
                <div>
                    <div className='text-8xl flex justify-center'>
                        <FaBusinessTime />
                    </div>
                    <div className='flex justify-center items-center flex-col'>
                        <h1 className='font-semibold text-amber-300 text-2xl'>Access Anytime, Anywhere</h1>
                        <p className='w-96 text-center my-2 text-lg'>Retrieve your stored information offline, thanks to seamless PWA integration.</p>
                    </div>
                </div>
            </div>
            <div className='flex justify-center items-center bg-gray-800 py-15 rounded-xl px-10 flex-col gap-2 '>
                <div>
                    <div className='text-8xl flex justify-center'>
                        <GiArchiveResearch />
                    </div>
                    <div className='flex justify-center items-center flex-col'>
                        <h1 className='font-semibold text-amber-300 text-2xl'>Fast Search Functionality</h1>
                        <p className='w-96 text-center my-2 text-lg'>Use powerful search filters to quickly find the information you need.</p>
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}

export default React.memo(Features)