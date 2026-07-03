import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import api from '../utils/axios.utils.js'
import { authChecking, sliceLogin, sliceLogout } from '../features/authSlice.js'
  

const AuthInitializer = ({children}) =>{

    
    const dispatch = useDispatch()
    
    useEffect(() => {

        
        const getCurrentUserInfo = async() => {
            try{
                
                const response = await api.get("/users/current-user")
                dispatch(sliceLogin(response.data.data))
                
            }catch(error){
                
                dispatch(sliceLogout())
                
            }
        }
        
        getCurrentUserInfo()
    },[dispatch])
    
    return children
}
export default AuthInitializer
