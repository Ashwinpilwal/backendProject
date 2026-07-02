import './App.css'
import Header from "./components/Header/Header.jsx"
import Footer from './components/Footer/Footer.jsx'
import { Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import api from './utils/axios.utils.js'
import { sliceLogin, sliceLogout } from './features/authSlice.js'

function App() {
  
  const dispatch = useDispatch()

  useEffect(() => {

    const getCurrentUserInfo = async() => {
      try{

        const response = await api.get("/users/current-user")
        dispatch(sliceLogin(response.data.data))

        console.log(response)
      }catch(error){
        dispatch(sliceLogout())
        console.log(error.response?.data)
      }

    }

    getCurrentUserInfo()
  },[])

  return (
    <>
    <div className='min-h-screen flex flex-col'>

      <Header/>

      <main className='flex-1'>
        <Outlet/>
      </main>

      <Footer/>
    </div>
    </>
  )
}
 
export default App
