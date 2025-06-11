import React, { JSX, useCallback } from 'react'
import Heading from './Heading'
import SubHeading from './SubHeading'
import { IoIosLink } from 'react-icons/io'
import { GrClose } from 'react-icons/gr'
import Button from './Button'
import { useInfoContext } from '../context/UserContext'
import ContentForm from './ContentForm'
import toast from 'react-hot-toast'
import {motion} from 'framer-motion'
import Loader from './Loader'
function ContentView():JSX.Element{
    const {setViewContent,note,editContent,setEditContent,setContentData,setTagsInput,setSharedContent,setUrl} :any = useInfoContext()
    const handelClick = useCallback(()=>{
        setViewContent(false)
    },[setViewContent]);
    const [loading,setLoading] = React.useState<boolean>(false)
    const handelShare = useCallback(async () => {
      try {
        setLoading(true);
    
        const response = await fetch(`https://brainly-ld5q.onrender.com/api/v1/link`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Brain-Token")}`,
          },
          body: JSON.stringify({
            contentId: note[0]?._id,
          }),
        });
    
        const result = await response.json();
    
        // Handle both newly created and already existing link
        const linkData = result?.data || result?.existingLink;
        if (!linkData?._id) {
          throw new Error(result?.msg || "Failed to get a valid link ID");
        }
    
        const currentUrl = window.location;
        const sharedUrl = `${currentUrl.protocol}//${currentUrl.host}/link/${linkData?.contentId}`;
    
        setUrl(sharedUrl);
        setViewContent(false);
        setSharedContent(true);
    
        const successMsg = response.status === 409 
          ? "Link already exists and reused" 
          : "Link shared successfully";
    
        toast.success(successMsg);
      } catch (error) {
        console.error("Share Error:", error);
        toast.error("Failed to share");
      } finally {
        setLoading(false);
      }
    }, [note]);
    
const handelEdit = useCallback(()=>{
    setEditContent(false)
    const tags = note[0]?.tags.map((ele:{_id:string,title:string})=>ele?.title).join(",")
    setTagsInput(tags)   
    setContentData(note[0])
},[])
const handelDelete = useCallback(async () => {
    if (!note[0]?._id) {
      toast.error("Content ID is missing.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this content?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("Brain-Token");

      const res = await fetch(`https://brainly-ld5q.onrender.comapi/v1/content?id=${note[0]._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        
        toast.success(data?.msg || "Content deleted successfully!");
        setContentData("")
        setViewContent(false);
      } else {
        toast.error(data?.msg || "Failed to delete content.");
      }

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Try again!");
    }
}, [note, setViewContent]);

    return(
    <>     
    {
        (editContent) ? 
    
        <div className=' p-5 bg-black max-w-md overflow-hidden'>

        <div className='flex justify-between items-center  font-semibold '>
                <Heading value={"View Memory"} />
                <div  className='hover:text-gray-500 p-2  cursor-pointer rounded-full' onClick={handelClick}>
                  <GrClose className='text-xl font-bold' />
                </div>
              </div> 
        <div>
            <div className='text-2xl md:text-6xl font-semibold text-violet-300'>
            <SubHeading value={note[0]?.title}/>
            </div>
            <motion.div 
            initial={{ opacity: 0, y: 100 ,overflow:"hidden"}}
            animate={{ opacity: 1, y: 0 }}
            className='p-5 text-justify text-md sm:text-lg md:text-xl text-white w-full max-h-96 overflow-y-auto text-wrap'>
                <motion.p
                initial={{ opacity: 0, y: 100 ,overflow:"hidden"}}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5, stiffness: 100 }}
                >
                {
                    note[0]?.description
                }
                </motion.p>
            </motion.div>                    
        <div className="flex flex-wrap gap-2 m-3">
                {
                    note[0]?.tags?.map((ele : {_id:string,title:string}) => {
                        return(
                            <span key={ele?._id} className="bg-gray-900 text-white text-xs px-3 py-1 rounded-full">
                            {ele?.title} 
                        </span>
                        )
                    })
                }
        </div>
        <div>
          <a
            href={note[0]?.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-500 hover:underline"
          >
            <IoIosLink className="text-2xl" />
            <span className="text-lg">
                {note[0]?.type}
            </span>
          </a>
        </div>

        <div className='w-full flex justify-between  items-center text-amber-200 gap-5 my-2'>
             <Button value='Edit' handelSubmit={handelEdit}/>
            <Button value='Delete' handelSubmit={handelDelete}/>
            {
              loading? <Loader /> : <Button value='Share' handelSubmit={handelShare}/>
            }
        </div>
        </div>
    </div> : 
    <ContentForm />
    }
    </>
    )
}

export default React.memo(ContentView)