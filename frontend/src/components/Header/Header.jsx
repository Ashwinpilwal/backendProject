import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, Link } from 'react-router-dom'
import { sliceLogout } from '../../features/authSlice'
import api from '../../utils/axios.utils'
import { useNavigate } from 'react-router-dom'

const Header = () => {

    const [open, setOpen] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = async() => {
        try{

            dispatch(sliceLogout())
            const response = await api.post("/users/logout")
            // console.log(response)
            navigate('/login')
        }catch(error){
            console.log(error.response?.data)
        }
    }

    const userStatus = useSelector((state) => state.auth.status)
    const userData = useSelector((state) => state.auth.userData)
    // console.log(userData)

    return (
        <>
            <div className='flex flex-row justify-between items-center p-2 bg-[#090909] text-white border-b-1'>

                <NavLink to="/" className={ (isActive) => isActive ? ' flex items-center gap-4' : 'bg-[#494949] flex items-center gap-4' } >
                    <img src="/VideoPlayerLogo.png" alt="" className='w-10 h-10'/>
                    <p className='font-bold'>Video Player</p>
                </NavLink>

                <div className='flex flex-row gap-10'>
                    {/* <NavLink to="/" className={ (isActive) => isActive ? 'bg-[#1b1a1a]' : 'bg-[#494949]'  } >Home</NavLink> */}
                    
                    <form className="w-full max-w-lg mx-auto">
                        <div className="relative">
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m21 21-4.35-4.35M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                            />
                            </svg>

                            <input
                            type="search"
                            placeholder="Search videos..."
                            className="w-full h-12 pl-12 pr-28 rounded-full bg-zinc-900 border border-zinc-700 text-white placeholder-gray-400 outline-none focus:border-red-500 transition"
                            />

                            <button
                            type="submit"
                            className="absolute right-1 top-1/2 -translate-y-1/2 px-5 py-2 rounded-full bg-[#d00a0a] text-white hover:bg-[#861414] cursor-pointer transition"
                            >
                            Search
                            </button>
                        </div>
                    </form>

                </div>

                <div className='flex flex-row gap-10 items-center relative'>
                    {userStatus ? (
                        <>
                            <button onClick={handleLogout} className='px-2 py-1 rounded-sm font-semibold bg-[#d00a0a] hover:bg-[#861414] cursor-pointer transition '>Logout</button>
                        </>
                    ) : (
                        <>
                            <div className='flex gap-4 px-4 py-1 rounded-full bg-[#444444]'>
                                <Link to="/login" className='hover:text-[#ababab] transition'>Login</Link>

                                <div className="w-px h-6 bg-[#989898]"></div>

                                <Link to="/signup" className='hover:text-[#ababab] transition'>Signup</Link>
                            </div>
                        </>
                    )}
                    <img 
                    src={userData?.user?.avatar?.url ? userData?.user?.avatar?.url : 'profile.png'}
                    className={`${open? 'border-2':'border-0'} w-12 h-12 rounded-full`}
                    alt=""
                    onClick={() => setOpen(!open)} />

                    {open && userStatus && userData && (
                        <div className='absolute right-0 top-12 w-50 bg-[#2c2c2c] rounded-2xl flex flex-col gap-2 justify-around font-semibold p-4'>

                            <div className='flex flex-col gap-2'>
                                <div className='flex flex-row gap-2'> 
                                    <div>
                                        <img 
                                        src={userData?.user?.avatar?.url ? userData?.user?.avatar?.url : 'profile.png'}
                                        alt=""
                                        className='w-12 h-12 rounded-full' />
                                    </div>
                                    <div>
                                        <p>@{userData?.user?.username}</p>
                                        <p>{userData?.user?.fullName}</p>
                                    </div>
                                </div>
                                <div>
                                    <Link to={`/profile/${userData?.user?.username}`} className='text-sm text-blue-400'>View you profile</Link>
                                </div>
                            </div>

                            <div className="w-full h-px bg-[#c5c5c5] my-2"></div>

                            <div className='flex flex-col gap-6'>
                                <NavLink to={`/profile/${userData?.user?.username}`} className='flex items-center gap-2'>
                                    <img src="/sideboxprofile.png" className='w-6 h-6' alt="" />
                                    <p>Profile</p>
                                </NavLink>
                                <NavLink to="/upload" className='flex items-center gap-2'>
                                    <img src="/sideboxupload.png" className='w-6 h-6' alt="" />
                                    <p>Upload</p>
                                </NavLink>
                                <NavLink to="/edit-profile" className='flex items-center gap-2'>
                                    <img src="/sideboxeditprofile.png" className='w-6 h-6' alt="" />
                                    <p>Edit Profile</p>
                                </NavLink>
                                
                            </div>

                        </div>
                    )}

                </div>        


            </div>
        </>
    )
}

export default Header



