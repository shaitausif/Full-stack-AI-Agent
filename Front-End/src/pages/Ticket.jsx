import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

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
    <div className="flex w-full min-h-screen flex-col gap-6 items-center mx-auto py-6">
        <div className="w-[50vw]">
          <h2 className="text-xl md:text-2xl py-6">Ticket Details</h2>

          <div className="w-full bg-[#1A2433]">
            <div> 

            </div>

          </div>
        </div>
    </div>
  )
}

export default Ticket
