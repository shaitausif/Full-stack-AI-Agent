import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setuserData } from '../features/data/dataSlice'


const AuthCheck = ({children, protected : protectedRoute}) => {

  const navigate = useNavigate()
  const [loading, setloading] = useState(true)
  const dispatch = useDispatch()



  useEffect(() => {

     const checkAuth = async () => {
      let data;
    try {
      const res = await fetch(`${import.meta.env.NODE_ENV === 'production' ? `${import.meta.env.VITE_BACKEND_URL}/api/auth/me` : `/api/auth/me`}`, {method : 'GET', credentials : 'include'})
      data = await res.json();
      console.log(data)
      if(data.authenticated){
        // Authenticated
        console.log("User is authenticated")
        dispatch(setuserData(data.user))
        if(!protectedRoute){
          navigate("/")
        }else{
          setloading(false)
        }
      }else{
        // Not Authenticated
        console.log("User is not authenticated")
        if(protectedRoute){
          
          navigate("/login")
        }else{
          setloading(false)
        }
      }
    } catch (err) {
      console.log("Unable to fetch the user token information", err,data)

    }finally{
      setloading(false)
    }

  };
    checkAuth();
    
  },[navigate, protectedRoute])

  if(loading){
    return <div className='flex justify-center items-center min-h-screen'>
      <span className="loading loading-infinity loading-xl"></span>
    </div>
  }else{
    return children
  }
}

export default AuthCheck
