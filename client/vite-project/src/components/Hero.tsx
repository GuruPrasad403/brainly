import React from "react"
import { useNavigate } from "react-router-dom";
import { TypeAnimation } from 'react-type-animation';
import {motion} from 'framer-motion'
function Hero(){
    const navigate = useNavigate()
    return(
        <div className=" relative flex flex-col gap-5  py-15 md:py-25 justify-center  bg-violet-600 items-start w-full h-full">
             <div className="absolute  w-full h-full  p-0 m-0">
             <div className="lines">
  <div className="line"></div>
  <div className="line"></div>
  <div className="line"></div>
  <div className="line"></div>
  <div className="line"></div>
  <div className="line"></div>
  <div className="line"></div>
  <div className="line"></div>
  <div className="line"></div>
</div>

             </div>
             
             
             <div className="flex w-full md:w-8/12 z-99 ">
                <motion.h1 
                initial={{ opacity: 0, y: 150 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1,delay: 1 }}
                className="md:text-7xl text-5xl px-10 leading-20 md:leading-35  my-10  lg:text-8xl capitalize font-semibold font-sans max-h-lg h-[40vh] md:h-[53vh]">
                <TypeAnimation
      sequence={[
        'Capture, Organize, and Access Your Knowledge.', // Types 'One'
        2000, // Waits 1s
        'Keep Your Important Ideas at Your Fingertips.', // Deletes 'One' and types 'Two'
        3000, // Waits 2s
        'Get What You Need, When You Need It—For Better Memory.', 
        5000,// Types 'Three' without deleting 'Two'
        () => {
          console.log('Sequence completed');
        },
      ]}
      wrapper="span"
      cursor={true}
      repeat={Infinity}
    />
                </motion.h1>
             </div>

             <div className="flex font-semibold my-5 gap-2 justify-start items-center p-3 md:p-5 z-99">
                <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 2,delay: 1 }}
                onClick={()=> navigate("/signup")} className="bg-white px-8 text-black cursor-pointer py-5 text-sm md:text-xl">
                 Free Signup
                </motion.div>
                <motion.div
                
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 2,delay: 1 }}
                onClick={()=> navigate("/signin")} className="bg-black text-white  px-10 cursor-pointer py-5 text-sm md:text-xl">
                Signin
                </motion.div>
             </div>
        </div>
    )
}

export default React.memo(Hero)