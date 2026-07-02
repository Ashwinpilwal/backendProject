import React from 'react'
import { useSelector } from 'react-redux'

const Home = () => {

    const user = useSelector((state) => state.auth.userData)

  return (
    <div>
      <h1>Home</h1>
      <h2>{user?.username}</h2>
      <p>{user?.email}</p>
    </div>
  )
}

export default Home
