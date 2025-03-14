import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

const Posts = () => {
  const {posts } = useSelector((store) => store.post)
    const arr = [1,2,3,4]
  return (
    <div className='flex flex-col ml-20 justify-center items-center min-w-max max-w-[60vw]   '>
       { posts?.map((post) => (
        <div key={post._id}>
            <Post post = {post}/>
        </div>
       )) }
    </div>
  )
}

export default Posts