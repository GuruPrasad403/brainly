import React from "react"
import { useNavigate } from "react-router-dom";
import { TypeAnimation } from 'react-type-animation';
function Hero(){
    const navigate = useNavigate()
    return(
        <div className=" relative flex flex-col gap-5 px-10 py-15 md:py-25 justify-center bg-gray-800  items-start w-full h-full">
             <div className="flex w-full md:w-8/12  text-amber-200">
                <h1 className="md:text-7xl text-7xl leading-20 md:leading-22  my-10  lg:text-8xl capitalize font-semibold font-sans max-h-lg h-[50vh] md:h-96">
                <TypeAnimation
      sequence={[
        'Capture, Organize, and Access Your Knowledge.', // Types 'One'
        2000, // Waits 1s
        'Keep Your Important Ideas at Your Fingertips.', // Deletes 'One' and types 'Two'
        3000, // Waits 2s
        'Empower Your Memory with Instant Access.', 
        5000,// Types 'Three' without deleting 'Two'
        () => {
          console.log('Sequence completed');
        },
      ]}
      wrapper="span"
      cursor={true}
      repeat={Infinity}
    />
                </h1>
             </div>

             <div className="flex font-semibold my-5 gap-2 justify-start items-center p-3 md:p-5">
                <div onClick={()=> navigate("/signup")} className="bg-gray-900 text-white px-8 cursor-pointer py-6 text-sm md:text-xl">
                 Free Signup
                </div>
                <div onClick={()=> navigate("/signin")} className="text-gray-900 bg-white px-10 cursor-pointer py-5 text-sm md:text-xl">
                Signin
                </div>
             </div>
        </div>
    )
}

export default React.memo(Hero)