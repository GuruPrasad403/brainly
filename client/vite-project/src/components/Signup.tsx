import React, {ChangeEvent,JSX,useCallback,useState,MouseEvent,useEffect, } from 'react';
import Heading from './Heading'
import SubHeading from './SubHeading'
import Input from './Input'
import { types, UserDataType } from '../types/HeadType'
import Button from './Button'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';
import { useInfoContext } from '../context/UserContext';
import LandingHeader from './LandingHeader';
import { motion } from 'framer-motion';
function Signup(): JSX.Element{
  /* eslint-disable @typescript-eslint/no-explicit-any */
    const {setUser} :any = useInfoContext();
    const [loading,setLoading] = useState<boolean>(false);
    const [userInfo,setUserInfo] = useState<UserDataType>({
        email : "",
        password:"",
        name:"",
    });
    const [error,setError] = useState<UserDataType>({
        email : "",
        password:"",
        name:"",
    });
    const navigate = useNavigate();
    const handelChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
  setUserInfo((pre) => ({
    ...pre,
    [e.target.name]: e.target.value,
  }));
}, [userInfo]);
const handelSubmit = useCallback(
  async (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setLoading(true)
    try {
      const response = await fetch("http://localhost:8000/api/v1/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      const data = await response.json();

      // Handle validation errors
      if (data?.msg === "Invalid Inputs" && Array.isArray(data?.error)) {
        toast.error("Invalid Input Fields");

        setError(prev => {
          const fieldErrors = data.error.reduce((acc: any, err: any) => {
            if (err?.path?.[0]) {
              acc[err.path[0]] = err.message;
            }
            return acc;
          }, { ...prev });

          return fieldErrors;
        });

        return;
      }

      // Username taken or other logical errors
      if (data?.msg?.startsWith("Username")) {
        toast.error(data?.msg || "Username already taken");
        return;
      }

      // Successful Signup
      if (data?.token) {
        localStorage.setItem("Brain-Token", data?.token);
        toast.success(data?.msg || "Account created successfully. Check your email for OTP.");
        setUser(data?.user)
        setTimeout(() => navigate("/otp"), 2000);
      } else {
        toast.error(data?.msg || "Signup failed. Try again.");
      }

    } catch (error) {
      console.log("Signup Error:", error);
      toast.error("Something went wrong. Please try again later.");
    }
    finally{
        setUserInfo({
            email : "",
            password:"",
            name:"",
        })
        setLoading(false)
    }
  },
  [userInfo, setError, navigate]
);


  useEffect(()=>{
    const token = localStorage.getItem("Brain-Token")
    if(token){
      toast.success("Well Come Back");
      navigate("/dashboard");
    } 
  }, [])
    return(
        <motion.div 
        initial={{ opacity: 0,x: -2000 }}
        animate={{ opacity: 1,x:0 }}
        transition={{ duration: 0.5 ,delay: 0.2, stiffness: 100}}
        
        className='grid grid-cols-1 grid-rows-12 w-full h-screen  overflow-hidden bg-black text-white'>
          <div className='col-span-1 row-span-1  w-full h-full '>
            <LandingHeader />
          </div>
          <motion.div 
          initial={{ opacity: 0,x: 2000 }}
          animate={{ opacity: 1,x:0 }}
          transition={{ duration: 0.5 ,delay: 0.5, stiffness: 100}}  
          className='col-span-1 row-span-11  w-full h-full flex justify-center items-center'>
            <div className='flex justify-around flex-col items-center rounded-xl m-2  p-2 md:p-5 max-w-92 md:max-w-full bg-violet-800'>
                <div className='flex justify-around items-center flex-col uppercase'>
                <Heading value={"Sign up"}/>
                <SubHeading value={"Brainly - Your Second Brain Application"} />
                </div>
                <div className='flex justify-around items-center w-full px-10 flex-col my-5'>
                    <Input type={types.text} value={userInfo?.email} name={"email"} handelChange={handelChange} placeholder={"Enter your email id "} lableName={"Email"} error={error?.email}/>
                    <Input type={types.text} value={userInfo?.name} name={"name"} handelChange={handelChange} placeholder={"Enter your name  "} lableName={"Name"} error={error?.name}/>
                    <Input type={types.password} value={userInfo?.password} name={"password"} handelChange={handelChange} placeholder={"Enter your password  "} lableName={"Password"} error={error?.password}/>
                </div>
                <div className='w-full h-full px-10 font-semibold'>
                    {
                        loading ? <Loader /> :<Button handelSubmit={handelSubmit} value={"Sign Up"}/>

                    }
                </div>
                <div>
                    <SubHeading value={"Already Have an Account "} link={"signin"} linkValue={"Sign in"}/>
                </div>
            </div>
            </motion.div>
        </motion.div>
    )
}

export default React.memo(Signup)