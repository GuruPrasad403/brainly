import React, { JSX } from "react"

function Searchbar():JSX.Element{
    return(
        <div className="flex   overflow-hidden max-w-full mx-auto">
        <input type="email" placeholder="Search Something..."
          className="w-full outline-none border-2   text-sm px-4 py-3" />
        <button type='button' className="flex items-center justify-center  px-5 text-sm border-2">
          Search
        </button>
      </div>
        
    )
}

export default React.memo(Searchbar)