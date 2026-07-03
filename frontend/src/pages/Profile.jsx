import React from 'react'
import { useEffect } from 'react'
import api from '../utils/axios.utils'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { subscribeToggle } from '../services/subscribe.service'

const Profile = () => {

  const [channel, setChannel] = useState(null)
  const [loading, setLoading] = useState(false)
  const {username} = useParams()

  const navigate = useNavigate()

  
  
  useEffect(()=>{
    
    const getUserData = async () => {
      
      try{

        const channel = await api.get(`/users/channel/${username}`)
        
        console.log(channel)

        if(!channel){
          return (
            <div className='text-white bg-black'>Loading...</div>
          )
        }

        setChannel(channel.data.data)
        

      }catch(error){
        // console.log(error.channel?.data)
      }
    }

    getUserData()
      
  },[username, navigate])
  
  
  const handleSubscribe = async () => {
    setLoading(true)
    try{

      
      console.log(channel?._id)
      const response = await subscribeToggle(channel?.username)
      
      if(response){
        
        setChannel((prev)=> ({
          ...prev,
          isSubscribed: !prev.isSubscribed,
          subscribersCount : 
          prev.isSubscribed? prev.subscribersCount - 1: prev.subscribersCount + 1 
        }))
      }
      
    }catch(error){
      console.log(error?.response?.data?.message)
      if(error?.response?.status === 401){
        alert("Please login to subscribe")
      }
    }finally{
      setLoading(false)
    }
  }
  

  


  return (

    

    <div className='w-full text-white'>

      
      {channel?.coverImage?.url &&(
        <div>
            <img 
            src={channel.coverImage.url} 
            alt=""
            className='w-full h-50 object-cover'
            />    
        </div>
      )}

      

      <div className='flex flex-row gap-4 m-4'>

        {channel?.avatar?.url && (
          <div>
            <img 
              src={channel?.avatar?.url}
              alt=""
              className='h-40 w-40 object-cover rounded-full'/>
          </div>
        )}

          

        <div className='flex flex-col gap-2'>
          <p className='text-3xl font-bold'>{channel?.fullName}</p>

          <div className='flex flex-row gap-2'>
            <p className=''>@{channel?.username}</p>
            <p className='text-gray-400'>{channel?.subscribersCount} subscribers</p>
          </div>

          <div className='flex'>
            <button disabled={loading} onClick={handleSubscribe} className={`${channel?.isSubscribed ? "bg-[#a7a7a7] hover:bg-[#ab8686]" : "bg-[#c10c0c] hover:bg-[#c88686]"} py-1 px-2 text-lg font-semibold rounded-lg transition cursor-pointer`}>{channel?.isSubscribed ? "Subscribed": "Subscribe"}</button>
          </div>

        </div>

      </div>





    </div>

  )
}

export default Profile
