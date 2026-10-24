'use client'
import BlogTableItems from '@/Components/AdminComponents/BlogTableItems'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const Page = () => {

  const [blogs, setblogs] = useState([]);

  const fetchBlogs = async () => {
    try {
        const response = await axios.get('/api/blog');
        setblogs(response.data.blogs);
    } catch (error) {
        toast.error(
            error.response?.data?.message || "Failed to fetch blogs"
        );
    }
  }

  const deleteBlog = async (mongoId) => {
    try {
        const response = await axios.delete('/api/blog', {
            params: {
                id: mongoId
            }
        });

        toast.success(response.data.message);
        await fetchBlogs();

    } catch (error) {
        toast.error(
            error.response?.data?.message || "Failed to delete blog"
        );
    }
  }

  useEffect(() => {
    fetchBlogs();
  }, [])

  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16'>
      <h1>All blogs</h1>
      <div className='relative h-[80vh] max-w-212.5 overflow-x-auto mt-4 border border-green-400 scrollbar-hide'>
        <table className='w-full text-sm text-gray-500'>
          <thead className='text-sm text  text-left uppercase bg-gray-50'>
            <tr>
              <th scope='col' className='hidden sm:block px-6 py-3'>
                Author name
              </th>
              <th scope='col' className=' px-6 py-3'>
                Blog Title
              </th>
              <th scope='col' className=' px-6 py-3'>
                Date
              </th>
              <th scope='col' className=' px-6 py-3'>
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {blogs.map((item,index) => {
              return  <BlogTableItems key={item._id} mongoId={item._id} title={item.title} author={item.author} authorImg={item.authorImg} date={item.date} deleteBlog={deleteBlog}/>
            })}
            
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Page