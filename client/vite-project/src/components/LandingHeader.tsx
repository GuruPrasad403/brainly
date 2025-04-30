import Brainly from "./Brainly";
import SubHeading from "./SubHeading";
import { motion } from "framer-motion";
import React from "react";
function LandingHeader(){
    return(
        <header className="py-4 px-4 md:px-8 lg:px-16 flex items-center justify-between">
        <div className="flex-shrink-0">
          <Brainly />
        </div>
        <div className="flex justify-center items-center gap-2">
          <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden md:block my-2 bg-white text-black px-5 "> 
            <SubHeading linkValue="Signup" link="signup"/>
          </motion.div>
          <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} className="my-2  px-5  bg-white text-black"> 
            <SubHeading linkValue="Signin" link="signin"/>
          </motion.div>
          {/* Mobile menu button could go here */}
        </div>
      </header>
    )
}

export default React.memo(LandingHeader)