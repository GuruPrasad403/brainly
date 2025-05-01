import React, { JSX, useCallback,  } from "react";
import { GrClose } from "react-icons/gr";
import { useInfoContext } from "../context/UserContext";
import SubHeading from "./SubHeading";
import Button from "./Button";
import toast from "react-hot-toast";


function SharePopUp(): JSX.Element {
    const {setSharedContent,url} : any = useInfoContext()
    const handelClick = useCallback(()=>{
        setSharedContent(false)
    },[])
    const handelCopy  = useCallback(()=>{
        navigator.clipboard.writeText(url).then(() => {
            toast.success("URL copied to clipboard!");
        }).catch((err) => {
            toast.error("Failed to copy URL.");
            console.error("Failed to copy: ", err);
        });
    },[url])
    return (
       <div className="p-5 bg-black w-full overflow-hidden'">
        
                <div className='flex justify-between items-center  font-semibold '>
                        <SubHeading value={"Share Brain"} />
                        <div  className='hover:text-gray-500 p-2  cursor-pointer rounded-full' onClick={handelClick}>
                          <GrClose className='text-xl font-bold' />
                        </div>
                      </div> 

                      <div>
                        <SubHeading value={"Share your brain with your friends"} />
                        <div className="flex justify-center text-md items-center gap-2 flex-row mt-5 w-full h-full text-wrap flex-wrap bg-gray-600 border-2  p-2">
                            <span className="font-semibold">Brain URL:</span>
                            <span className="text-wrap">{url}</span>
                        </div>
                      </div>
                      <div className="flex justify-center items-center mt-5"> 
                        <Button value="Copy Link" handelSubmit={handelCopy} />
                      </div>
       </div>
    );
}


export default React.memo(SharePopUp)