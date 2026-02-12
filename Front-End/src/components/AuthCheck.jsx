import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setuserData } from '../features/data/dataSlice'
import { motion } from 'motion/react'
import { Sparkles } from 'lucide-react'


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
      if(data.authenticated){
        console.log("User is authenticated")
        dispatch(setuserData(data.user))
        if(!protectedRoute){
          navigate("/")
        }else{
          setloading(false)
        }
      }else{
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
    return (
      <div className='flex flex-col gap-4 justify-center items-center min-h-screen bg-[#0a0f1a]'>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-blue-500"
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    )
  }else{
    return children
  }
}

export default AuthCheck
