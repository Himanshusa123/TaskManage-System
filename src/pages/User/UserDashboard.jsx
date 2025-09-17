import React, { useContext, useEffect, useState } from 'react'
import useUserAuth from '../../hooks/useUserAuth'
import { UserContext } from '../../context/Usercontext'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { data, useNavigate } from 'react-router-dom'
import axiosInstance from '../../Utils/axiosInstance'
import { API_PATHS } from '../../Utils/apiPath'
import moment from 'moment'
import { IoMdCard } from 'react-icons/io'
import InfoCard from '../../components/card/InfoCard'
import { addthousandseparators } from '../../Utils/helper'
import { LuArrowRight } from 'react-icons/lu'
import TaskListTable from '../../components/TaskListTable'
import CustomPieChart from '../../components/charts/CustomPieChart'
import CustomBarChart from '../../components/charts/CustomBarChart'

const COLORS=["#8D51FF","#00B8DB","#7BCE00"];

const UserDashboard = () => {
  // useUserAuth()
  const {user}=useContext(UserContext)

  const navigate=useNavigate();

  const [dashboarddata,setdashboarddata]=useState(null);
  const [piechartdata,setpiechartdata]=useState([])
  const [barchartdata,setbarchartdata]=useState([])

  // prepare chart data
  const preparechartdata=(data)=>{
    const taskdistribution=data?.taskdistribution || null;
    const taskprioritylevels=data?.taskprioritylevel|| null
  
    const taskdistributiondata=[
      {
        status:'pending', count:taskdistribution?.pending ||0
      },{
        status:'progress', count:taskdistribution?.progress ||0
      },{status:'completed', count:taskdistribution?.completed ||0}
    ];
    setpiechartdata(taskdistributiondata);
    const taskprioritydata=[
      {
        priority:'high', count:taskprioritylevels?.high ||0
      },{
        priority:'medium', count:taskprioritylevels?.medium ||0
      },{priority:'low', count:taskprioritylevels?.low ||0}
    ];
    setbarchartdata(taskprioritydata);

  }

  

  const getdashboarddata=async()=>{
    try {
      const res=await axiosInstance.get(API_PATHS.TASK.GET_DASHBOARD_DATA);
      if (res.data) {
        setdashboarddata(res.data)
        preparechartdata(res.data?.charts  || null)
      }
    } catch (error) {
     console.error("Error fetching users",error);
     
    }
  }

  const onSeeMore=()=>{
    navigate('')
  }

  useEffect(()=>{
    getdashboarddata();
    return ()=>{}
  },[])
  return (
   <DashboardLayout activemenu="Dashboard" >
    <div className='card my-5'>
      <div>
      <div className='col-span-3'>
        <h2 className='text-xl md:text-2xl'>Good Morning! { user?.name}
        </h2>
        <p className='text-xs md:text-[14px] text-gray-400 mt-1.5'>
          {moment().format("dddd Do MMM YYYY")}
        </p>
      </div>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4   gap-3 md:gap-6  mt-5'>
        <InfoCard 
        label='Total Tasks'
        value={addthousandseparators(dashboarddata?.charts.taskdistribution?.All || 0)}
        colors='bg-primary'
        />
         <InfoCard 
        label='Pending Tasks'
        value={addthousandseparators(dashboarddata?.charts.taskdistribution?.pending || 0 )}
        colors='bg-violet-500'
        />
          <InfoCard 
        label='In Progress Tasks'
        value={addthousandseparators(dashboarddata?.charts.taskdistribution?.progress || 0)}
        colors='bg-cyan-500'
        />
          <InfoCard 
        label='Completed Tasks'
        value={addthousandseparators(dashboarddata?.charts.taskdistribution?.completed || 0)}
        colors='bg-lime-500'
        />

      </div>
    </div>
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6'>

<div>
  <div className='card'>
    <div className='flex justify-between items-center '>
      <h5 className='font-medium'>Task Distribution</h5>
    </div>
    <CustomPieChart data={piechartdata} colors={COLORS} />
  </div>
</div>

<div>
  <div className='card'>
    <div className='flex justify-between items-center '>
      <h5 className='font-medium'>Task Priority levels</h5>
    </div>
    <CustomBarChart data={barchartdata}  />
  </div>
</div>

      <div className='md:col-span-2'>
        <div className='card'>
          <div className='flex justify-between items-center '>
            <h5 className='text-lg'>Recent Tasks</h5>
            <button className='card-btn' onClick={onSeeMore}>See All <LuArrowRight className='text-base' /> </button>
          </div>
      
          <TaskListTable tabledata={dashboarddata?.recenttask||[]} />
        </div>
      </div>
    </div>
    </DashboardLayout>
  )
}

export default UserDashboard