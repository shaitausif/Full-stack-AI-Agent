import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, Bounce } from "react-toastify";
import { motion } from "motion/react";
import { Mail, ArrowRight, Sparkles, KeyRound } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || email.length < 5) {
      toast.error("Please enter a valid email", {
        closeOnClick: true,
        autoClose: 3000,
        transition: Bounce,
      });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${
          import.meta.env.MODE === "production"
            ? `${import.meta.env.VITE_BACKEND_URL}/api/auth/forgot-password`
            : "/api/auth/forgot-password"
        }`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email }),
        }
      );
      await res.json();
      // Always navigate to OTP page regardless of response (prevents user enumeration)
      toast.success(
        "If an account with that email exists, a password reset OTP has been sent.",
        { closeOnClick: true, autoClose: 5000, transition: Bounce }
      );
      navigate("/verify-otp", { state: { email } });
    } catch (error) {
      // Still navigate to prevent enumeration
      toast.success(
        "If an account with that email exists, a password reset OTP has been sent.",
        { closeOnClick: true, autoClose: 5000, transition: Bounce }
      );
      navigate("/verify-otp", { state: { email } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col text-white justify-center items-center px-4 bg-[#0a0f1a] bg-grid overflow-hidden">
      {/* Animated background orbs */}
      <motion.div
        className="absolute top-1/4 -left-32 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Logo */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex items-center gap-2 mb-6"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full" />

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, delay: 0.2 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20 flex items-center justify-center"
          >
            <KeyRound className="w-7 h-7 text-purple-400" />
          </motion.div>
        </div>

        <h2 className="text-center text-xl md:text-2xl font-bold mb-1">
          Forgot your password?
        </h2>
        <p className="text-center text-sm text-gray-400 mb-6">
          Enter your email and we&apos;ll send you a 6-digit OTP to reset your
          password.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-modern !pl-10"
              />
            </div>
          </motion.div>

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
                <span>Send OTP</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Remember your password?{" "}
          <Link
            className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            to="/login"
          >
            Back to login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
