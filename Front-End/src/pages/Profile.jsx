import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Bounce } from "react-toastify";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import { setuserData } from "../features/data/dataSlice";
import {
  User,
  Mail,
  Shield,
  Tag,
  Calendar,
  TicketIcon,
  Pencil,
  X,
  Check,
  Phone,
  MapPin,
  FileText,
} from "lucide-react";

const Profile = () => {
  const { user } = useSelector((state) => state.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ created: 0, assigned: 0, closed: 0 });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${
          import.meta.env.MODE === "production"
            ? `${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`
            : "/api/auth/profile"
        }`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
        setStats(data.stats || { created: 0, assigned: 0, closed: 0 });
        dispatch(setuserData(data.data));
      } else {
        toast.error(data.message || "Failed to load profile", {
          closeOnClick: true,
          autoClose: 3000,
          transition: Bounce,
        });
      }
    } catch (error) {
      console.log("Unable to fetch profile:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onSubmit = async (formData) => {
    try {
      setSaving(true);
      const res = await fetch(
        `${
          import.meta.env.MODE === "production"
            ? `${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`
            : "/api/auth/profile"
        }`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Profile updated successfully", {
          closeOnClick: true,
          autoClose: 3000,
          transition: Bounce,
        });
        setProfile(data.data);
        dispatch(setuserData(data.data));
        setEditing(false);
      } else {
        toast.warn(data.message || "Failed to update profile", {
          closeOnClick: true,
          autoClose: 3000,
          transition: Bounce,
        });
      }
    } catch (error) {
      console.log("Unable to update profile:", error.message);
      toast.error("Something went wrong", {
        closeOnClick: true,
        autoClose: 3000,
        transition: Bounce,
      });
    } finally {
      setSaving(false);
    }
  };

  const startEditing = () => {
    reset({
      name: profile?.name || "",
      phone: profile?.phone || "",
      location: profile?.location || "",
      bio: profile?.bio || "",
    });
    setEditing(true);
  };

  const getRoleBadge = (role) => {
    const map = {
      admin: "badge-red",
      moderator: "badge-yellow",
      user: "badge-blue",
    };
    return map[role] || "badge-blue";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] bg-grid flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="loading loading-spinner loading-lg text-blue-500"></span>
          <p className="text-sm text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] bg-grid">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Profile Header Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-strong rounded-2xl p-6 md:p-8 glow-blue mb-6 relative overflow-hidden"
        >
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500" />

          <div className="flex flex-col md:flex-row items-start gap-5">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", damping: 12 }}
              className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl md:text-3xl font-bold shadow-lg shadow-blue-500/20 flex-shrink-0"
            >
              {(profile?.name || profile?.email || "?")
                .charAt(0)
                .toUpperCase()}
            </motion.div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-white">
                    {profile?.name || "No name set"}
                  </h1>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-sm text-gray-400">
                      {profile?.email}
                    </span>
                  </div>
                </div>

                {/* Edit Toggle */}
                {!editing ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startEditing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-sm cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Edit</span>
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEditing(false)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors text-sm cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Cancel</span>
                  </motion.button>
                )}
              </div>

              {/* Role & Joined */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {profile?.role && (
                  <span className={`badge ${getRoleBadge(profile.role)}`}>
                    <Shield className="w-3 h-3" />
                    {profile.role}
                  </span>
                )}
                {profile?.createdAt && (
                  <span className="flex items-center gap-1 text-[11px] text-gray-600">
                    <Calendar className="w-3 h-3" />
                    Joined{" "}
                    {new Date(profile.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          {[
            {
              label: "Created",
              value: stats.created,
              color: "from-blue-500/20 to-blue-600/20 border-blue-500/20",
              textColor: "text-blue-400",
            },
            {
              label: "Assigned",
              value: stats.assigned,
              color: "from-purple-500/20 to-purple-600/20 border-purple-500/20",
              textColor: "text-purple-400",
            },
            {
              label: "Closed",
              value: stats.closed,
              color: "from-green-500/20 to-green-600/20 border-green-500/20",
              textColor: "text-green-400",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className={`rounded-xl bg-gradient-to-br ${stat.color} border p-4 text-center`}
            >
              <p className={`text-2xl font-bold ${stat.textColor}`}>
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Profile Details / Edit Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-strong rounded-2xl p-5 md:p-8"
        >
          <AnimatePresence mode="wait">
            {editing ? (
              /* ── Edit Form ── */
              <motion.form
                key="edit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5"
              >
                <h3 className="text-base font-semibold text-gray-200 mb-1">
                  Edit Profile
                </h3>

                {/* Name */}
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1.5 block">
                    Full Name
                  </label>
                  <input
                    className="input-modern"
                    placeholder="Your full name"
                    {...register("name", {
                      required: { value: true, message: "Name is required" },
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                      maxLength: {
                        value: 50,
                        message: "Name must be under 50 characters",
                      },
                    })}
                  />
                  {errors.name && (
                    <span className="text-red-400 text-xs mt-1 block">
                      {errors.name.message}
                    </span>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1.5 block">
                    Phone
                  </label>
                  <input
                    className="input-modern"
                    type="tel"
                    placeholder="Your phone number"
                    {...register("phone", {
                      maxLength: {
                        value: 20,
                        message: "Phone must be under 20 characters",
                      },
                    })}
                  />
                  {errors.phone && (
                    <span className="text-red-400 text-xs mt-1 block">
                      {errors.phone.message}
                    </span>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1.5 block">
                    Location
                  </label>
                  <input
                    className="input-modern"
                    placeholder="City, Country"
                    {...register("location", {
                      maxLength: {
                        value: 100,
                        message: "Location must be under 100 characters",
                      },
                    })}
                  />
                  {errors.location && (
                    <span className="text-red-400 text-xs mt-1 block">
                      {errors.location.message}
                    </span>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1.5 block">
                    Bio
                  </label>
                  <textarea
                    className="input-modern !rounded-xl resize-none"
                    placeholder="Write a short bio about yourself..."
                    rows={3}
                    {...register("bio", {
                      maxLength: {
                        value: 300,
                        message: "Bio must be under 300 characters",
                      },
                    })}
                  />
                  {errors.bio && (
                    <span className="text-red-400 text-xs mt-1 block">
                      {errors.bio.message}
                    </span>
                  )}
                </div>

                {/* Submit */}
                <div className="flex justify-end">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={saving}
                    className="btn-primary flex items-center gap-2 !text-sm"
                  >
                    {saving ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      <>
                        <Check className="w-4 h-4 relative z-10" />
                        <span className="relative z-10">Save Changes</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.form>
            ) : (
              /* ── Profile Info View ── */
              <motion.div
                key="view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {/* Name */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                      Full Name
                    </p>
                    <p className="text-sm text-gray-300">
                      {profile?.name || "Not set"}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                      Email
                    </p>
                    <p className="text-sm text-gray-300">{profile?.email}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                      Phone
                    </p>
                    <p className="text-sm text-gray-300">
                      {profile?.phone || "Not set"}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                      Location
                    </p>
                    <p className="text-sm text-gray-300">
                      {profile?.location || "Not set"}
                    </p>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <Tag className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                      Skills
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {profile?.skills?.length > 0 ? (
                        profile.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="badge badge-purple !text-[10px]"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-600">None</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                      Bio
                    </p>
                    <p className="text-sm text-gray-300">
                      {profile?.bio || "Not set"}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
