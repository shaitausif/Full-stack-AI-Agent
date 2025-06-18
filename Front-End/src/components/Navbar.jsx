import { useSelector } from "react-redux"
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Bounce } from "react-toastify";


const Navbar = () => {


    const user = useSelector((state) => state?.data.user)
    const navigate = useNavigate()
    const [loading, setloading] = useState(false)

    const handleLogout = async () => {
    try {
        setloading(true)
        let res = await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();
        if (data?.success) {
          toast.success("Logout Successfully", { closeOnClick: true, autoClose: 3000, transition: Bounce });
          navigate("/login");
        }else{
            toast.error(data.message)
        }
    } catch (error) {
        console.log("Unable to logout the user", error.message)
    }finally{
        setloading(false)
    }
  };

  return (
    <div className='flex items-center md:py-5 py-3 bg-gray-800  justify-between md:px-15 px-4'>
      <div>
        <h1 onClick={() => navigate('/')} className='md:text-2xl text-lg cursor-pointer'>Ticket AI</h1>
      </div>
      <div className="flex items-center md:gap-6 gap-3">
        <h2 className="cursor-pointer md:block hidden">Hi, {user.email}</h2>
        {user.role === 'admin' ? (<button onClick={() => navigate('/admin')} className="cursor-pointer  text-sm md:text-base hover:text-gray-300 duration-500"><h2 >Admin</h2></button>) : ""}
        <button className="cursor-pointer  text-sm md:text-base bg-blue-500 md:px-4 md:py-2 px-3 py-1.5  hover:bg-blue-600  rounded duration-300 text-white font-semibold" onClick={handleLogout}>{loading ? (<span className="loading loading-spinner loading-sm md:loading-lg"></span>) : "Logout"}</button>
      </div>
    </div>
  )
}

export default Navbar
