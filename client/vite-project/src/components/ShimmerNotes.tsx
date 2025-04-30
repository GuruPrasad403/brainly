import React, { JSX } from "react";

function ShimmerNotes(): JSX.Element {
  const arr = Array(9).fill(0);

  return (
    <>
      {arr.map((_, index) => (
        <div
          key={index}
          className="w-full h-full max-w-sm max-h-96 rounded-2xl overflow-hidden p-4 flex flex-col shadow-md bg-violet-500"
        >
          <div className="text-center px-5 space-y-2">
            <div className="shimmer-effect-dark h-5 w-3/4 mx-auto rounded" />
            <div className="shimmer-effect-dark h-5 w-2/3 mx-auto rounded" />
          </div>
          <div className="p-5 space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="shimmer-effect-dark h-4 w-full rounded" />
            ))}
          </div>
          <div className="w-26 mx-5 space-y-1">
            <div className="shimmer-effect-dark h-4 w-1/2 rounded" />
            <div className="shimmer-effect-dark h-4 w-1/3 rounded" />
          </div>
          <div className="flex gap-5 p-5 mb-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="shimmer-effect-dark h-8 w-20 rounded-md" />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

export default React.memo(ShimmerNotes);
