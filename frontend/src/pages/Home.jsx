import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import api from '../utils/axios.utils'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { useNavigate } from 'react-router-dom'

const Home = () => {

    const user = useSelector((state) => state.auth.userData)

    const [videos, setvideos] = useState([])
    const [loading, setloading] = useState(true)
    
    const navigate = useNavigate()


    useEffect(()=>{
      const getVideos = async () => {
          
        try{
          const videos = await api.get("videos/allvideos")

          console.log(videos.data.data.docs)
          setvideos(videos.data.data.docs)

        }catch(error){
          console.log(error?.response?.data)

        }finally{
          setloading(false)
        }

      }

      getVideos()
    
    },[])

    if(loading){
      <div>Loading...</div>
      return
    }

  return (
    <div className='text-white p-4'>

      <div>

        {videos?.map((video) => (

          <div
          key={video._id}
          className="w-full max-w-[380px] cursor-pointer group flex flex-col gap-3"
        >
          {/* Thumbnail Container */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-800 shadow-sm group-hover:shadow-lg transition-shadow duration-300">
            <img
              src={video.thumbnail.url}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            />
            
            {/* Optional: Video Duration Badge (Adds a very professional touch) */}
            <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-xs font-medium px-1.5 py-0.5 rounded-md tracking-wide">
              {video.duration || "12:34"} 
            </div>
          </div>

          {/* Video Details */}
          <div className="flex gap-3 px-1 items-start">
            {/* Avatar */}
            <img
              src={video.owner.avatar.url}
              alt={video.owner.fullName}
              className="w-9 h-9 mt-0.5 rounded-full object-cover flex-shrink-0 bg-gray-700 ring-1 ring-gray-800"
            />

            {/* Text Info */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <h3 className="text-[#f1f1f1] font-semibold text-base leading-snug line-clamp-2 group-hover:text-white transition-colors duration-200">
                {video.title}
              </h3>

              <div className="mt-1 text-sm text-[#aaaaaa] flex flex-col">
                {/* Channel Name */}
                <span className="hover:text-gray-300 transition-colors duration-200 line-clamp-1" onClick={ ()=> navigate(`/profile/${video.owner.username}`)}>
                  {video.owner.fullName}
                </span>

                {/* Views & Time */}
                <div className="flex items-center gap-1.5 text-[13.5px] mt-0.5">
                  <span>{video.views} views</span>
                  <span className="text-[10px] leading-none">•</span>
                  {/* Mock time - replace with your dynamic timestamp if you have one */}
                  <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span> 
                </div>
              </div>
            </div>
          </div>
        </div>


        ))}

      </div>

    </div>
  )
}

export default Home
