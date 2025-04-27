import React, { JSX } from "react";
import { ShimmerButton, ShimmerText, ShimmerTitle } from "react-shimmer-effects";

function ShimmerNotes(): JSX.Element {
    const arr = [1,2,3,4,5,6,7,8,9]
  return (
    <>
    {
        arr.map(()=>{
            return (
                <div className="w-full h-full max-w-sm max-h-96  rounded-2xl overflow-hidden p-4 flex flex-col shadow-md  ">
      <div className="text-center px-5">
        <ShimmerTitle line={2} gap={10} variant="primary" />
      </div>
      <div className="p-5">
        <ShimmerText line={5} gap={10} />
      </div>
      <div className="w-26 mx-5 ">
      <ShimmerText line={2} />
      </div>
      <div className="flex gap-5 p-5 mb-2">
        <ShimmerButton />
        <ShimmerButton />
        <ShimmerButton />
      </div>
    </div>
            )
        })
    }
    </>
  );
}

export default React.memo(ShimmerNotes);
