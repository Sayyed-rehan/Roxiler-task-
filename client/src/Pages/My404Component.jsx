import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

const My404Component = () => {
    let navigate = useNavigate()

    useEffect(()=>{
        setTimeout(()=>{
            navigate("/login")
        },3000)
    })
  return (
    <div>
        <h1>404 Page not found</h1>
        <h4>Redirecting to Login in 3 Sec</h4>
    </div>
  )
}

export default My404Component