import React, { JSX, MouseEvent, useCallback, useEffect, useRef, } from "react";
import Heading from "./Heading";
import SubHeading from "./SubHeading";
import { IoIosLink } from "react-icons/io";
import { useInfoContext } from "../context/UserContext";
import { ContentTypes } from './../types/content.types';

function Notes(): JSX.Element {
  const { notes, setViewContent,setNote,copyNotes,setCopyNotes }: any = useInfoContext();
  const ref = useRef<(HTMLDivElement | null)[]>([]);
  const handelClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const selectedNote = notes?.filter((ele: ContentTypes) => {
      return ele?._id === e.currentTarget?.id;
    });
  
    setNote(selectedNote); 
    console.log(selectedNote[0]); 
    setViewContent(true);
  }, [notes, setNote, setViewContent]);
  

  useEffect(() => {
    setCopyNotes(notes)
    ref.current = ref.current.slice(0, notes.length);
  }, [notes]);

  return (
    <>
      {copyNotes?.map((note: ContentTypes, i: number) => {
        return (
          <div
            key={note?._id}
            
            className="w-full h-96 bg-violet-600 rounded-2xl overflow-hidden p-4 flex flex-col gap-4 shadow-md"
            
          >
            <div className="">
              <Heading value={`${note?.title.slice(0, 15)}...`} />
            </div>
            <div className="text-justify overflow-y-auto h-50">
              <SubHeading value={note?.description.slice(0, 160) + "....."} />
            </div>
            <div className="flex justify-between items-center">
              <a
                href={note?.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2  hover:underline"
              >
                <IoIosLink className="text-2xl" />
                <span className="text-lg">{note?.type}</span>
              </a>

              
              <div onClick={handelClick}
              id={note?._id}
              ref={el => {
                ref.current[i] = el;
              }} className="text-black font-semibold bg-white px-2 py-1 cursor-pointer">
                View Brain
              </div>
            </div>
            <div className="flex flex-wrap gap-2 ">
              {note?.tags?.map((ele: any) => (
                <span
                  key={ele?._id}
                  className="border-1 bg-gray-900  text-xs px-3 py-1 rounded-full"
                >
                  {`#${ele?.title}`}
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
