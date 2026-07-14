import { assets } from '@/Assets/assets'
import Image from 'next/image'
import React from 'react'

const BlogTableItems = ({authorImg, title, author, date, deleteBlog, mongoId}) => {

    const BlogDate = new Date(date);

  return (
    <tr className='bg-white border-b'>
        <th scope='row' className='items-center gap-3 hidden sm:flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
            <Image src={authorImg?authorImg:assets.profile_icon} alt='' width={40} height={40} className='rounded-full'/>
            <p>{author?author:"No author"}</p>
        </th>
        <td className='px-6 py-4'>
            {title?title:"no title"}
        </td>
        <td className='px-6 py-4'>
            {BlogDate.toDateString()}
        </td>
        <td  className='px-6 py-4'>
            <button onClick={()=>deleteBlog(mongoId)} className='bg-red-500 text-white p-2 rounded-2xl cursor-pointer '>Delete</button>
        </td>
    </tr>
  )
}

export default BlogTableItems