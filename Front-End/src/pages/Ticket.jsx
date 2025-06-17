import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { toast } from "react-toastify"
import { Bounce } from "react-toastify"

const Ticket = () => {
  const { id } = useParams()

  const navigate = useNavigate()
  // There will be only single ticket details on each ticket page so that's why I am storing them and also receiving them in the object
  const [ticketData, setticketData] = useState({})
  const [loading, setloading] = useState(false)

  const fetchTicketDetails = async() => {
    try {
      setloading(true)
      const res = await fetch(`/api/tickets/${id}`)
    const data = await res.json()
    if(res.ok){
      setticketData(data.data)
      console.log(data.data)
    }else{
      toast.warn(data.message, { closeOnClick: true, autoClose: 3000, transition: Bounce });
      navigate('/')
    }
    } catch (error) {
      console.log("Unable to fetch the ticket data: ",error.message)
    }finally{
      setloading(false)
    }

  }

  useEffect(() => {
      fetchTicketDetails()
    },[])


  return (
    <div className="flex w-full min-h-screen flex-col gap-6 items-center mx-auto pb-6">
        <div className="w-[50vw]">
          <h2 className="text-xl md:text-2xl py-6">Ticket Details</h2>

          <div className="w-full md:p-5 p-3 rounded-lg bg-[#1A2433]">
            <div className="flex flex-col md:gap-3 gap-2"> 
              <h2 className="md:text-xl text-md">{ticketData.title}</h2>
              <p>{ticketData.description}</p>
            </div>
            <div className="flex items-center my-6">
              <hr className="flex-grow border-gray-500" />
              <span className="px-4 md:text-xl text-md">MetaData</span>
              <hr className="flex-grow border-gray-500" />
            </div>
            <div className="flex flex-col md:gap-3 gap-2 text-md">
                <h3><span className="font-semibold">Status</span>: {ticketData.status}</h3>
                <h4><span className="font-semibold">Priority</span>: {ticketData.priority}</h4>
                <h4><span className="font-semibold">Related Skills</span>: {ticketData.relatedSkills?.join(", ")}</h4>
                <h4><span className="font-semibold">Helpful Notes</span>: <br /></h4>
                <p className="md:text-base text-sm">{ticketData.helpfulNotes}</p>
                <h4><span className="font-semibold">Assigned To: </span>{ticketData.assignedTo ? ticketData.assignedTo?.email : "Not Assigned yet."}</h4>
                <h4><span className="font-semibold">Created By: </span>{ticketData.createdBy?.email}</h4>
                <p className="md:text-sm text-[12px] text-gray-400 mt-2">{new Date(ticketData.createdAt).toLocaleString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}</p>
            </div>

          </div>
        </div>
    </div>
  )
}

export default Ticket
