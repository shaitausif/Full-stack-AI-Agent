import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setuserData } from "../features/data/dataSlice";
import { useForm } from "react-hook-form";
import { toast, Bounce } from "react-toastify";
import { useState } from "react";

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
      const res = await fetch("/api/auth/signup", {
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
    <div className="flex min-h-screen flex-col text-white justify-center items-center px-4 py-6 bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-center text-2xl font-semibold mb-2">Sign Up</h2>
        <p className="text-center text-sm mb-6">
          Already have an account?{" "}
          <Link className="text-blue-400 hover:underline" to="/login">
            Login
          </Link>
        </p>

        <form onSubmit={handleSubmit(handleSignUp)} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 rounded bg-gray-700 text-white"
              {...register("email", {
                required: "Email is required",
                minLength: { value: 5, message: "At least 5 characters" },
                maxLength: { value: 30, message: "Less than 30 characters" },
              })}
            />
            {errors.email && <span className="text-red-400 text-sm">{errors.email.message}</span>}
          </div>

          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              className="w-full p-2 rounded bg-gray-700 text-white"
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
            <label className="block mb-1">Skills (comma separated)</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 text-white"
              {...register("skills")}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 w-30 hover:bg-blue-600 p-2 rounded duration-300 text-white font-semibold mt-2"
          >
            {loading ? (<span className="loading loading-spinner loading-sm md:loading-lg"></span>) : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
