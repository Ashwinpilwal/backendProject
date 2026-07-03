import './App.css'
import Header from "./components/Header/Header.jsx"
import Footer from './components/Footer/Footer.jsx'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './pages/LeftSidebar.jsx'


function App() {
  


  return (
    <>
    <div className='min-h-screen flex flex-col'>

      <Header/>

      <main className='flex  flex-1 bg-[#585368]'>
        {/* <div className='min-w-[15vw] bg-[#121212]'></div> */}
        <LeftSidebar/>
        <Outlet/>
      </main>

      <Footer/>
    </div>
    </>
  )
}
 
export default App
