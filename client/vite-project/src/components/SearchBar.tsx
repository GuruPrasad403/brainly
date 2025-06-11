import React, { JSX, useCallback, useState } from "react"
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useInfoContext } from "../context/UserContext";
import Loader from "./Loader";

function Searchbar(): JSX.Element {
  const [searchText, setSearchText] = React.useState<string>("");
  const navigate = useNavigate();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const {setCopyNotes,notes,copyNotes} :any = useInfoContext()
  const [loading,setLoading] = useState<boolean>(false)
  const handelClick = useCallback(async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("Brain-Token");
      if (!token) {
        toast.error("No token found. Please log in.");
        navigate("/signin")
      }
      console.log("this ",searchText)
      const response = await fetch("https://brainly-ld5q.onrender.com/api/v1/content/semantic-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: searchText }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.msg || "Something went wrong");
        setCopyNotes(notes)
        setLoading(false)
        
        throw new Error(result.msg || "Something went wrong");
      }

      console.log("Semantic Results:", result.data); 
      setCopyNotes(result.data); 
      console.log(copyNotes)
      toast.success(result.msg || "Search successful!");
      // Replace with UI update if needed
    } catch (err) {
      setLoading(false)
      console.error("Search error:", err);
    }
    finally {
      setLoading(false)
    }
  }, []);

  return (
    <div className="flex overflow-hidden max-w-full mx-auto">
      <input
        type="text"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
        value={searchText}
        placeholder="Search Something..."
        className="w-full outline-none border-2 text-sm px-4 py-3"
      />
      {
        loading? <div className="border-2 flex w-24 text-white">
          <Loader />
        </div> : 
        
      <button
      type="button"
      className="flex items-center justify-center cursor-pointer px-5 text-sm border-2"
      onClick={handelClick}
    >
      Search
    </button>
      }
    </div>
  );
}

export default React.memo(Searchbar);
