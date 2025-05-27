import React, { JSX, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import Loader from './Loader';
import Heading from './Heading';

function SharedBrain(): JSX.Element {
  const { linkId } = useParams();
//   const linkData = useParams();
  console.log(linkId);
  const [data, setData] = useState<any>(null);

  const getData = useCallback(async () => {
    try {
      if(!linkId) return toast.error("No linkId found. Please check the URL.");
      const response = await fetch(`https://brainly-ld5q.onrender.com/api/v1/link?linkId=${linkId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (!response.ok) {
        toast.error(result?.msg || result?.error);
        return;
      }

      setData(result?.data);
      toast.success(result?.msg || "Data fetched successfully");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }, [linkId]);

  useEffect(() => {
    getData();
  }, [linkId]);

  return (
    <div className="min-h-screen bg-black text-white p-4 flex justify-center items-start">
      <div className="max-w-3xl w-full mt-10">
        <h1 className="text-2xl font-bold mb-6 text-center">Shared Brain Content</h1>

        {!data ? (
<Loader />
) : (
          <div className="bg-violet-500 p-6 rounded-2xl shadow-md space-y-4">
            <div>
              <Heading value={data?.contentId?.title} />
            </div>
            <div>
              <h2 className="text-xl font-semibold px-5 py-2">Description:</h2>
              <p className='px-8 text-justify'>{data?.contentId?.description}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold px-5">Link:</h2>
              <a
                href={data?.contentId?.link}
                title={data?.contentId?.link}
                target="_blank"
                rel="noopener noreferrer"
                className="underline uppercase px-10 text-white hover:text-black"
              >
                {data?.contentId?.type}
              </a>
            </div>
            <div>
              <h2 className="text-xl font-semibold px-5">Shared by:</h2>
              <p className='px-8'>{data?.userId?.name} ({data?.userId?.email})</p>
            </div>
            <div className='px-5'>
              <h2 className="text-xl font-semibold">Tags:</h2>
              <div className="flex px-8 py-2 flex-wrap gap-2">
                {data?.contentId?.tags?.map((tag: any) => (
                  <span
                    key={tag._id}
                    className="bg-gray-500 text-white border-1 px-3 py-1 rounded-full text-sm"
                  >
                    {tag.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(SharedBrain);
