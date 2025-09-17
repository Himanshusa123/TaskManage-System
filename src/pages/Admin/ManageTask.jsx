import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../Utils/axiosInstance';
import { API_PATHS } from '../../Utils/apiPath';
import { LuFileSpreadsheet } from 'react-icons/lu';
import TaskStatusTabs from '../../components/TaskStatusTabs';
import TaskCard from '../../components/card/TaskCard';
import toast from 'react-hot-toast';

const ManageTask = () => {
  const [alltask,setalltask]=useState([]);
  const [tabs,settabs]=useState([]);
  const [filterstatus,setfilterstatus]=useState("All");

  const navigate=useNavigate()

  const getalltask=async()=>{
try {
  const res=await axiosInstance.get(API_PATHS.TASK.GET_ALL_TASKS,{
    params:{
      status:filterstatus==='All' ? '' : filterstatus
    }
  })
  setalltask(res.data?.tasks?.length>0 ? res.data?.tasks : [])

  // map status data with fixed labels and order
  const statssummary=res.data?.statusSummary ||{};
  const statusarray=[
    {label:"All",count:statssummary?.all || 0},
    {label:"pending",count:statssummary?.pendingtask || 0},
    {label:'progress',count:statssummary?.inprogresstask || 0},
    {label:'completed',count:statssummary?.completedtask || 0},
  ];
  settabs(statusarray)
} catch (error) {
  console.error('Error fetching users:',error);
  
}
  }
  const handleclick=(taskdata)=>{
    navigate(`/admin/create-task`,{state:{taskId:taskdata._id}})
  }
  // download task report
  const handledownloadreport=async()=>{
    try {
      const res=await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS,{
        responseType:'blob',
        
      })

      // create a url for the task
      const url=window.URL.createObjectURL(new Blob([res.data]))
      const link=document.createElement('a');
      link.href=url;
      link.setAttribute('download','task_details.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url)

    } catch (error) {
      console.error("Error downloading report ",error);
      toast.error("Failed to download expense details. Please try again!")
      
    }
  }
  useEffect(()=>{
    getalltask(filterstatus);
    return()=>{}
  },[filterstatus])
  return (
    <DashboardLayout activemenu="Manage Tasks" >
      <div className='my-5'>
      
        <div className='flex flex-col lg:flex-row lg:items-center justify-between'>
          <div className='flex items-center justify-between gap-3'>
            <h2 className='text-xl md:text-xl font-medium '>My Tasks</h2>
            <button className='flex lg:hidden download-btn' onClick={handledownloadreport}>
              <LuFileSpreadsheet className='text-lg' />
              Download Report</button>
          </div>
          {tabs?.[0]?.count >0 && (
            <div className='flex items-center gap-3'>
              <TaskStatusTabs tabs={tabs} activetab={filterstatus} setactivetab={setfilterstatus} />
              <button className='hidden lg:flex download-btn' onClick={handledownloadreport}>
                <LuFileSpreadsheet className='text-lg' />Download Report
              </button>
            </div>
          )}

        </div>
        <div className='grid grid-cols-1 md:grid-cols-3  gap-4 mt-4'>
          {alltask?.map((item,index)=>(
            <TaskCard key={item._id} title={item.title} description={item.description} priority={item.priority} status={item.status} progress={item.progress} createdAt={item.createdAt} dueDate={item.dueDate}  assignedTo={item.assignedTo?.map((item)=>item.profileImageUrl)}  completed={item.completedtodocount || 0} attachmentCount={item.attachments.length || 0} todochecklist={item.todochecklist} onClick={()=>{
              handleclick(item)
            }} />
          ))}
        </div>
        
      </div>

    </DashboardLayout>
  )
}

export default ManageTask