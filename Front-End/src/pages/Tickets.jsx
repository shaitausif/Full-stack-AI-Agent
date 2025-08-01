import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Bounce } from "react-toastify";
import { RefreshCcw } from "lucide-react";
import { useSelector } from "react-redux";

const Tickets = () => {
  const [Tickets, setTickets] = useState([]);
  const [fetchLoading, setfetchLoading] = useState(false);
  const [loading, setloading] = useState(false);
  const [searchID, setsearchID] = useState("")
  const [onlyAssignedTickets, setonlyAssignedTickets] = useState(false)

  const navigate = useNavigate();
  const {user} = useSelector((state) => state.data)
  console.log(user)

  // In your Tickets component

// 1. A useEffect to READ from localStorage ONCE on mount
useEffect(() => {
  const storedValue = localStorage.getItem("assigned");
  // localStorage stores strings, so compare to "true"
  if (storedValue === "true") {
    setonlyAssignedTickets(true);
  }
}, []); // Empty array `[]` means this runs only on mount

// 2. A useEffect to WRITE to localStorage whenever the state changes
useEffect(() => {
  localStorage.setItem("assigned", onlyAssignedTickets);
}, [onlyAssignedTickets]); // This runs whenever `onlyAssignedTickets` changes

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  

  const fetchTickets = async () => {
    try {
      setfetchLoading(true);
      const res = await fetch(`${import.meta.env.NODE_ENV === 'production' ? `${import.meta.env.VITE_BACKEND_URL}/api/tickets` : '/api/tickets' }`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setTickets(data.data);
     setTimeout(() => {
       console.log(data.data)
     }, 3000);
    } catch (error) {
      console.log("Unable to fetch the ticket data");
    } finally {
      setfetchLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    
  }, []);

  const submitTicket = async (data) => {
    try {
      setloading(true);
      const res = await fetch(`${import.meta.env.NODE_ENV === 'production' ? `${import.meta.env.VITE_BACKEND_URL}/api/tickets` : '/api/tickets' }`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success("Ticket Created Successfully", {
          closeOnClick: true,
          autoClose: 3000,
          transition: Bounce,
        });
        reset();
        setTimeout(() => {
          fetchTickets()
        }, 10000);
        
      } else {
        toast.warn("Ticket Creation Failed", {
          closeOnClick: true,
          autoClose: 3000,
          transition: Bounce,
        });
      }
    } catch (error) {
      console.log("Unable to submit the ticket", error.message);
    } finally {
      setloading(false);
    }
  };

  

  return (
    <>
      <div className="flex w-full min-h-screen flex-col gap-6 items-center mx-auto">
        <div className="md:w-[50vw] w-[90%] mx-4 md:mx-auto">
          <h2 className="text-lg md:text-2xl py-3 md:py-6 md:text-start text-center">Create Ticket</h2>

          <form onSubmit={handleSubmit(submitTicket)}>
            <div className="flex flex-col gap-5">
              <div>
                <input
                  placeholder="Ticket Title"
                  className="w-full outline-none border border-gray-600 shadow-lg transition-all duration-500 focus:border-gray-400 rounded-md px-2 py-1 md:text-base text-sm"
                  type="text"
                  {...register("title", {
                    minLength: {
                      value: 10,
                      message: "Title must be greater than 10 characters",
                    },
                    maxLength: {
                      value: 100,
                      message: "Title should be less than 100 characters",
                    },
                    required: { value: true, message: "Title is required" },
                  })}
                />
                {errors.title && (
                  <span className="text-red-400 text-sm">
                    {errors.title.message}
                  </span>
                )}
              </div>
              <div>
                <textarea
                  placeholder="Ticket Description"
                  className="w-full outline-none border border-gray-600 shadow-lg transition-all duration-500 focus:border-gray-400 rounded-md px-2 py-1 md:text-base text-sm"
                  {...register("description", {
                    minLength: {
                      value: 30,
                      message: "Description must be atleast 30 characters",
                    },
                    required: {
                      value: true,
                      message: "Description is required",
                    },
                  })}
                ></textarea>
                {errors.description && (
                  <span className="text-red-400 text-sm">
                    {errors.description.message}
                  </span>
                )}
              </div>
              <div className="w-full text-center md:text-start">
                <button
                  type="submit"
                  className="bg-blue-500 w-fit mx-auto md:text-base text-sm hover:bg-blue-600 md:px-5 md:py-2 px-3 py-1.5 rounded duration-300 text-white font-semibold"
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm md:loading-lg"></span>
                  ) : (
                    "Submit Ticket"
                  )}
                </button>
              </div>
            </div>
          </form>
          {/* <div className='w-full h-[1px] bg-gray-500 hover:bg-gray-400 my-8 shadow-2xl rounded-full'></div> */}
          {/* show all the tickets */}
          <div className="mt-5 mb-2 flex items-center justify-between">
            <h2 className="text-lg md:text-xl items-center gap-5 flex">
              <p>All Tickets</p>
              <div className="flex gap-2 justify-center items-center">
                <input checked={onlyAssignedTickets}  onChange={() => {
                  setonlyAssignedTickets((prev) => !prev)
                }} type="checkbox" value="synthwave" className="toggle theme-controller" />
              <p className={`text-base ${onlyAssignedTickets ? "text-gray-300" : "text-gray-400"}`}>Only Assigned</p>
              </div>
            </h2>
                  
               
            {fetchLoading ? (
              <span className="loading loading-spinner loading-sm md:loading-lg"></span>
            ) : (
              <div className="flex gap-2 justify-center items-center w-fit">
               <input placeholder="Enter Ticket ID"

                className="w-full outline-none border border-gray-600 shadow-lg transition-all duration-500 focus:border-gray-400 rounded-md px-2 md:text-base text-sm"
                
                type="text" onChange={(e) => {
                  setsearchID(e.target.value)

                }} />
                <RefreshCcw onClick={() => fetchTickets()}/>
              </div>
            )}
          </div>
          <div className="md:h-[40vh] h-[50vh] overflow-y-auto">
            {
          
                Tickets?.length > 0 ? (                
                Tickets.filter((ticket) => searchID.trim() == "" ?  true : ticket._id.toString().includes(searchID.trim()))
                .filter((ticket) => {
                    // If the box is not checked, show all tickets
  if (!onlyAssignedTickets) {
    return true;
  }
  // If the box IS checked, only filter if the user exists
  // and the assignedTo ID matches the user's ID.
  return user && ticket.assignedTo?._id === user._id;
                })
                .map((ticket) => (
              <div onClick={() => {
                navigate(`/ticket/${ticket._id}`)}}
                key={ticket._id}
                className="tickets border border-[#1A2433] duration-300 hover:border-gray-400 flex flex-col gap-1 bg-[#1A2433] w-full h-fit rounded-lg py-2 px-3 md:px-4 my-2 md:my-3"
              >
                <div>
                  <h2 className="md:text-base text-[15px]">{ticket.title}</h2>
                </div>
                <div className="text-sm">
                  <p>{ticket.description}</p>
                  <p className="text-[13px] text-gray-400 pt-0.5">Ticket ID : {ticket._id}</p>
                </div>
                <div className="text-[12px] text-gray-400">
                  <p>
                    
                    {new Date(ticket.createdAt).toLocaleString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>
            ))
              ) : (<div className="flex justify-center w-full">
                <h3 className="text-[15px]">No Tickets to display</h3>
              </div>)
              
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default Tickets;
