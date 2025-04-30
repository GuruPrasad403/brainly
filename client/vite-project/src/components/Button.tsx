import React, { JSX }  from "react";
import { ButtonType } from "../types/HeadType";
import { motion } from "framer-motion";
function Button(prop:ButtonType):JSX.Element{
    return(
        <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        onClick={prop?.handelSubmit} className="w-full h-full bg-white text-black text-center  text-md md:text-lg py-2.5 px-5 cursor-pointer">
            {prop?.value}
        </motion.div>
    )
}


export default React.memo(Button)