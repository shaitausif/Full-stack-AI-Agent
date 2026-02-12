import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setuserData } from "../features/data/dataSlice";
import { useForm } from "react-hook-form";
import { toast, Bounce } from "react-toastify";
import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, Wrench, ArrowRight, Sparkles } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  const handleSignUp = async (formData) => {
    setloading(true);
    try {
      const arr = formData.skills?.split(",");
      const dataa = {
        email: formData.email,
        password: formData.password,
        skills: arr,
      };
      const res = await fetch(
        `${
          import.meta.env.NODE_ENV === "production"
            ? `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`
            : "/api/auth/signup"
        }`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(dataa),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Signed up Successfully", {
          closeOnClick: true,
          autoClose: 3000,
          transition: Bounce,
        });
        dispatch(setuserData(data.data.user));
        reset();
        navigate("/");
      } else {
        toast.error(data.message || "Signup Failed", {
          closeOnClick: true,
          autoClose: 3000,
          transition: Bounce,
        });
      }
    } catch (error) {
      console.log("Unable to signup the user", error);
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col text-white justify-center items-center px-4 bg-[#0a0f1a] bg-grid overflow-hidden">
      {/* Animated background orbs */}
      <motion.div
        className="absolute top-1/3 -right-32 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/3 -left-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Logo / Brand */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex items-center gap-2 mb-6"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-2xl font-bold gradient-text">Ticket AI</h1>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        className="w-full max-w-md glass-strong rounded-2xl p-6 md:p-8 glow-purple relative"
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full" />

        <h2 className="text-center text-xl md:text-2xl font-bold mb-1">
          Create account
        </h2>
        <p className="text-center text-sm text-gray-400 mb-6">
          Already have an account?{" "}
          <Link
            className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            to="/login"
          >
            Login
          </Link>
        </p>

        <form
          onSubmit={handleSubmit(handleSignUp)}
          className="flex flex-col gap-4"
        >
          {/* Email */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                placeholder="you@example.com"
                className="input-modern !pl-10"
                {...register("email", {
                  required: "Email is required",
                  minLength: { value: 5, message: "At least 5 characters" },
                  maxLength: { value: 30, message: "Less than 30 characters" },
                })}
              />
            </div>
            {errors.email && (
              <motion.span
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs mt-1 block"
              >
                {errors.email.message}
              </motion.span>
            )}
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                placeholder="••••••••"
                className="input-modern !pl-10"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "At least 8 characters" },
                  maxLength: { value: 20, message: "Less than 20 characters" },
                })}
              />
            </div>
            {errors.password && (
              <motion.span
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs mt-1 block"
              >
                {errors.password.message}
              </motion.span>
            )}
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Skills{" "}
              <span className="text-gray-500 font-normal">(comma separated)</span>
            </label>
            <div className="relative">
              <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="React, Node.js, Python..."
                className="input-modern !pl-10"
                {...register("skills")}
              />
            </div>
          </motion.div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary w-full mt-2 flex items-center justify-center gap-2 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                <span>Create account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-xs text-gray-600 mt-6"
      >
        Secured with enterprise-grade encryption
      </motion.p>
    </div>
  );
};

export default SignUp;
