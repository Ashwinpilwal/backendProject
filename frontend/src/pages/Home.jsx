import React from 'react'
import { useSelector } from 'react-redux'

const Home = () => {

    const user = useSelector((state) => state.auth.userData)

  return (
    <div className='font-bold text-white p-4'>
      <h1>Home</h1>
      <h2>{user?.user?.username}</h2>
      <p>{user?.user?.email}</p>
    </div>
  )
}

export default Home
