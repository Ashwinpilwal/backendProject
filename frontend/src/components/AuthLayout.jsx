import React, { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function AuthLayout({children, authentication = true}){
  const [loading, setloading] = useState(true)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const authStatus = useSelector((state) => state.auth.status)

  useEffect(() => {
    if(!authStatus && authentication){
      navigate('/login')
    }
    else if(authStatus && !authentication){
      navigate('/')
    }
    setloading(false)
  }, [authStatus])

  return loading?null: children
}