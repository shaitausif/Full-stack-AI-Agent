import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setuserData } from "../features/data/dataSlice";
import { useForm } from "react-hook-form";
import { toast, Bounce } from "react-toastify";
import { useState } from "react";
import {motion, scale} from 'motion/react'

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset
  } = useForm();

  const handleSignUp = async (formData) => {
    setloading(true);
    try {

      const arr = formData.skills?.split(",")  
      const dataa = {
        email : formData.email,
        password : formData.password,
        skills : arr
      }
      const res = await fetch(`${import.meta.env.NODE_ENV === 'production' ? `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup` : '/api/auth/signup' }`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataa),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Signed up Successfully", { closeOnClick: true, autoClose: 3000, transition: Bounce });
        dispatch(setuserData(data.data.user));
        reset();
        navigate("/");

      } else {
        console.log(data)
        toast.error(data.message || "Signup Failed", { closeOnClick: true ,autoClose: 3000, transition: Bounce });
      }
    } catch (error) {
      console.log("Unable to signup the user", error);
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col text-white justify-center items-center px-4 bg-gray-900">
      <motion.div
            initial={{
        x: -200,
        opacity : 0
      }}
      animate={{
        x : 0, y: 0, opacity : 1,
        rotateY : 360
      }}
      whileTap={{scale : 1.1}}
      transition={{duration : 0.8, ease: "backOut", stiffness : 200 , bounce:  100}}
      
      className="w-full max-w-md bg-gray-800 px-5 py-4 md:p-6 rounded-lg shadow-md">
        <h2 className="text-center md:text-2xl text-lg font-semibold mb-1 md:mb-2">Sign Up</h2>
        <p className="text-center md:text-sm text-[12px] mb-2 md:mb-6">
          Already have an account?{" "}
          <Link className="text-blue-400 hover:underline" to="/login">
            Login
          </Link>
        </p>

        <form onSubmit={handleSubmit(handleSignUp)} className="flex flex-col gap-3 md:gap-4">
          <div>
            <label className="block mb-1 md:text-base text-sm">Email</label>
            <input
              type="email"
              className="w-full outline-none border border-gray-600 shadow-lg transition-all duration-500 focus:border-gray-400 rounded-md px-2 py-1 md:py-2 md:text-base text-sm"
              {...register("email", {
                required: "Email is required",
                minLength: { value: 5, message: "At least 5 characters" },
                maxLength: { value: 30, message: "Less than 30 characters" },
              })}
            />
            {errors.email && <span className="text-red-400 text-sm">{errors.email.message}</span>}
          </div>

          <div>
            <label className="block mb-1 md:text-base text-sm">Password</label>
            <input
              type="password"
              className="w-full outline-none border border-gray-600 shadow-lg transition-all duration-500 focus:border-gray-400 rounded-md px-2 py-1 md:py-2 md:text-base text-sm"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "At least 8 characters" },
                maxLength: { value: 20, message: "Less than 20 characters" },
              })}
            />
            {errors.password && (
              <span className="text-red-400 text-sm">{errors.password.message}</span>
            )}
          </div>

          <div>
            <label className="block mb-1 md:text-base text-sm">Skills (comma separated)</label>
            <input
              type="text"
              className="w-full outline-none border border-gray-600 shadow-lg transition-all duration-500 focus:border-gray-400 rounded-md px-2 py-1 md:py-2 md:text-base text-sm"
              {...register("skills")}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 w-fit mx-auto md:text-base text-sm hover:bg-blue-600 md:px-5 md:py-2 px-3 py-1.5 rounded duration-300 text-white font-semibold mt-1 md:mt-2"
          >
            {loading ? (<span className="loading loading-spinner loading-sm md:loading-lg"></span>) : "Sign Up"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default SignUp;
