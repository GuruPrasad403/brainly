import React, { JSX } from "react";
import { useInfoContext } from "../context/UserContext";
import Header from "./Header";
import AllNotes from "./AllNotes";
import ContentForm from "./ContentForm";
import Layer from "./Layer";
import ContentView from "./ContentView";

function Dashboard(): JSX.Element {
  const { addContent, viewContent }: any = useInfoContext();

  return (
    <div className={`flex flex-col relative w-full h-screen  ${addContent || viewContent ? "overflow-hidden" : "overflow-y-auto"}`}>
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