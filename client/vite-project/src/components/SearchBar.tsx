import React, { JSX } from "react"

function Searchbar():JSX.Element{
    return(
        <div className="flex rounded-xl  overflow-hidden max-w-full mx-auto">
        <input type="email" placeholder="Search Something..."
          className="w-full outline-none bg-gray-700  text-sm px-4 py-3" />
        <button type='button' className="flex items-center justify-center bg-black px-5 text-sm text-white">
          Search
        </button>
      </div>
        
    )
}

export default React.memo(Searchbar)