import React from 'react'

const Progress = ({progress,status}) => {
    const getcolor=()=>{
        switch (status) {
            case "completed":
                return "bg-indigo-500 bg-indigo-50 border-indigo-500/20 border";
            case "progress":
                return "bg-cyan-500 bg-cyan-50 border-cyan-500/20 border";
            default:
                return "bg-violet-500 bg-violet-50 border-violet-500/10 border";
        }
    }
  return (
    <div className='w-full h-1.5 bg-gray-200 rounded-full'>
        <div className={`${getcolor()} h-1.5 rounded-full text-center text-xs font-medium`} style={{width:`${progress}%`}}>
           

        </div>
    </div>
  )
}

export default Progress