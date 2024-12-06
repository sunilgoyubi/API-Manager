import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className=' flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <h1 className='text-3xl font-bold mb-8'>API manager</h1>
      <div className='flex gap-6'>
        {/* admin card */}
        <Link to = "">
        <div className='bg-blue-500 text-white w-60 h-40'>
          <p className=''>Admin</p>
        </div>
        </Link>

        {/* platform card */}
        <Link to = "">
        <div>
          <p>Platform</p>
        </div>
        </Link>

      </div>
    </div>
  )
}

export default Home