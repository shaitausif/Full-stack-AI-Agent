import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Bounce } from "react-toastify";
import { motion } from "motion/react";
import { LogOut, Shield, Sparkles, User } from "lucide-react";

const Navbar = () => {
  const user = useSelector((state) => state?.data.user);
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);

  const handleLogout = async () => {
    try {
      setloading(true);
      let res = await fetch(
        `${
          import.meta.env.MODE === "production"
            ? `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`
            : "/api/auth/logout"
        }`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data?.success) {
        toast.success("Logout Successfully", {
          closeOnClick: true,
          autoClose: 3000,
          transition: Bounce,
        });
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Unable to logout the user", error);
    } finally {
      setloading(false);
    }
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glass-strong sticky top-0 z-50 border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-3 md:py-4">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg md:text-xl font-bold gradient-text">
            Ticket AI
          </h1>
        </motion.div>

        {/* Right Section */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* User Info */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/8">
            <User className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-sm text-gray-300 max-w-[180px] truncate">
              {user.email}
            </span>
          </div>

          {/* Admin Button */}
          {user.role === "admin" && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/admin")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 hover:bg-purple-500/20 transition-colors text-sm font-medium"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </motion.button>
          )}

          {/* Profile Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/profile")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 hover:bg-blue-500/20 transition-colors text-sm font-medium cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Profile</span>
          </motion.button>

          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 btn-primary !py-2 !px-4 text-sm"
            onClick={handleLogout}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
