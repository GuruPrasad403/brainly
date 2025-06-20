import React, { JSX } from "react";
import { useInfoContext } from "../context/UserContext";
import Header from "./Header";
import AllNotes from "./AllNotes";
import ContentForm from "./ContentForm";
import Layer from "./Layer";
import ContentView from "./ContentView";
import SharePopUp from "./SharePopUp";

function Dashboard(): JSX.Element {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const { addContent, viewContent,sharedContent }: any = useInfoContext();

  return (
    <div className={`flex flex-col relative w-full h-screen bg-black text-white ${addContent || viewContent ? "overflow-hidden" : "overflow-y-auto"}`}>
      {/* Overlay layers */}
      {addContent && (
        <Layer>
          <ContentForm />
        </Layer>
      )}
      
      {viewContent && (
        <Layer>
          <ContentView />
        </Layer>
      )}
      {sharedContent && (
        <Layer>
          <SharePopUp />
        </Layer>
      )}
      {/* Main content */}
      <div className="flex-none w-full">
        <Header />
      </div>
      
      <div className="flex-grow w-full overflow-y-auto ">
        <AllNotes />
      </div>
    </div>
  );
}

export default React.memo(Dashboard);