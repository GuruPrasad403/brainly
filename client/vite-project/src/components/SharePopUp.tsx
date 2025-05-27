import React, { JSX, useCallback } from "react";
import { GrClose } from "react-icons/gr";
import { FaFacebook, FaWhatsapp, FaLinkedin, FaTwitter } from "react-icons/fa";
import { useInfoContext } from "../context/UserContext";
import SubHeading from "./SubHeading";
import Button from "./Button";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

function SharePopUp(): JSX.Element {
    const { setSharedContent, url }: any = useInfoContext();

    const handelClick = useCallback(() => {
        setSharedContent(false);
    }, []);

    const handelCopy = useCallback(() => {
        navigator.clipboard.writeText(url).then(() => {
            toast.success("URL copied to clipboard!");
        }).catch((err) => {
            toast.error("Failed to copy URL.");
            console.error("Failed to copy: ", err);
        });
    }, [url]);

    const shareOptions = [
        {
            name: "WhatsApp",
            icon: <FaWhatsapp className="text-green-500 text-xl" />,
            link: `https://wa.me/?text=${encodeURIComponent(url)}`
        },
        {
            name: "Facebook",
            icon: <FaFacebook className="text-blue-600 text-xl" />,
            link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        },
        {
            name: "LinkedIn",
            icon: <FaLinkedin className="text-blue-700 text-xl" />,
            link: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        },
        {
            name: "Twitter",
            icon: <FaTwitter className="text-blue-400 text-xl" />,
            link: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`
        },
    ];

    return (
        <div className="p-5 bg-black w-full overflow-hidden text-white">
            <div className="flex justify-between items-center font-semibold">
                <SubHeading value={"Share Brain"} />
                <div className="hover:text-gray-500 p-2 cursor-pointer rounded-full" onClick={handelClick}>
                    <GrClose className="text-xl font-bold" />
                </div>
            </div>

            <div>
                <SubHeading value={"Share your brain with your friends"} />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex justify-center text-md items-center gap-2 flex-row mt-5 w-full h-full text-wrap flex-wrap bg-gray-600 border-2 p-2">
                    <span className="font-semibold">Brain URL:</span>
                    <span className="break-words">{url}</span>
                </motion.div>
            </div>

            <div className="flex justify-center items-center mt-5">
                <Button value="Copy Link" handelSubmit={handelCopy} />
            </div>

            <div className="mt-6">
                <SubHeading value="Share via" />
                <div className="flex justify-center gap-6 mt-3 flex-wrap">
                    {shareOptions.map((option) => (
                        <a
                            key={option.name}
                            href={option.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center hover:scale-110 transition-transform"
                        >
                            {option.icon}
                            <span className="text-sm mt-1">{option.name}</span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default React.memo(SharePopUp);
