import React, { ChangeEvent, JSX, useCallback, useState } from 'react';
import { useInfoContext } from '../context/UserContext';
import SubHeading from './SubHeading';
import { GrClose } from "react-icons/gr";
import Input from './Input';
import { types } from '../types/HeadType';
import Textarea from './Textarea';
import Button from './Button';
import { ContentTypes } from '../types/content.types';
import toast from 'react-hot-toast';
import Loader from './Loader';

interface ContentErrorTypes {
  title?: string;
  link?: string;
  description?: string;
  tags?: string;
  type?: string;
}

function ContentForm(): JSX.Element {
  const { setAddContent }: any = useInfoContext();
  const [loading, setLoading] = useState(false);

  const [contentData, setContentData] = useState<ContentTypes>({
    title: "",
    link: "",
    description: "",
    tags: [],
    type: ""
  });

  const [tagsInput, setTagsInput] = useState<string>("");

  const [error, setError] = useState<ContentErrorTypes>({
    title: "",
    link: "",
    description: "",
    tags: "",
    type: ""
  });

  const handleRemove = useCallback(() => {
    setAddContent(false);
  }, [setAddContent]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setContentData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const handleTagsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value); // Just update the string
  };

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setContentData((prev) => ({
      ...prev,
      type: e.target.value,
    }));
  };

  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);
      setError({}); // Clear previous errors

      const token = localStorage.getItem("Brain-Token");

      // Convert tagsInput to array only on submit
      const formattedTags = tagsInput
        .split(/[, ]+/)
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const body = {
        ...contentData,
        tags: formattedTags,
      };

      const res = await fetch("http://localhost:8000/api/v1/content/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        if (Array.isArray(data?.error)) {
          const errorMap: ContentErrorTypes = {};
          data.error.forEach((err: any) => {
            const field = err.path?.[0];
            if (field) {
              errorMap[field as keyof ContentErrorTypes] = err.message;
            }
          });
          setError(errorMap);
        }
        toast.error(data?.msg || "Failed to create content");
        return;
      }

      toast.success("Content created successfully!");
      setContentData({
        title: "",
        link: "",
        description: "",
        tags: [],
        type: ""
      });
      setTagsInput(""); // Clear tag input
      setAddContent(false);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [contentData, tagsInput, setAddContent]);

  return (
    <div className='flex flex-col bg-gray-700 rounded-2xl w-full max-w-lg text-white px-6 py-6 md:py-8 md:px-10 shadow-lg'>
      <div className='flex justify-between items-center text-amber-300 font-semibold mb-4'>
        <SubHeading value={"Create New Memory"} />
        <div onClick={handleRemove} className='hover:text-amber-200 p-2 cursor-pointer rounded-full'>
          <GrClose className='text-xl font-bold' />
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        <Input {...{ type: types.text, lableName: 'Title', name: 'title', value: contentData.title, placeholder: 'Enter your title', error: error.title || "", handelChange: handleChange }} />
        <Input {...{ type: types.link, lableName: 'Link', name: 'link', value: contentData.link, placeholder: 'Enter your Link', error: error.link || "", handelChange: handleChange }} />
        <Textarea {...{ lableName: 'Description', name: 'description', value: contentData.description, placeholder: 'Enter your Description', error: error.description || "", handelChangeTextarea: handleChange }} />

        <Input
          type={types.text}
          lableName="Tags"
          name="tags"
          value={tagsInput}
          placeholder="Enter your Tags (Comma or space separated)"
          error={error.tags || ""}
          handelChange={handleTagsChange}
        />

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1 text-white">Type</label>
          <select
            name="type"
            value={contentData.type}
            onChange={handleTypeChange}
            className="bg-gray-800 text-white p-2 rounded-md focus:outline-none"
          >
            <option value="">Select type</option>
            <option value="link">Link</option>
            <option value="tweet">Tweet</option>
            <option value="article">Article</option>
            <option value="youtube">YouTube</option>
          </select>
          {error.type && <span className="text-xs text-red-500">{error.type}</span>}
        </div>
      </div>

      <div className='w-full mt-6'>
      {
        loading?
        <Loader /> : 
        <Button value={'Add Memory'} handelSubmit={handleSubmit} />

      }
      </div>
    </div>
  );
}

export default React.memo(ContentForm);
