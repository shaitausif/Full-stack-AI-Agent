import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { Bounce } from "react-toastify";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Clock,
  User,
  Tag,
  AlertCircle,
  FileText,
  Lightbulb,
  Layers,
  Trash2,
} from "lucide-react";
import { useSelector } from "react-redux";
import ConfirmModal from "../components/ConfirmModal";

const Ticket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticketData, setticketData] = useState({});
  const [loading, setloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { user } = useSelector((state) => state.data);

  const fetchTicketDetails = async () => {
    try {
      setloading(true);
      const res = await fetch(
        `${
          import.meta.env.NODE_ENV === "production"
            ? `${import.meta.env.VITE_BACKEND_URL}/api/tickets/${id}`
            : `/api/tickets/${id}`
        }`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setticketData(data.data);
      } else {
        toast.warn(data.message, {
          closeOnClick: true,
          autoClose: 3000,
          transition: Bounce,
        });
        navigate("/");
      }
    } catch (error) {
      console.log("Unable to fetch the ticket data: ", error.message);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
  }, []);

  const canDelete =
    user &&
    (user.role === "admin" || ticketData.createdBy?._id === user._id);

  const deleteTicket = async () => {
    try {
      setDeleting(true);
      const res = await fetch(
        `${
          import.meta.env.NODE_ENV === "production"
            ? `${import.meta.env.VITE_BACKEND_URL}/api/tickets/${id}`
            : `/api/tickets/${id}`
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
        navigate("/");
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
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      "TODO": "badge-green",
      "PENDING": "badge-blue",
      "IN PROGRESS": "badge-yellow",
    };
    return map[status] || "badge-blue";
  };

  const getPriorityBadge = (priority) => {
    const map = {
      high: "badge-red",
      medium: "badge-yellow",
      low: "badge-green",
    };
    return map[priority] || "badge-blue";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] bg-grid flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="loading loading-spinner loading-lg text-blue-500"></span>
          <p className="text-sm text-gray-500">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] bg-grid">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Back & Delete */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            whileHover={{ x: -3 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to tickets</span>
          </motion.button>

          {canDelete && (
            <motion.button
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </motion.button>
          )}
        </div>

        {/* Ticket Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-strong rounded-2xl p-5 md:p-8 glow-blue mb-6"
        >
          {/* Top accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-lg md:text-2xl font-bold text-white mb-2">
                {ticketData.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                {ticketData.status && (
                  <span className={`badge ${getStatusBadge(ticketData.status)}`}>
                    {ticketData.status}
                  </span>
                )}
                {ticketData.priority && (
                  <span
                    className={`badge ${getPriorityBadge(ticketData.priority)}`}
                  >
                    {ticketData.priority} priority
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5" />
              {new Date(ticketData.createdAt).toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Description
              </h3>
            </div>
            <p className="text-sm md:text-base text-gray-400 leading-relaxed pl-6">
              {ticketData.description}
            </p>
          </div>

          {/* Divider */}
          <div className="divider-gradient my-6" />

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Related Skills */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <Tag className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                  Related Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {ticketData.relatedSkills?.map((skill, i) => (
                    <span key={i} className="badge badge-purple !text-[10px]">
                      {skill}
                    </span>
                  ))}
                  {!ticketData.relatedSkills?.length && (
                    <span className="text-sm text-gray-600">None</span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Priority */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5"
            >
              <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-yellow-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                  Priority
                </p>
                <p className="text-sm text-gray-300">{ticketData.priority || "Not set"}</p>
              </div>
            </motion.div>

            {/* Assigned To */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                  Assigned To
                </p>
                <p className="text-sm text-gray-300">
                  {ticketData.assignedTo
                    ? ticketData.assignedTo?.email
                    : "Not assigned yet"}
                </p>
              </div>
            </motion.div>

            {/* Created By */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5"
            >
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                <Layers className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                  Created By
                </p>
                <p className="text-sm text-gray-300">
                  {ticketData.createdBy?.email}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Helpful Notes */}
          {ticketData.helpfulNotes && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 p-4 rounded-xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/10"
            >
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                <h3 className="text-sm font-semibold text-gray-300">
                  Helpful Notes
                </h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed pl-6">
                {ticketData.helpfulNotes}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={deleteTicket}
        title="Delete Ticket?"
        description="This ticket and all its data will be permanently removed. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleting}
        variant="danger"
      />
    </div>
  );
};

export default Ticket;
