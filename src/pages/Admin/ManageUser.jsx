import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import axiosInstance from '../../Utils/axiosInstance'
import { API_PATHS } from '../../Utils/apiPath'
import { LuFileSpreadsheet } from 'react-icons/lu'
import UserCard from '../../components/card/UserCard'
import toast from 'react-hot-toast'

const ManageUser = () => {
  const [allusers,setallusers]=useState([])

  const getalluser=async()=>{
    try {
      const res=await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (res.data?.length>0) {
        setallusers(res.data)
      }
    } catch (error) {
      console.error("Error fetching users ",error);
      
    }
  }

  // download task report
  const handledownloadreport=async()=>{
    try {
      const res=await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERS,{
        responseType:'blob'
      })

      // create a url for the task
      const url=window.URL.createObjectURL(new Blob([res.data]))
      const link=document.createElement('a');
      link.href=url;
      link.setAttribute('download','users_details.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading report ",error);
      toast.error("Error downloading report")

      
    }
  }
  useEffect(()=>{
    getalluser()
    return () => {}
  },[])
  return (
    <DashboardLayout activemenu='Team Members' >
      <div className='mt-5 mb-10'>
        <div className='flex md:flex-row md:items-center justify-between'>
          <h2 className='text-xl md:text-xl font-medium'>Team Members</h2>
          <button className='flex md:flex download-btn' onClick={handledownloadreport}>
            <LuFileSpreadsheet className='text-lg' />
            Download Report</button>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
          {allusers?.map((user)=>(
            <UserCard key={user._id} userinfo={user}/>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ManageUser