import React, {ChangeEvent,JSX,useCallback,useState,MouseEvent,useEffect,} from 'react';
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
function Signin(): JSX.Element {
  const { setUser }: any = useInfoContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserDataType>({
    email: "",
    password: "",
    name: "",
  });
  // @ts-ignore
  const [error, setError] = useState<UserDataType>({
    email: "",
    password: "",
    name: "",
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
        const response = await fetch("https://brainly-ld5q.onrender.com/api/v1/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userInfo),
        });

        const data = await response.json();

        // Handle account not found
        if (data?.msg === "Account no Found") {
          toast.error("Account not found");
          return;
        }

        // Handle invalid credentials
        if (data?.msg === "Invalid Passowrd/ Username") {
          toast.error("Invalid email or password");
          setLoading(false)
          return;
        }

        if (data?.user && data?.token) {
          localStorage.setItem("Brain-Token", data.token);
          setUser(data?.user)
          if (!data.user.isValid) {
            toast("Please verify your email address first.");
            setTimeout(() => navigate("/otp"), 1000);
          } else {
            toast.success("Logged in successfully!");
            setTimeout(() => navigate("/dashboard"), 1000);
          }
        } else {
          toast.error(data?.msg || "Login failed. Try again.");
          setLoading(false)
        }
      } catch (error) {
        console.log("Signin Error:", error);
        toast.error("Something went wrong. Please try again later.");
      }
      finally {
        setLoading(false)
      }
    },
    [userInfo, navigate]
  );
  useEffect(() => {
    const token = localStorage.getItem("Brain-Token")
    if (token) {
      toast.success("Well Come Back");
      navigate("/dashboard");
    }
  }, [])
  return (
    <motion.div
      initial={{ opacity: 0, x: -2000 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2, stiffness: 100 }}
      className='grid grid-cols-1 grid-rows-12 w-full h-screen  overflow-hidden bg-black text-white '>
      <div>
        <LandingHeader />
      </div>
      <motion.div 
                initial={{ opacity: 0,x: 2000 }}
                animate={{ opacity: 1,x:0 }}
                transition={{ duration: 0.5 ,delay: 0.5, stiffness: 100}}  
                exit={{ opacity: 0, x: -2000 }}
      className='flex justify-center items-center w-full h-screen   overflow-hidden '>
        <div className='flex justify-around flex-col items-center rounded-xl m-2  p-2 md:p-5 max-w-92 md:max-w-full bg-violet-800'>
          <div className='flex justify-around items-center flex-col'>
            <Heading value={"Sign in"} />
            <SubHeading value={"Brainly - Your Second Brain Application"} />
          </div>
          <div className='flex justify-around items-start w-full px-10 flex-col my-5'>
            <Input type={types.text} value={userInfo?.email} name={"email"} handelChange={handelChange} placeholder={"Enter your email id "} lableName={"Email"} error={error?.email} />
            <Input type={types.text} value={userInfo?.password} name={"password"} handelChange={handelChange} placeholder={"Enter your password  "} lableName={"Password"} error={error?.password} />
          </div>
          <div className='w-full h-full px-10'>
            {loading ? <Loader /> : <Button handelSubmit={handelSubmit} value={"Sign In"} />}
          </div>
          <div>
            <SubHeading value={"Don't have account "} link={""} linkValue={"Sign Up"} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default React.memo(Signin)