import api from "../utils/axios.utils"

const subscribeToggle = async (channelId) => {
    try{
        const response = await api.post(`/subscription/subscribe-channel/${channelId}`) 
        return response.data
    }catch(error){
        console.log(error?.response?.data)
        throw error
    }
}

export {subscribeToggle}