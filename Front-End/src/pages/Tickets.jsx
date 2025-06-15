import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

const Tickets = () => {

  const [Tickets, setTickets] = useState({})
  const [fetchLoading, setfetchLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState : {errors},
    reset
  } = useForm()


  const fetchTickets = async() => {
    try {
      setfetchLoading(true)
      const res = await fetch("/api/tickets/", {method : 'GET',
    credentials : 'include'
    })
    const data = await res.json()
    setTickets(data)
    } catch (error) {
      setfetchLoading(false)
      console.log("Unable to fetch the ticket data")
    }finally{
      setfetchLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  },[])


  const submitTicket = async(data) => {
    const res = await fetch("/api/tickets", {method : 'POST',
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify(data)
    })
  }

  const navigate = useNavigate()

  const handleLogout = async() => {
    let res = await fetch("/api/auth/logout", {
      method : 'POST',
      credentials : 'include'
    })
    const data = await res.json()
    if(data?.message){
      toast.success("Logout successfully")
      navigate('/login')
    }
  }


  return (
    <>
      <div className='flex w-full min-h-screen flex-col gap-6 items-center mx-auto py-12'>
        <div>
          <h2 className='text-xl'>Create Ticket</h2>
          <form onSubmit={handleSubmit(submitTicket)}>
            <input
            placeholder='Ticket Title'
            className='w-full'
            type="text" {...register("title", {minLength : {value : 10, message : "Title must be greater than 10 characters"},maxLength : {value : 50, message : "Title should be less than 50 characters"}})} />
            <textarea
            placeholder='Ticket Description'
            className='w-full'
            {...register("description")}>

            </textarea>
          </form>
        </div>
      </div>

    </>
  )
}

export default Tickets
