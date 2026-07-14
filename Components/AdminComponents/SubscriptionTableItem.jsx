import React from 'react'

const SubsTableItem = ({email, mongoId, date}) => {
    const emailDate = new Date(date);
  return (
    <tr className='bg-white border-b text-left'>
        <th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
            {email?email:"No Email"}
        </th>
        <td className='px-6 py-4'>{emailDate.toDateString()}</td>
        <td className='px-6 py-4'>
            <button className='bg-red-500 text-white p-2 rounded-2xl cursor-pointer'>Delete</button>
        </td>
 
    </tr>
  )
}

export default SubsTableItem