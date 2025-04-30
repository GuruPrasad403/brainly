import React, { JSX } from 'react'
import Brainly from './Brainly'
import SearchBar from './SearchBar'
import MenuItem from './MenuItem'

function Header(): JSX.Element {
  return (
    <header className=" ">
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 max-w-full mx-auto gap-10">
        <div className="flex w-full sm:w-auto justify-between items-center mb-3 sm:mb-0">
          <div className="flex-shrink-0">
            <Brainly />
          </div>
          
          <div className="block sm:hidden">
            <MenuItem />
          </div>
        </div>
        
        <div className="w-full sm:flex-grow sm:mx-4 lg:mx-8">
          <SearchBar />
        </div>
        
        <div className="hidden sm:flex items-center space-x-4 mt-3 sm:mt-0 w-96">
          <MenuItem />
        </div>
      </div>
    </header>
  )
}

export default React.memo(Header)