import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'
import CreatePostDialoge from './CreatePostDialoge'

const MainLayout = () => {
  const [open,setOpen] = useState(false)
  return (
    <div> {/* Makes it a flex container */}
      <LeftSidebar setOpen={setOpen} />
      <div className='flex items-center justify-center'>
        <Outlet />
      </div>
      <CreatePostDialoge open={open} setOpen={setOpen}/>
    </div>
  )
}

export default MainLayout
