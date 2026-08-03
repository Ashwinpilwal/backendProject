import React, { useEffect } from 'react'
import api from '../../utils/axios.utils'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Subscriptions = () => {

    const [subscriptions, setsubscriptions] = useState([])
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        const getSubscriptions = async () => {

            try{
                const response = await api.get("subscription/subscribing-channels")
                setsubscriptions(response.data.data)
                console.log(response.data.data)
            }catch(error){
                console.log(error?.response?.data)

            }finally{
                setLoading(false)
            }

        }
        getSubscriptions()

    },[])

    if(loading){
        <div>Loading...</div>
        return 
    }


  return (
    <div className='text-white flex flex-col gap-4'>


        <div className='font-semibold'>
            Subscriptions
        </div>

        <div className='flex flex-col'>
            {subscriptions?.map((subscription) => (
                <div key={subscription.channel.username} className='flex items-center gap-4 text-sm hover:bg-[#202020] p-2 rounded-2xl' onClick={() => navigate(`/profile/${subscription.channel.username}`)}>

                    <img className='w-7 h-7 object-cover rounded-full' src={subscription.channel.avatar} alt="" />
                    <li className='bg-amber list-none'>
                        @{subscription.channel.username}
                    </li>

                </div>
            ))}
        </div>


    </div>
  )
}

export default Subscriptions
