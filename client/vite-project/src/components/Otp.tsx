import React, { ChangeEvent, JSX, useCallback, useState } from "react";
import Heading from "./Heading";
import SubHeading from "./SubHeading";
import Input from "./Input";
import { types } from "../types/HeadType";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import Loader from "./Loader";
import toast from "react-hot-toast";
import LandingHeader from "./LandingHeader";
import { motion } from "framer-motion";
function Otp():JSX.Element{
    const [userData,setUserData] = useState<{otp:string}>({
        otp:"",
    });
    const [loading,setLoading] = useState<boolean>(false);
    const [error,setError] = useState<{otp:string}>({
        otp:""
    });
    const navigate = useNavigate();

    const handelChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setUserData((pre) => ({
    ...pre,
    [e.target.name]: e.target.value,
  }));
}, [userData,error])

const handelSubmitCheck = useCallback(async () => {
    setLoading(true);
  
    try {
      const token = localStorage.getItem("Brain-Token");
      if (!token) {
        toast.error("User not authenticated. Please login first.");
        navigate("/signin");
        return;
      }
  
      const response = await fetch("https://brainly-ld5q.onrender.com/api/v1/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ otp: userData.otp }),
      });
      console.log(response)
      const data = await response.json();
      console.log(data)
      if (data?.msg === "Invalid OTP") {
        toast.error("Invalid OTP. Please try again.");
        setError(prev => ({ ...prev, otp: "Incorrect OTP" }));
      } else if (data?.msg === "Verification Done ✅") {
        toast.success("OTP Verified Successfully!");
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        toast(data?.msg || "Unexpected response.");
      }
    } catch (error) {
      console.log("Error verifying OTP:", error);
      toast.error("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  }, [userData.otp, navigate]);
  
const handelSubmitResend = useCallback(async () => {
    setLoading(true);
  
    try {
      const token = localStorage.getItem("Brain-Token");
      if (!token) {
        toast.error("User not authenticated. Please login first.");
        navigate("/signin");
        return;
      }
  
      const response = await fetch("https://brainly-ld5q.onrender.com/api/v1/resend", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
  
      if (data?.msg?.startsWith("OTP sent to")) {
        toast.success(data.msg);
      } else {
        toast.error(data?.msg || "Failed to resend OTP.");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);
  
    return(
    <motion.div
    initial={{ opacity: 0, x: -2000 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.2, stiffness: 100 }}
     className="grid grid-cols-1 grid-rows-9 overflow-hidden w-full h-full bg-black text-white">
      <div className="row-span-1 ">
          <LandingHeader />
      </div>
      <div className="row-span-7 flex justify-center items-center w-full   ">
      <motion.div
      initial={{ opacity: 0,x: 2000 }}
      animate={{ opacity: 1,x:0 }}
      transition={{ duration: 0.5 ,delay: 0.5, stiffness: 100}}  
      exit={{ opacity: 0, x: -2000 }}
       className="bg-violet-500 flex justify-around gap-4 flex-col items-center w-full max-w-sm md:max-w-md lg:max-w-lg px-4 sm:px-6 py-8 rounded-xl sm:rounded-2xl md:rounded-3xl  shadow-lg">
          <div className="w-full text-center">
              <Heading value={"OTP Verification"}/>
          </div>
          <div className="w-full pl-10">
              <Input 
                  type={types.text} 
                  name="otp" 
                  lableName="OTP" 
                  placeholder="Please Enter Your 6 Digit OTP" 
                  value={userData.otp} 
                  error={error?.otp} 
                  handelChange={handelChange} 
              />
          </div>
          <div className="w-full flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center my-2 px-10">
              {!loading ? (
                  <>
                      <Button value="Check OTP" handelSubmit={handelSubmitCheck}/>
                      <Button value="Resend OTP" handelSubmit={handelSubmitResend}/>
                  </>
              ) : (
                  <Loader />
              )}
          </div>
  
          <div className="w-96 text-center sm:text-left text-sm sm:text-base">
              <SubHeading value="Please check your Mail/Spam. OTP will expire in 10 minutes"/>
          </div>
      </motion.div>
      </div>
  </motion.div>
    )
}

export default React.memo(Otp)