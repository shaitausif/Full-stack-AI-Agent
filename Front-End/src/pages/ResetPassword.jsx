import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast, Bounce } from "react-toastify";
import { motion } from "motion/react";
import {
  Lock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Redirect if no email in state
  useEffect(() => {
    if (!email) {
      toast.warn("Please start the password reset process first.", {
        closeOnClick: true,
        autoClose: 3000,
        transition: Bounce,
      });
      navigate("/forgot-password", { replace: true });
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters", {
        closeOnClick: true,
        autoClose: 3000,
        transition: Bounce,
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", {
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
          import.meta.env.NODE_ENV === "production"
            ? `${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password`
            : "/api/auth/reset-password"
        }`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, newPassword }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        toast.success(
          data.message || "Password reset successfully!",
          { closeOnClick: true, autoClose: 3000, transition: Bounce }
        );
        // Redirect to login after short delay
        setTimeout(() => navigate("/login", { replace: true }), 3000);
      } else {
        // Handle specific error codes
        if (res.status === 403) {
          toast.error(data.message || "OTP not verified. Please verify your OTP first.", {
            closeOnClick: true,
            autoClose: 3000,
            transition: Bounce,
          });
          navigate("/verify-otp", { state: { email }, replace: true });
        } else if (
          data.message?.toLowerCase().includes("session expired") ||
          data.message?.toLowerCase().includes("request a new otp")
        ) {
          toast.error(data.message || "Session expired. Please request a new OTP.", {
            closeOnClick: true,
            autoClose: 3000,
            transition: Bounce,
          });
          navigate("/forgot-password", { replace: true });
        } else {
          toast.error(data.message || "Reset failed. Please try again.", {
            closeOnClick: true,
            autoClose: 3000,
            transition: Bounce,
          });
        }
      }
    } catch (error) {
    
      toast.error("Something went wrong", {
        closeOnClick: true,
        autoClose: 3000,
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!email) return null;

  return (
    <div className="relative flex min-h-screen flex-col text-white justify-center items-center px-4 bg-[#0a0f1a] bg-grid overflow-hidden">
      {/* Animated background orbs */}
      <motion.div
        className="absolute top-1/4 -left-32 w-72 h-72 bg-green-500/10 rounded-full blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"
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
        className="w-full max-w-md glass-strong rounded-2xl p-6 md:p-8 glow-blue relative"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-green-500 via-cyan-500 to-blue-500 rounded-full" />

        {success ? (
          /* Success state */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/20 to-cyan-500/20 border border-green-500/20 flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-8 h-8 text-green-400" />
            </motion.div>
            <h3 className="text-lg font-bold mb-2">Password Reset!</h3>
            <p className="text-sm text-gray-400 mb-6">
              Your password has been reset successfully. Redirecting you to
              login...
            </p>
            <Link
              to="/login"
              className="btn-primary inline-flex items-center gap-2 text-sm"
            >
              <span>Go to Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          /* Reset form */
          <>
            <div className="flex justify-center mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, delay: 0.2 }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-cyan-500/20 border border-green-500/20 flex items-center justify-center"
              >
                <ShieldCheck className="w-7 h-7 text-green-400" />
              </motion.div>
            </div>

            <h2 className="text-center text-xl md:text-2xl font-bold mb-1">
              Reset your password
            </h2>
            <p className="text-center text-sm text-gray-400 mb-6">
              Enter your new password below.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* New Password */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-modern !pl-10"
                  />
                </div>
                {newPassword && newPassword.length < 6 && (
                  <motion.span
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-yellow-400 text-xs mt-1 block"
                  >
                    Must be at least 6 characters
                  </motion.span>
                )}
              </motion.div>

              {/* Confirm Password */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-modern !pl-10"
                  />
                </div>
                {newPassword &&
                  confirmPassword &&
                  newPassword !== confirmPassword && (
                    <motion.span
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-xs mt-1 block"
                    >
                      Passwords do not match
                    </motion.span>
                  )}
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
                    <span>Reset Password</span>
                    <ShieldCheck className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;
