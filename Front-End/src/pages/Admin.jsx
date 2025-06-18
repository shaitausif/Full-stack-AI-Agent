import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { Bounce } from "react-toastify";

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

  // Create debounced callback to update debouncedSearch after delay
  const debounced = useDebounceCallback(setDebouncedSearch, 1000);

  const searchUsers = async () => {
    try {
      if (debouncedSearch.trim() === "") {
        fetchUsers();
        return;
      }

      const res = await fetch(`/api/auth/search/${debouncedSearch}`);
      const data = await res.json();

      if (data.success) {
        setUsers(data.data);
      } else {
        toast.error(data.message, { closeOnClick: true, autoClose: 3000, transition: Bounce });
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
      const res = await fetch("/api/auth/users", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        toast.error("Unable to fetch the users", { closeOnClick: true, autoClose: 3000, transition: Bounce });
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
      console.log(dataaa);
      const res = await fetch("/api/auth/update-user", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...dataaa }),
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
      } else {
        toast.error(data.message, { closeOnClick: true, autoClose: 3000, transition: Bounce });
      }
    } catch (error) {
      console.log("Unable to update the User", error.message);
    }
  };

  return (
    <div className="flex w-full min-h-screen flex-col gap-6 items-center mx-auto py-6">
      <div className="mx-4 md:mx-auto  md:w-[50vw]">
        <div className="flex flex-col justify-between gap-3 md:gap-5">
          <h2 className="md:text-2xl text-md font-semibold">
            Admin Panel - Manage Users
          </h2>
          <input
            placeholder="Search by Email"
            className="w-full outline-none border border-gray-600 shadow-lg transition-all duration-500 focus:border-gray-400 rounded-md px-2 py-1 md:text-base text-sm"
            type="text"
            required
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              debounced(e.target.value); // debounce API trigger, not UI
            }}
          />
        </div>
        {/* Users data */}
        <div className="flex flex-col md:gap-4 gap-2 w-full md:my-5 my-3 rounded-md">
          {fetchLoading ? (
            <div className="flex justify-center items-center w-full h-[30vh]">
              <span className="loading loading-spinner loading-sm md:loading-xl"></span>
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                className="flex flex-col gap-1 md:px-4 border border-[#1A2433] duration-300  hover:border-gray-400 rounded-lg bg-[#1A2433] px-2 md:py-5 py-3"
              >
                <form
                  onSubmit={handleSubmit((data) =>
                    updateUser(data, user.email)
                  )}
                >
                  <h3>
                    <span className="font-semibold">Email: </span>
                    {user.email}
                  </h3>

                  <h3>
                    <span className="font-semibold">Current Role: </span>
                    {isEditing[user._id] ? (
                      <select className="bg-[#1A2433]" {...register("role")}>
                        <option value="admin">admin</option>
                        <option value="moderator">moderator</option>
                        <option value="user">user</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </h3>
                  <h3>
                    <span className="font-semibold">Skills: </span>
                    {isEditing[user._id] ? (
                      <input
                        className=" outline px-2"
                        defaultValue={
                          Array.isArray(user.skills)
                            ? user.skills.join(", ")  
                            : user.skills
                        }
                        type="text"
                        {...register("skills")}
                      />
                    ) : user.skills.length >= 1 && user.skills[0] !== "" ? (
                      user.skills
                    ) : (
                      "N/A"
                    )}
                  </h3>
                  <button
                    type="button"
                    onClick={() => toggleEdit(user._id)}
                    className={`text-start w-fit cursor-pointe ${
                      isEditing[user._id]
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    } md:px-5 px-4 md:py-2 py-1 hover:bg-blue-600  rounded duration-300 text-white font-semibold mt-2 md:mt-3 mr-3`}
                  >
                    {isEditing[user._id] ? "Cancel" : "Edit"}
                  </button>
                  {isEditing[user._id] && (
                    <button
                      type="submit"
                      onClick={() => {
                        setTimeout(() => {
                          toggleEdit(user._id);
                        }, 100);
                      }}
                      className="text-start w-fit cursor-pointer bg-green-600 hover:bg-green-700 md:px-5 px-4 md:py-2 py-1 rounded duration-300 text-white font-semibold mt-2 md:mt-3 "
                    >
                      Save
                    </button>
                  )}
                </form>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
