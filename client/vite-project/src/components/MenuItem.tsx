import React from 'react'
import { useCallback, useState } from "react"
import { TiThMenu } from "react-icons/ti";
import Logout from './Logout';
import {contentTypes} from '../types/HeadType'
function Menuitem(){

    const [open,setOpen] = useState<boolean>(true)
    const handelClickMenu = useCallback(()=>{
        setOpen(!open)
    },[open,setOpen])

    return(
        <div className='relative flex w-40 text-2xl justify-center items-center font-semibold cursor-pointer' title='Click to Filter the Content'>
        {open ? 
        <div 
        onClick={handelClickMenu}
        className='flex justify-center items-center gap-2'> <TiThMenu /><span>Menu List</span>
        </div> 
        :
         <div 
         onClick={handelClickMenu}
         className='flex justify-center items-center gap-1'> <TiThMenu /><span>Close List</span>
        </div>} 
         {/* drop down menu  */}
          {!open ?<div className='flex justify-around flex-col items-center bg-gray-900 w-full top-8 gap-5 text-xl p-5 absolute rounded-b-2xl z-99'>
             <p className=' capitalize border-b-1 border-amber-50 w-full text-center '>{contentTypes.link}</p>
             <p className=' capitalize border-b-1 border-amber-50 w-full text-center '>{contentTypes.tweet}</p>
             <p className=' capitalize border-b-1 border-amber-50 w-full text-center '>{contentTypes.article}</p>
             <p className=' capitalize border-b-1 border-amber-50 w-full text-center '>{contentTypes.youtube}</p>
            <div className='text-red-200'>
             <Logout />
            </div>
         </div>: null }
     </div>
    )
}

export default React.memo(Menuitem)