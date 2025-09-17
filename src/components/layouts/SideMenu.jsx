import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../context/Usercontext';
import { useNavigate } from 'react-router-dom';
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from '../../Utils/data';

const SideMenu = ({activemenu}) => {
    const {user,clearUser}=useContext(UserContext);
    const [sidemenudata,setsidemenudata]=useState([]);

    const navigate=useNavigate();

    const handleclick=(route)=>{
      if (route === '/logout') {
        handlelogout();
        return;
      }
      navigate(route);
    }

    const handlelogout=()=>{
      localStorage.clear();
      clearUser();
      navigate('/login');
    }
    useEffect(()=>{
      if (user) {
        setsidemenudata(user?.role==='admin' ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA);
      }
      return ()=>{}
    },[user]);

  return (
    <div className='w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20 '>
      <div className='flex flex-col items-center justify-center mb-7 pt-5'>
        <div className='relative'>
          <img src={user?.profileImageUrl} alt="Profile Image" className='w-20 h-20 bg-slate-400 rounded-full' />
        </div>
        {user?.role==='admin' &&(
          <div className='text-[10px] font-medium text-white bg-primary px-3 py-0.5 rounded  mt-1 '>Admin</div>
        )}
        <h5 className='text-gray-950 font-medium leading-6 mt-3'>{user?.name || " "}</h5>
        <p className='text-[12px] text-gray-500'>{user?.email || " "}</p>
      </div>
      {sidemenudata.map((item, index) => (
        <button key={`menu_${index}`} className={`w-full flex items-center gap-4 text-[18px] ${activemenu==item.label ? "text-primary bg-linear-to-r from-blue-50/40 to-blue-100/50 border-r-4":" "} py-3 px-6 cursor-pointer`}  onClick={() => handleclick(item.path)}>
          <item.icon className='text-xl'/>
          {item.label}
        </button>))}
    </div>
  )
}

export default SideMenu