import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { Bounce } from "react-toastify";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Shield,
  Users,
  Pencil,
  X,
  Check,
  Mail,
  Tag,
  UserCog,
} from "lucide-react";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isEditing, setisEditing] = useState({});
  const [fetchLoading, setfetchLoading] = useState(false);

  const toggleEdit = (userId) => {
    setisEditing((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const debounced = useDebounceCallback(setDebouncedSearch, 1000);

  const searchUsers = async () => {
    try {
      if (debouncedSearch.trim() === "") {
        fetchUsers();
        return;
      }

      const res = await fetch(
        `${
          import.meta.env.NODE_ENV === "production"
            ? `${import.meta.env.VITE_BACKEND_URL}/api/auth/search/${debouncedSearch}`
            : `/api/auth/search/${debouncedSearch}`
        }`
      );
      const data = await res.json();

      if (data.success) {
        setUsers(data.data);
      } else {
        toast.error(data.message, {
          closeOnClick: true,
          autoClose: 3000,
          transition: Bounce,
        });
      }
    } catch (error) {
      console.log("Unable to search the User:", error.message);
    }
  };

  useEffect(() => {
    searchUsers();
  }, [debouncedSearch]);

  const fetchUsers = async () => {
    try {
      setfetchLoading(true);
      const res = await fetch(
        `${
          import.meta.env.NODE_ENV === "production"
            ? `${import.meta.env.VITE_BACKEND_URL}/api/auth/users`
            : "/api/auth/users"
        }`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        toast.error("Unable to fetch the users", {
          closeOnClick: true,
          autoClose: 3000,
          transition: Bounce,
        });
      }
    } catch (error) {
      console.log("Unable to fetch users Info: ", error.message);
    } finally {
      setfetchLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const updateUser = async (dataa, email) => {
    try {
      const arr = dataa.skills?.split(",");
      const dataaa = { role: dataa.role, skills: arr, email: email };
      
      const res = await fetch(
        `${
          import.meta.env.NODE_ENV === "production"
            ? `${import.meta.env.VITE_BACKEND_URL}/api/auth/update-user`
            : "/api/auth/update-user"
        }`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...dataaa }),
        }
      );
      const data = await res.json();
      if (data.success) {
        fetchUsers();
      } else {
        toast.error(data.message, {
          closeOnClick: true,
          autoClose: 3000,
          transition: Bounce,
        });
      }
    } catch (error) {
      console.log("Unable to update the User", error.message);
    }
  };

  const getRoleBadge = (role) => {
    const map = {
      admin: "badge-red",
      moderator: "badge-yellow",
      user: "badge-blue",
    };
    return map[role] || "badge-blue";
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] bg-grid">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-red-500/20 flex items-center justify-center border border-purple-500/20">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Admin Panel</h1>
              <p className="text-xs text-gray-500">Manage users and permissions</p>
            </div>
            {users.length > 0 && (
              <span className="badge badge-purple ml-auto">
                <Users className="w-3 h-3" />
                {users.length} users
              </span>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              placeholder="Search users by email..."
              className="input-modern !pl-11 !py-3"
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                debounced(e.target.value);
              }}
            />
          </div>
        </motion.div>

        {/* Users List */}
        <div className="flex flex-col gap-3">
          {fetchLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <span className="loading loading-spinner loading-lg text-blue-500"></span>
              <p className="text-sm text-gray-500 mt-3">Loading users...</p>
            </div>
          ) : (
            <AnimatePresence>
              {users.map((user, index) => (
                <motion.div
                  key={user._id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="card-modern p-4 md:p-5"
                >
                  <form
                    onSubmit={handleSubmit((data) =>
                      updateUser(data, user.email)
                    )}
                  >
                    <div className="flex flex-col gap-3">
                      {/* Email Row */}
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        <span className="text-sm md:text-base text-gray-200 truncate">
                          {user.email}
                        </span>
                      </div>

                      {/* Role Row */}
                      <div className="flex items-center gap-2">
                        <UserCog className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mr-1">
                          Role:
                        </span>
                        {isEditing[user._id] ? (
                          <select
                            className="input-modern !py-1 !px-2 !text-sm !w-auto !rounded-lg"
                            {...register("role")}
                          >
                            <option value="admin">admin</option>
                            <option value="moderator">moderator</option>
                            <option value="user">user</option>
                          </select>
                        ) : (
                          <span className={`badge ${getRoleBadge(user.role)}`}>
                            {user.role}
                          </span>
                        )}
                      </div>

                      {/* Skills Row */}
                      <div className="flex items-start gap-2">
                        <Tag className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mr-1">
                          Skills:
                        </span>
                        {isEditing[user._id] ? (
                          <input
                            className="input-modern !py-1 !px-2 !text-sm flex-1 !rounded-lg"
                            defaultValue={
                              Array.isArray(user.skills)
                                ? user.skills.join(", ")
                                : user.skills
                            }
                            type="text"
                            {...register("skills")}
                          />
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {user.skills.length >= 1 &&
                            user.skills[0] !== "" ? (
                              user.skills.map((skill, i) => (
                                <span
                                  key={i}
                                  className="badge badge-purple !text-[10px]"
                                >
                                  {skill.trim()}
                                </span>
                              ))
                            ) : (
                              <span className="text-sm text-gray-600">N/A</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 mt-1 pt-3 border-t border-white/5">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => toggleEdit(user._id)}
                          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                            isEditing[user._id]
                              ? "btn-danger !py-1.5 !px-3 !text-xs"
                              : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          {isEditing[user._id] ? (
                            <>
                              <X className="w-3 h-3" />
                              Cancel
                            </>
                          ) : (
                            <>
                              <Pencil className="w-3 h-3" />
                              Edit
                            </>
                          )}
                        </motion.button>

                        {isEditing[user._id] && (
                          <motion.button
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            type="submit"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => {
                              setTimeout(() => {
                                toggleEdit(user._id);
                              }, 100);
                            }}
                            className="btn-success !py-1.5 !px-3 !text-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                            Save
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </form>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
