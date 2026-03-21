import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

const getCurrentUser = () => {
    const dispach = useDispatch()
  useEffect(()=>{
    const fetchUser = async()=>{
        try{
            const result = await axios.get(serverUrl + "/api/user/getcurrentuser", {withCredentials:true})
            dispach(setUserData(result.data))

        } catch(error){
            console.log(error)
            dispach(setUserData(null))
        }
    }
    fetchUser()
  }, [])
}

export default getCurrentUser
