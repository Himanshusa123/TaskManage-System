import React, { useEffect, useState } from 'react'
import axiosInstance from '../../Utils/axiosInstance';
import { API_PATHS } from '../../Utils/apiPath';
import { LuUsers } from 'react-icons/lu';
import Model from '../Model';
import AvatarGroup from '../AvatarGroup';

export const SelectUser = ({selectesuser,
    setselecteduser}) => {
        const [allusers,setallusers]=useState([])
        const [ismodalopen,setismodalopen]=useState(false)
        const [tempselectionuser,settempselectionuser]=useState([]);

        const getalluser=async()=>{
            try {
                const res=await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
                if (res.data?.length>0) {
                    setallusers(res.data);
                }
            } catch (error) {
                console.log('Error fetching users: ',error);
                
            }

        }
        const toggleuserselection=(userId)=>{
            settempselectionuser((prv)=> prv.includes(userId)?prv.filter((id)=> id !==userId):[...prv,userId])
        }
        const handleassign=()=>{
            setselecteduser(tempselectionuser);
            setismodalopen(false);
        }
        const selecteduseravatars=allusers.filter((user)=> selectesuser.includes(user._id)).map((user)=> user.profileImageUrl);

        useEffect(() => {
            getalluser();
        }, []);
        useEffect(() => {
            if (selectesuser.length===0) {
                settempselectionuser([]);
            }
            return ()=>{};
        }, [selectesuser]);
  return (
    <div className='space-y-4 mt-2'>
        {/* {JSON.stringify(allusers)} */}
        {selecteduseravatars.length===0 && (
            <button className='card-btn ' onClick={()=>setismodalopen(true)} >
                <LuUsers className='text-sm' />Add Members
            </button>
        )}
        {selecteduseravatars.length>0 && (
            <div className='cursor-pointer' onClick={()=>setismodalopen(true)}>
                <AvatarGroup avatars={selecteduseravatars} maxVisible={3} />
            </div>
        )}
        <Model isopen={ismodalopen} onclose={()=>setismodalopen(false)} title="Select Users" >
            <div className='space-y-4 h-[60vh] overflow-y-auto'>
                {allusers.map((user)=>(
                    <div key={user._id}
                    className='flex items-center gap-4 p-3 border-b border-gray-200'>
                        <img src={user.profileImageUrl} alt={user.name} className='w-10 h-10 rounded-full' />
                       <div className='flex-1'>
                        <p className='font-medium text-gray-800 dark:text-white'>
                            {user.name}
                        </p>
                        <p className='text-[13px] text-gray-500'>{user.email}</p>
                       </div>
                       <input type="checkbox" checked={tempselectionuser.includes(user._id)}
                       onChange={()=>toggleuserselection(user._id)}
                       className='w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none' />
                    </div>
                ))}
            </div>
            <div className='flex justify-end gap-4 pt-4'>
                <button className='card-btn' onClick={()=>setismodalopen(false)
                }>
                    CANCEL
                </button>
                <button className='card-btn-fill' onClick={handleassign}>
                    DONE
                </button>
            </div>
        </Model>
      
    </div>
  )
}
