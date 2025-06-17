import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Bounce } from "react-toastify";
import { RefreshCcw } from "lucide-react";
import { useDispatch } from "react-redux";
import { setuserData } from "../features/data/dataSlice";

const Tickets = () => {
  const [Tickets, setTickets] = useState([]);
  const [fetchLoading, setfetchLoading] = useState(false);
  const [loading, setloading] = useState(false);

  const dispatch = useDispatch()
  const navigate = useNavigate();


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  

  const fetchTickets = async () => {
    try {
      setfetchLoading(true);
      const res = await fetch("/api/tickets/", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setTickets(data.data);
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
      const res = await fetch("/api/tickets", {
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
        fetchTickets()
        reset();
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
        <div className="w-[50vw] ">
          <h2 className="text-xl md:text-2xl py-6">Create Ticket</h2>

          <form onSubmit={handleSubmit(submitTicket)}>
            <div className="flex flex-col gap-5">
              <div>
                <input
                  placeholder="Ticket Title"
                  className="w-full outline-none border border-gray-600 shadow-lg transition-all duration-500 focus:border-gray-400 rounded-md md:px-2 py-1 md:text-base text-sm"
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
                  className="w-full outline-none border border-gray-600 shadow-lg transition-all duration-500 focus:border-gray-400 rounded-md md:px-2 py-1 md:text-base text-sm"
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
              <div className="w-full text-start">
                <button
                  type="submit"
                  className="bg-blue-500 min-w-30 hover:bg-blue-600 p-2 px-4 rounded duration-300 text-white font-semibold"
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
          <div className="mt-5 mb-2 flex justify-between">
            <h2 className="text-xl">All Tickets</h2>
            {fetchLoading ? (
              <span className="loading loading-spinner loading-sm md:loading-lg"></span>
            ) : (
              <div onClick={() => fetchTickets()}>
                <RefreshCcw />
              </div>
            )}
          </div>
          <div className="h-[40vh] overflow-y-auto">
            {
              Tickets.length > 0 ? (
                Tickets.map((ticket) => (
              <div onClick={() => {navigate(`/ticket/${ticket._id}`)}}
                key={ticket._id}
                className="tickets hover:border border border-[#1A2433] duration-300 hover:border-gray-400 flex flex-col gap-1 bg-[#1A2433] w-full h-fit rounded-lg py-2 px-4 my-3"
              >
                <div>
                  <h2 >{ticket.title}</h2>
                </div>
                <div className="text-sm">
                  <p>{ticket.description}</p>
                </div>
                <div className="text-[12px] text-gray-400 mt-1">
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
                <h3>No Tickets to display</h3>
              </div>)
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default Tickets;
