import React, { useState } from 'react'
import { RxEyeClosed, RxEyeOpen } from "react-icons/rx";
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../components/ui/hover-card"
import { Button } from '../components/ui/button';
import { IoLogInOutline } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import { setUser } from '../store/features/userSlice';
import toast from 'react-hot-toast';
import api from '@/utils/axiosConfig';

type LoginFormVals = {
  email:string,
  password:string,
}

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

    const [formData, setFormData] = useState<LoginFormVals>({
        email:"",
        password:"",    
    })
    const [showPass, setShowPass] = useState(false);

    const changeHandler = (e : React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
        });
    }

    const submitHandler = (e:any) => {
        e.preventDefault();
        console.log(formData)
        api.post('/users/login', formData)
            .then(response => {
                console.log(response)
                const user = response?.data?.data?.user;
                dispatch(setUser({user}))
                navigate('/')
                toast.success("Login successful")
            }).catch(error => {
                console.log(error)
                toast.error("Login failed")
            });
    }
  
  return (
    <div className="flex items-center h-screen">
        <img src={'/images/auth-bg.jpg'} alt='background' className='object-cover w-full h-screen absolute inset-0 blur-sm'/>
        <div className='w-11/12 max-w-7xl mx-auto'>
            <div className='flex justify-around items-center md:px-10 px-5 rounded-lg '>
                <div className='sm:w-3/5 max-w-md border rounded-lg relative flex flex-col items-center gap-3 p-3 pt-8 sm:pt-10 sm:p-5 w-full bg-black/80'>
                    <div className='rounded-full p-1 border bg-white absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2'>
                        <div className='aspect-square rounded-full overflow-hidden '>
                            <img src='/images/auth.jpg' alt='' className='object-contain h-16'/>
                        </div>
                    </div>
                    <div className='text-center w-full mb-8'>
                        <h2 className='py-2 font-extrabold text-2xl text-gray-100'>Welcome back!!</h2>
                        <p className='text-gray-100 text-lg'>Sign in to your account</p>
                    </div>

                    <form className='w-11/12 flex flex-col gap-5' onSubmit={submitHandler}>
                        {/* Email */}
                        <div>
                            <Label htmlFor='email'/>
                            <Input type='email' placeholder='Enter email' name='email' id='email' onChange={changeHandler}/>
                        </div>

                        {/* Password */}
                        <div className='relative'>
                            <Label htmlFor='password'/>
                            <Input type={showPass ? 'text' : 'password'} placeholder='Enter password' name='password' id='password' className='pr-16' onChange={changeHandler}/>
                            <button type='button' className='absolute bottom-1/2 right-5' onClick={() => setShowPass(!showPass)}>
                            {
                                !showPass ? <RxEyeClosed/> : <RxEyeOpen />
                            }
                            </button>
                            <div>
                            <HoverCard>
                                <HoverCardTrigger className='text-sky-600 underline text-xs flex justify-end pr-2 pt-1'>Forget Password?</HoverCardTrigger>
                                <HoverCardContent >
                                Sorry, this function has not been created for now.
                                </HoverCardContent>
                            </HoverCard>
                            </div>
                        </div>

                        {/* Submit */}
                        <Button type='submit' className='gap-4'>
                            <p>Login</p>
                            <IoLogInOutline size={18}/>
                        </Button>

                        {/* Signup link */}
                        <div>
                            <div className='relative'>
                            <div className='absolute inset-0 flex items-center'>
                                <div className='w-full border-t border-gray-300'/>
                            </div>
                            <div className='relative flex justify-center text-md'>
                                <span className='bg-white px-2 text-gray-800'>
                                Or
                                </span>
                            </div>
                            </div>
                            <div className='flex sm:flex-row flex-col items-center gap-y-0 gap-x-2 justify-center text-md px-2 my-2'>
                                <p className='text-gray-200'>New User?</p>
                                <Link to={'/signup'} className='underline cursor-pointer text-gray-500'>
                                    Create an account
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login
