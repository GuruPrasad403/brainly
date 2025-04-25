import React, { JSX, useCallback } from 'react'
import toast from 'react-hot-toast';
import { TbLogout } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';

function Logout():JSX.Element{
    const navigate = useNavigate()
    const handelClick = useCallback(()=>{
        localStorage.removeItem("Brain-Token")
        toast.success("Bad to see you")
        navigate("/signin")
    },[])
    return (
        <div className='flex justify-center items-center gap-2' onClick={handelClick}> 
        <TbLogout  className="text-3xl mt-1"/><h2 className='text-xl'>Logout</h2>

        </div>
    )
}

export default React.memo(Logout)