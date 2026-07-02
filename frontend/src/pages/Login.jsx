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
            console.log(error)
        }


        
    }

  return (
    <div className='flex justify-around'>

        <div className='flex flex-col gap-5 mt-10'>

            <Link to='/' className='bg-[#2b305f] text-white p-2 rounded'>Home</Link>

            <h1>Login-Form</h1>

            <form onSubmit={handleSubmit(login)} className='flex flex-col gap-4'>

                <div className=''>
                    <input 
                    type="email" 
                    {...register("email", {required: "Email is required!"})} 
                    placeholder='email or username' 
                    className='bg-gray-300'/>
                </div>

                <div className=''>
                    <input 
                    type="password" 
                    {...register("password", {required: "Password is required"})} 
                    placeholder='password' 
                    className='bg-gray-300'/>
                </div>

                <div className=''>
                    <button type='submit' className='bg-red-500'>Login</button>
                </div>

            </form>

        </div>
      
    </div>
  )
}

export default Login
