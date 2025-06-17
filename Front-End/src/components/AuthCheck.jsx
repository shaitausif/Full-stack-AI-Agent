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
    try {
      const res = await fetch(`/api/auth/me`, {method : 'GET', credentials : 'include'})
      const data = await res.json();
      if(data.authenticated){
        // Authenticated
        dispatch(setuserData(data.user))
        if(!protectedRoute){
          navigate("/")
        }else{
          setloading(false)
        }
      }else{
        // Not Authenticated
        if(protectedRoute){
          
          navigate("/login")
        }else{
          setloading(false)
        }
      }
    } catch (err) {
      console.log("Unable to fetch the user token information", err)

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
