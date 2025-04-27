import React, { JSX, MouseEvent, useCallback, useEffect } from "react";
import Button from "./Button";
import { useInfoContext } from "../context/UserContext";
import Notes from "./Notes";
import ShimmerNotes from "./ShimmerNotes";

function AllNotes(): JSX.Element {
  const { loading,setLoading,addContent, setAddContent, setNotes,setViewContent,editContent,contentData,setContentData,setTagsInput }: any = useInfoContext();

  const handleAddContent = useCallback(() => {
    setContentData("")
    setAddContent(true);
    setTagsInput("")
  }, [setAddContent]);

  const getData = useCallback(async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("Brain-Token");
      const res = await fetch("https://brainly-ld5q.onrender.com/api/v1/content/all-info", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error fetching content:", data?.msg || data?.error);
        return [];
      }

      setNotes(data.content || []);
      setLoading(false)
    } catch (error) {
      console.error("Unexpected error:", error);
      setLoading(false)
      return [];
    }
  }, [setNotes,editContent,contentData,setContentData]);

  useEffect(() => {
    getData();
  }, [addContent, getData]);

  const handelClick = useCallback((e:MouseEvent<HTMLDivElement>)=>{
    setViewContent(true)
    console.log(e.target)
  },[setViewContent])

  return (
    <div className=" flex flex-col w-full h-full px-4 py-6 md:px-10"  >
      {/* Header section */}
      <div className=" flex justify-between items-center">
            <div className="mx-2 md:mx-10 ">
                <h1 className="text-xl font-semibold md:text-3xl md:mt-2  text-amber-300">All Notes</h1>
            </div>
            <div className="flex justify-between items-center md:gap-10 mx-5 mt-5 text-white ">

                <div>
                <Button value={"Add New Memory"} handelSubmit={handleAddContent}/>
                </div>
            </div>
        </div>
      {/* Notes Grid */}
      <div className="mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 pb-10" onClick={handelClick}>
          {
            loading ? <ShimmerNotes /> : <Notes />
          }
        </div>
      </div>
    </div>
  );
}

export default React.memo(AllNotes);
