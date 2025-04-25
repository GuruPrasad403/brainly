import React, { JSX } from "react";
import Heading from "./Heading";
import SubHeading from "./SubHeading";
import { IoIosLink } from "react-icons/io";
import { useInfoContext } from "../context/UserContext";
import { ContentTypes } from "../types/content.types";

function Notes(): JSX.Element {
  const { notes }: any = useInfoContext();
  return (
    <>
      {notes?.map((note: ContentTypes) => {
        return (
          <div
            key={note?._id}
            className="w-full h-96 bg-gray-700 text-gray-200 rounded-2xl overflow-hidden p-4 flex flex-col gap-4 shadow-md"
          >
            <div className="text-white">
              <Heading value={`${note?.title.slice(0,15)}...`} />
            </div>
            <div className="text-justify overflow-y-auto h-50">
              <SubHeading value={note?.description.slice(0,160)+"....." } />
            </div>
            <div>
              <a
                href={note?.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-amber-300 hover:underline"
              >
                <IoIosLink className="text-2xl" />
                <span className="text-lg">{note?.type}</span>
              </a>
            </div>
            <div className="flex flex-wrap gap-2">
              {note?.tags?.map((ele: any) => (
                <span
                  key={ele?._id}
                  className="bg-gray-900 text-white text-xs px-3 py-1 rounded-full"
                >
                  {ele?.title}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}

export default React.memo(Notes);
