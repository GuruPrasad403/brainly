import React, { JSX } from "react";
import Brainly from "./Brainly";
import SubHeading from "./SubHeading";
import Hero from "./Hero";
import Features from "./Features";

function Landing(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Header - Responsive navbar */}
      <header className="py-4 px-4 md:px-8 lg:px-16 flex items-center justify-between">
        <div className="flex-shrink-0">
          <Brainly />
        </div>
        <div className="flex justify-center items-center gap-2">
          <div className="hidden md:block my-2 bg-amber-200 text-gray-900 px-5 rounded-xl"> 
            <SubHeading linkValue="Signup" link="signup"/>
          </div>
          <div className="my-2 bg-amber-200 text-gray-900 px-5 rounded-xl"> 
            <SubHeading linkValue="Signin" link="signin"/>
          </div>
          {/* Mobile menu button could go here */}
        </div>
      </header>

      {/* Hero section */}
      <section className="flex-grow py-8 ">
        <Hero />
      </section>
      
      {/* Features section */}
      <section className="py-12 px-4 md:px-8 lg:px-16">
        <Features />
      </section>
      
      {/* Footer */}
      <footer className="py-6 px-4 md:px-8 lg:px-16 bg-gray-950">
        <div className="max-w-6xl mx-auto text-center md:text-left md:flex md:justify-between md:items-center">
          <div className="mb-4 md:mb-0">
            <Brainly />
            <p className="text-gray-400 mt-2 text-sm">Empowering your AI journey</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <a href="#" className="text-gray-400 hover:text-white">About</a>
            <a href="#" className="text-gray-400 hover:text-white">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white">Terms</a>
          </div>
        </div>
        <div className="mt-6 text-center text-gray-500 text-sm">
          © 2025 Brainly. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default React.memo(Landing);