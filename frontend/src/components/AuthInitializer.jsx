import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import api from '../utils/axios.utils.js'
import { authChecking, sliceLogin, sliceLogout } from '../features/authSlice.js'
import { useState } from 'react'
  

const AuthInitializer = ({children}) =>{

    console.log("Authinitialzation mounted!!")

    
    const dispatch = useDispatch()
    const [loading, setloading] = useState(true)
    
    useEffect(() => {

        
        const getCurrentUserInfo = async() => {
            try{
                
                const response = await api.get("/users/current-user")
                dispatch(sliceLogin(response.data.data.user))
                
            }catch(error){
                
                dispatch(sliceLogout())
                
            }finally{
                setloading(false)
            }
        }
        
        getCurrentUserInfo()
    },[dispatch])

    // if(loading){
    //     return <div>Loading... </div>
    // }
    
    return children
}
export default AuthInitializer
