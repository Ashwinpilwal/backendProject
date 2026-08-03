import React from 'react'
import { Link } from 'react-router-dom'
import Subscriptions from '../components/LeftNavbarComponents/Subscriptions'


const LeftSidebar = () => {
  return (
    <>
        <div className='bg-black text-white min-w-[14vw]'>


            <div className='p-4 flex flex-col gap-4'>


                <Link to="/" className="flex gap-2 items-center font-semibold">
                    <img src="/home.png" alt="" className='w-6 h-6'/>
                    <p className='font-bold'>Home</p>
                </Link>

                <div className="w-full h-px bg-[#989898]"></div>

                <Subscriptions/>

            </div>


        </div>
    </>
  )
}

export default LeftSidebar
