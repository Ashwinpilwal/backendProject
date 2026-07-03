import React from 'react'
import { useForm } from 'react-hook-form'
import api from '../utils/axios.utils'
import { useDispatch, useSelector } from 'react-redux'
import { sliceLogin } from '../features/authSlice'
import { useNavigate } from 'react-router-dom'
import {Link} from 'react-router-dom'

const Login = () => {

    const {register, handleSubmit, disable} = useForm()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const login = async(data) => {
        try{
            const response = await api.post("/users/login", data)

            dispatch(sliceLogin(response.data.data.user))
            console.log(response.data.data.user)
            navigate('/')


        }catch(error){
            console.log(error.response.data)
        }


        
    }

  return (
    // <div className='flex justify-around'>

    //     <div className='flex flex-col gap-5 mt-10 bg-gray-400'>

    //         <Link to='/' className='bg-[#2b305f] text-white p-2 rounded'>Home</Link>

    //         <h1>Login-Form</h1>

    //         <form onSubmit={handleSubmit(login)} className='flex flex-col gap-4'>

    //             <div className='w-100'>
    //                 <input 
    //                 type="email" 
    //                 {...register("email", {required: "Email is required!"})} 
    //                 placeholder='email or username' 
    //                 className='bg-gray-300'/>
    //             </div>

    //             <div className=''>
    //                 <input 
    //                 type="password" 
    //                 {...register("password", {required: "Password is required"})} 
    //                 placeholder='password' 
    //                 className='bg-gray-300'/>
    //             </div>

    //             <div className=''>
    //                 <button type='submit' className='bg-red-500'>Login</button>
    //             </div>

    //         </form>

    //     </div>
      
    // </div>
<div
    className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    style={{
        backgroundImage: `
            linear-gradient(
                90deg,
                rgba(0,0,0,.55),
                rgba(0,0,0,.72),
                rgba(0,0,0,.82)
            ),
            url('/LoginBG.png')
        `,
        backgroundSize: "cover",
        backgroundPosition: "left center",
        backgroundRepeat: "no-repeat",
    }}
>

    {/* Very subtle ambient glow */}
    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-pink-500/5"></div>

    {/* Login Card */}
    <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-black/45 backdrop-blur-2xl p-8 shadow-2xl">

        {/* Border Glow */}
        <div className="absolute inset-0 rounded-3xl border border-orange-400/10 pointer-events-none"></div>

        {/* Header */}
        <div className="mb-8">

            <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-orange-300 transition"
            >
                ← Back to Home
            </Link>

            <h1 className="mt-6 text-5xl font-black leading-none bg-gradient-to-r from-orange-300 via-red-400 to-pink-400 bg-clip-text text-transparent">
                Welcome Back
            </h1>

            <p className="mt-3 text-gray-400">
                Please sign in to continue.
            </p>

        </div>

        {/* Form */}
        <form
            onSubmit={handleSubmit(login)}
            className="space-y-5"
        >

            {/* Email */}
            <div>

                <label className="mb-2 block text-sm text-gray-300">
                    Email
                </label>

                <input
                    type="email"
                    {...register("email")}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition-all duration-300 focus:border-orange-400/40 focus:bg-white/10"
                />

            </div>

            {/* Password */}
            <div>

                <label className="mb-2 block text-sm text-gray-300">
                    Password
                </label>

                <input
                    type="password"
                    {...register("password")}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition-all duration-300 focus:border-orange-400/40 focus:bg-white/10"
                />

            </div>

            <button
                type="submit"
                className="mt-3 w-full rounded-xl bg-gradient-to-r from-[#7d1b1b] via-[#924711] to-[#851373] py-3 font-semibold text-white transition-all duration-300 hover:brightness-110"
            >
                Sign In
            </button>

        </form>

    </div>

</div>
  )
}

export default Login
