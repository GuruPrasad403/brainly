import React, {
    ChangeEvent,
    JSX,
    useCallback,
    useState,
    MouseEvent,
    useEffect, 
  } from 'react';
import Heading from './Heading'
import SubHeading from './SubHeading'
import Input from './Input'
import { types, UserDataType } from '../types/HeadType'
import Button from './Button'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';
import { useInfoContext } from '../context/UserContext';
function Signup(): JSX.Element{
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
      const response = await fetch("https://brainly-ld5q.onrender.com/api/v1/signup", {
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
        <div className='flex justify-center items-center w-full h-screen bg-gray-800  text-white overflow-hidden'>
            <div className='flex justify-around flex-col items-center rounded-xl m-2 bg-gray-700 p-2 md:p-5 max-w-92 md:max-w-full'>
                <div className='flex justify-around items-center flex-col'>
                <Heading value={"Sign up"}/>
                <SubHeading value={"Brainly - Your Second Brain Application"} />
                </div>
                <div className='flex justify-around items-start w-full px-10 flex-col my-5'>
                    <Input type={types.text} value={userInfo?.email} name={"email"} handelChange={handelChange} placeholder={"Enter your email id "} lableName={"Email"} error={error?.email}/>
                    <Input type={types.text} value={userInfo?.name} name={"name"} handelChange={handelChange} placeholder={"Enter your name  "} lableName={"Name"} error={error?.name}/>
                    <Input type={types.text} value={userInfo?.password} name={"password"} handelChange={handelChange} placeholder={"Enter your password  "} lableName={"Password"} error={error?.password}/>
                </div>
                <div className='w-full h-full px-10'>
                    {
                        loading ? <Loader /> :<Button handelSubmit={handelSubmit} value={"Sign Up"}/>

                    }
                </div>
                <div>
                    <SubHeading value={"Already Have an Account "} link={"signin"} linkValue={"Sign in"}/>
                </div>
            </div>
        </div>
    )
}

export default React.memo(Signup)