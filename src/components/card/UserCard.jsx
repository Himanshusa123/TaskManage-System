import React from 'react'

const UserCard = ({userinfo}) => {
  return (
    <div className='user-card p-2'>
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
                <img src={userinfo?.profileImageUrl} alt={`avatar`} className='w-12 h-12 rounded-full border-2 border-white' />

                <div>
                    <p className='text-sm font-medium'>
                        {userinfo?.name}
                    </p>
                    <p className='text-xs text-gray-500'>
                        {userinfo?.email}
                    </p>
                </div>
            </div>
        </div>
        <div className='flex items-end gap-3 mt-5'>
            <Statcard label='pending' count={userinfo?.pendingtasks || 0} status='pending' />
            <Statcard label='progress' count={userinfo?. inProgresstask || 0} status='progress' />
            <Statcard label='completed' count={userinfo?.  completedtask || 0} status='completed' />
        
        </div>
    </div>
  )
}

export default UserCard

const Statcard = ({label,count,status}) => {
    const getstatustagcolor=()=>{
        switch (status) {
            case "completed":
                return "text-indigo-500 bg-gray-50"
            case "progress":
                return "text-cyan-500 bg-gray-50 ";
            default:
                return "text-violet-500 bg-gray-50";
        }
    }
  return (
    <div className={`flex-1 font-medium text-[10px] ${getstatustagcolor()} px-4 py-0.5 rounded`}>
       <span className='text-[12px] font-semibold'>{count}</span><br />{label}
    </div>
  )
}