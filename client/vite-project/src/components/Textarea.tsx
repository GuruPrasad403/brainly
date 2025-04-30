import React, { JSX } from "react"
import { InputTypes } from "../types/HeadType"
import { motion } from "framer-motion"
function Textarea(prop : InputTypes):JSX.Element{
    return(
        <div className="flex justify-around items-start w-full h-full gap-5 flex-col my-1 font-semibold">
            <motion.label 
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      htmlFor={prop?.name} className="text-md md:text-lg lg:text-xl">
        {prop?.lableName}
      </motion.label>
            <motion.textarea  
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}    
            value={prop?.value} name={prop?.name} autoComplete="off" onChange={prop?.handelChangeTextarea} placeholder={prop?.placeholder} className="outline-none border-2 px-5 py-2 w-full rounded-2xl"  ></motion.textarea>
            <p className="text-md md:text-lg text-red-300 w-96">{prop?.error}</p>
        </div>
    )
}

export default React.memo(Textarea)