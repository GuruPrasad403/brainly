import React, { ChangeEvent, JSX, useCallback, useState } from 'react';
import { useInfoContext } from '../context/UserContext';
import SubHeading from './SubHeading';
import { GrClose } from "react-icons/gr";
import Input from './Input';
import { types } from '../types/HeadType';
import Textarea from './Textarea';
import Button from './Button';
import Loader from './Loader';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
interface ContentErrorTypes {
  title?: string;
  link?: string;
  description?: string;
  tags?: string;
  type?: string;
}

function ContentForm(): JSX.Element {
  const { setAddContent, contentData, setContentData, setEditContent, setViewContent, tagsInput, setTagsInput }: any = useInfoContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ContentErrorTypes>({});
  const token = localStorage.getItem("Brain-Token");

  const handleRemove = useCallback(() => {
    setEditContent(true);
    setViewContent(false);
    setAddContent(false);
  }, [setAddContent, setEditContent, setViewContent]);

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContentData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
  };

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setContentData((prev: any) => ({
      ...prev,
      type: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError({});
    try {
      const formattedTags = tagsInput
        .split(/[, ]+/)
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0);

      const isEditing = Boolean(contentData?._id);

      const apiUrl = isEditing
        ? `http://brainly-ld5q.onrender.comapi/api/v1/content?id=${contentData._id}`
        : `https://brainly-ld5q.onrender.comapi/api/v1/content/content`;

      const method = isEditing ? "PUT" : "POST";

      const body = JSON.stringify({
        ...contentData,
        tags: isEditing
          ? contentData.tags.map((tag: any) => (typeof tag === "string" ? tag.trim() : tag.title))
          : formattedTags,
      });

      const res = await fetch(apiUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      const data = await res.json();

      if (!res.ok || data.success !== "Success") {
        if (Array.isArray(data?.error)) {
          const errorMap: ContentErrorTypes = {};
          data.error.forEach((err: any) => {
            let field = err.path?.[0];
            if (typeof field === "string") {
              if (field.startsWith("tags")) field = "tags";
              errorMap[field as keyof ContentErrorTypes] = err.message;
            }
          });
          setError(errorMap);
        toast.error(data?.msg || "Something went wrong.");
        return

        }
        toast.success(data?.msg || "Content Updated");
        setAddContent(false);
        setViewContent(false)  
        setEditContent(true)
        setContentData("")
        setLoading(false)
        return;
      }

      toast.success(isEditing ? "Content updated successfully!" : "Content created successfully!");
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setContentData({
      title: "",
      link: "",
      description: "",
      tags: [],
      type: ""
    });
    setTagsInput("");
    setAddContent(false);
    setEditContent(false);
    setViewContent(false);
  };

  return (
    <div className="flex flex-col rounded-2xl w-full max-w-lg px-4 py-6 sm:px-6 sm:py-8 md:px-10 shadow-lg bg-black">
  <div className="flex justify-between items-center text-violet-300 font-semibold mb-4">
    <SubHeading value={`${contentData?._id ? "Edit Memory" : "Create New Memory"}`} />
    <div onClick={handleRemove} className="hover:text-amber-200 p-2 cursor-pointer rounded-full">
      <GrClose className="text-xl font-bold" />
    </div>
  </div>

  <div className="flex flex-col gap-4">
    <Input
      {...{
        type: types.text,
        lableName: 'Title',
        name: 'title',
        value: contentData.title,
        placeholder: 'Enter your title',
        error: error.title || '',
        handelChange: handleChange,
      }}
    />
    <Input
      {...{
        type: types.link,
        lableName: 'Link',
        name: 'link',
        value: contentData.link,
        placeholder: 'Enter your Link',
        error: error.link || '',
        handelChange: handleChange,
      }}
    />
    <Textarea
      {...{
        lableName: 'Description',
        name: 'description',
        value: contentData.description,
        placeholder: 'Enter your Description',
        error: error.description || '',
        handelChangeTextarea: handleChange,
      }}
    />
    <Input
      type={types.text}
      lableName="Tags"
      name="tags"
      value={tagsInput}
      placeholder="Enter your Tags (Comma or space separated)"
      error={error.tags || ''}
      handelChange={handleTagsChange}
    />

    <div className="flex flex-col">
      <motion.label
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="text-sm font-semibold mb-1 text-white">Type</motion.label>
      <motion.select
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
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
      </motion.select>
      {error.type && <span className="text-xs text-red-500">{error.type}</span>}
    </div>
  </div>

  <div className="w-full mt-6">
    {loading ? (
      <Loader />
    ) : (
      <Button value={contentData?._id ? 'Update Memory' : 'Add Memory'} handelSubmit={handleSubmit} />
    )}
  </div>
</div>

  );
}

export default React.memo(ContentForm);
