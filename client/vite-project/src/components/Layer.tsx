import React, { JSX } from 'react'
function Layer({children} : {children :  React.ReactNode }):JSX.Element{
    return(
        <div className="fixed inset-0 w-full h-full p-5 flex justify-center items-center z-50  bg-opacity-70 backdrop-blur-sm ">
                        <div className="px-5">
                          {children}
                        </div>
                      </div>
    )
}

export default React.memo(Layer)