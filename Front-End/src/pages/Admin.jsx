import React, { useState } from 'react'

const admin = () => {

  const [users, setusers] = useState([])
  const [value, setvalue] = useState("")


  // See, here now i am going to home from college but to complete this component i will use debouncing technique such that whenever the input changes it should wait for some milliseconds after user stops writing then fetch an api request to the particular endpoint to reduce the database queries and optimize the system and overall software 



  return (
    <div className='flex w-full min-h-screen flex-col gap-6 items-center mx-auto py-6'>
      <div className='w-[50vw] '>
        <div className='flex flex-col justify-between gap-5'>
          <h2 className='md:text-2xl text-lg font-semibold'>Admin Panel - Manage Users</h2>
          <input
                  placeholder="Search by Email"
                  className="w-full outline-none border border-gray-600 shadow-lg transition-all duration-500 focus:border-gray-400 rounded-md md:px-2 py-1 md:text-base text-sm"
                  type="text"
                  value={value}
                  onChange={(e) => setvalue(e.target.value)}
                />
        </div>
      </div>
    </div>
  )
}

export default admin
