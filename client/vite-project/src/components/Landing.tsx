import React, { JSX } from "react";
import Brainly from "./Brainly";
import Hero from "./Hero";
import Features from "./Features";
import LandingHeader from "./LandingHeader";
function Landing(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Header - Responsive navbar */}
      <LandingHeader/>

      {/* Hero section */}
      <section className="flex-grow py-8 ">
        <Hero />
      </section>
      
      {/* Features section */}
      <section className="py-12 px-4 md:px-8 lg:px-16">
        <Features />
      </section>
      
      {/* Footer */}
      <footer className="py-6 px-4 md:px-8 lg:px-16 ">
        <div className="max-w-6xl mx-auto text-center md:text-left md:flex md:justify-between md:items-center">
          <div className="mb-4 md:mb-0">
            <Brainly />
            <p className=" mt-2 text-sm">Empowering your AI journey</p>
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