import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setuserData } from "../features/data/dataSlice";
import { useForm } from "react-hook-form";
import { toast, Bounce } from "react-toastify";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset
  } = useForm();

  const handleLogin = async (formData) => {
    setloading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Logged in Successfully", { closeOnClick: true, autoClose: 3000, transition: Bounce });
        dispatch(setuserData(data.data.user));
        reset();
        navigate("/");

      } else {
        toast.error(data.message || "Login Failed", { closeOnClick: true ,autoClose: 3000, transition: Bounce });
      }
    } catch (error) {
      console.log("Unable to Login the user", error);
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col text-white justify-center items-center px-4 bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 px-5 py-4 md:p-6 rounded-lg shadow-md">
        <h2 className="text-center md:text-2xl text-lg font-semibold mb-1 md:mb-2">Login</h2>
        <p className="text-center md:text-sm text-[12px] mb-2 md:mb-6">
          Don't have an account?{" "}
          <Link className="text-blue-400 hover:underline" to="/signup">
            Sign up
          </Link>
        </p>

        <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              className="w-full outline-none border border-gray-600 shadow-lg transition-all duration-500 focus:border-gray-400 rounded-md px-2 py-1 md:py-2 md:text-base text-sm"
              {...register("email", {
                required: "Email is required",
                minLength: { value: 5, message: "At least 5 characters" },
                maxLength: { value: 30, message: "Less than 30 characters" },
              })}
            />
            {errors.email && <span className="text-red-400 md:text-sm text-[12px]">{errors.email.message}</span>}
          </div>

          <div>
            <label className="block mb-1">Password</label>
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
              <span className="text-red-400 md:text-sm text-[12px]">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 w-fit mx-auto md:text-base text-sm hover:bg-blue-600 md:px-5 md:py-2 px-3 py-1.5 rounded duration-300 text-white font-semibold mt-1 md:mt-2"
          >
            {loading ? (<span className="loading loading-spinner loading-sm md:loading-lg"></span>) : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
