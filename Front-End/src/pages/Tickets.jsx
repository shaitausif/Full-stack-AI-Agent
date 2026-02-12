import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Bounce } from "react-toastify";
import {
  RefreshCcw,
  Plus,
  Search,
  TicketIcon,
  Clock,
  Filter,
  Send,
  User,
  Trash2,
} from "lucide-react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "motion/react";
import ConfirmModal from "../components/ConfirmModal";

const Tickets = () => {
  const [Tickets, setTickets] = useState([]);
  const [fetchLoading, setfetchLoading] = useState(false);
  const [loading, setloading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, ticketId: null });
  const [searchID, setsearchID] = useState("");
  const [onlyAssignedTickets, setonlyAssignedTickets] = useState(false);
  const [onlyMyTickets, setonlyMyTickets] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.data);

  useEffect(() => {
    const storedValue = localStorage.getItem("assigned");
    if (storedValue === "true") {
      setonlyAssignedTickets(true);
    }
    const storedMyTickets = localStorage.getItem("myTickets");
    if (storedMyTickets === "true") {
      setonlyMyTickets(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("assigned", onlyAssignedTickets);
  }, [onlyAssignedTickets]);

  useEffect(() => {
    localStorage.setItem("myTickets", onlyMyTickets);
  }, [onlyMyTickets]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const fetchTickets = async () => {
    try {
      setfetchLoading(true);
      const res = await fetch(
        `${
          import.meta.env.MODE === "production"
            ? `${import.meta.env.VITE_BACKEND_URL}/api/tickets`
            : "/api/tickets"
        }`,
        {
          method: "GET",
          credentials: "include",
        }
      );
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
      const res = await fetch(
        `${
          import.meta.env.MODE === "production"
            ? `${import.meta.env.VITE_BACKEND_URL}/api/tickets`
            : "/api/tickets"
        }`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );
      if (res.ok) {
        toast.success("Ticket Created Successfully", {
          closeOnClick: true,
          autoClose: 3000,
          transition: Bounce,
        });
        reset();
        setShowForm(false);
        setTimeout(() => {
          fetchTickets();
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

  const canDeleteTicket = (ticket) => {
    if (!user) return false;
    return user.role === "admin" || ticket.createdBy?._id === user._id;
  };

  const openDeleteModal = (e, ticketId) => {
    e.stopPropagation();
    setDeleteModal({ open: true, ticketId });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, ticketId: null });
  };

  const deleteTicket = async () => {
    const ticketId = deleteModal.ticketId;
    if (!ticketId) return;
    try {
      setDeletingId(ticketId);
      const res = await fetch(
        `${
          import.meta.env.MODE === "production"
            ? `${import.meta.env.VITE_BACKEND_URL}/api/tickets/${ticketId}`
            : `/api/tickets/${ticketId}`
        }`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Ticket deleted successfully", {
          closeOnClick: true,
          autoClose: 3000,
          transition: Bounce,
        });
        setTickets((prev) => prev.filter((t) => t._id !== ticketId));
      } else {
        toast.warn(data.message || "Failed to delete ticket", {
          closeOnClick: true,
          autoClose: 3000,
          transition: Bounce,
        });
      }
    } catch (error) {
      console.log("Unable to delete the ticket", error.message);
      toast.error("Something went wrong", {
        closeOnClick: true,
        autoClose: 3000,
        transition: Bounce,
      });
    } finally {
      setDeletingId(null);
      closeDeleteModal();
    }
  };

  const filteredTickets = Tickets?.filter((ticket) =>
    searchID.trim() === ""
      ? true
      : ticket._id.toString().includes(searchID.trim())
  ).filter((ticket) => {
    if (!onlyAssignedTickets) return true;
    return user && ticket.assignedTo?._id === user._id;
  }).filter((ticket) => {
    if (!onlyMyTickets) return true;
    return user && ticket.createdBy?._id === user._id;
  });

  return (
    <div className="min-h-screen bg-[#0a0f1a] bg-grid">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Create Ticket Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Toggle Create Form Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setShowForm(!showForm)}
            className="w-full flex items-center justify-between glass rounded-xl px-4 py-3 md:px-6 md:py-4 mb-4 cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/20">
                <Plus className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-sm md:text-base font-medium text-gray-300 group-hover:text-white transition-colors">
                Create new ticket
              </span>
            </div>
            <motion.div
              animate={{ rotate: showForm ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Plus className="w-5 h-5 text-gray-500" />
            </motion.div>
          </motion.button>

          {/* Collapsible Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="glass-strong rounded-xl p-4 md:p-6 mb-6 glow-blue">
                  <form onSubmit={handleSubmit(submitTicket)}>
                    <div className="flex flex-col gap-4">
                      <div>
                        <input
                          placeholder="Ticket Title"
                          className="input-modern"
                          type="text"
                          {...register("title", {
                            minLength: {
                              value: 10,
                              message:
                                "Title must be greater than 10 characters",
                            },
                            maxLength: {
                              value: 100,
                              message:
                                "Title should be less than 100 characters",
                            },
                            required: {
                              value: true,
                              message: "Title is required",
                            },
                          })}
                        />
                        {errors.title && (
                          <span className="text-red-400 text-xs mt-1 block">
                            {errors.title.message}
                          </span>
                        )}
                      </div>
                      <div>
                        <textarea
                          placeholder="Describe your issue in detail..."
                          rows={3}
                          className="input-modern !rounded-xl resize-none"
                          {...register("description", {
                            minLength: {
                              value: 30,
                              message:
                                "Description must be at least 30 characters",
                            },
                            required: {
                              value: true,
                              message: "Description is required",
                            },
                          })}
                        ></textarea>
                        {errors.description && (
                          <span className="text-red-400 text-xs mt-1 block">
                            {errors.description.message}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-end">
                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="btn-primary flex items-center gap-2 !text-sm"
                        >
                          {loading ? (
                            <span className="loading loading-spinner loading-sm"></span>
                          ) : (
                            <>
                              <Send className="w-4 h-4 relative z-10" />
                              <span className="relative z-10">Submit Ticket</span>
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Divider */}
        <div className="divider-gradient my-2" />

        {/* Tickets Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mt-4 mb-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <TicketIcon className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg md:text-xl font-semibold">Tickets</h2>
              {Tickets?.length > 0 && (
                <span className="badge badge-blue">
                  {filteredTickets?.length}
                </span>
              )}
            </div>

            {/* Assigned Toggle (Admin only) */}
            {user?.role === "admin" && <button
              onClick={() => setonlyAssignedTickets((prev) => !prev)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all duration-300 cursor-pointer ${
                onlyAssignedTickets
                  ? "bg-blue-500/15 border-blue-500/30 text-blue-300"
                  : "bg-white/5 border-white/10 text-gray-500 hover:text-gray-300"
              }`}
            >
              <Filter className="w-3 h-3" />
              <span>Assigned</span>
            </button>}

            {/* My Tickets Toggle */}
            <button
              onClick={() => setonlyMyTickets((prev) => !prev)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all duration-300 cursor-pointer ${
                onlyMyTickets
                  ? "bg-purple-500/15 border-purple-500/30 text-purple-300"
                  : "bg-white/5 border-white/10 text-gray-500 hover:text-gray-300"
              }`}
            >
              <User className="w-3 h-3" />
              <span>My Tickets</span>
            </button>
          </div>

          {/* Search & Refresh */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                placeholder="Search by Ticket ID..."
                className="input-modern !pl-9 !py-2 !text-sm"
                type="text"
                onChange={(e) => setsearchID(e.target.value)}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.4 }}
              onClick={() => fetchTickets()}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
            >
              {fetchLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <RefreshCcw className="w-4 h-4 text-gray-400" />
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Tickets List */}
        <div className="md:max-h-[55vh] max-h-[50vh] overflow-y-auto pr-1 space-y-3">
          <AnimatePresence>
            {filteredTickets?.length > 0 ? (
              filteredTickets.map((ticket, index) => (
                <motion.div
                  key={ticket._id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => navigate(`/ticket/${ticket._id}`)}
                  className="card-modern glow-border p-4 md:p-5 cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm md:text-base font-medium text-gray-200 group-hover:text-white transition-colors truncate">
                        {ticket.title}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500 mt-1 line-clamp-2">
                        {ticket.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {ticket.status && (
                        <span
                          className={`badge ${
                            ticket.status === "IN PROGRESS"
                              ? "badge-yellow"
                              : ticket.status === "PENDING"
                              ? "badge-blue"
                              : "badge-green"
                          }`}
                        >
                          {ticket.status}
                        </span>
                      )}
                      {canDeleteTicket(ticket) && (
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => openDeleteModal(e, ticket._id)}
                          className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors cursor-pointer"
                          title="Delete ticket"
                        >
                          {deletingId === ticket._id ? (
                            <span className="loading loading-spinner loading-xs text-red-400"></span>
                          ) : (
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          )}
                        </motion.button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5">
                    <span className="text-[11px] text-gray-600 font-mono truncate">
                      #{ticket._id}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-gray-600 ml-auto">
                      <Clock className="w-3 h-3" />
                      {new Date(ticket.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-gray-600"
              >
                <TicketIcon className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm">No tickets to display</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={closeDeleteModal}
        onConfirm={deleteTicket}
        title="Delete Ticket?"
        description="This ticket and all its data will be permanently removed. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        loading={deletingId !== null}
        variant="danger"
      />
    </div>
  );
};

export default Tickets;
