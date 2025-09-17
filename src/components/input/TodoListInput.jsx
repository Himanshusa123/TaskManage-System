import React, { useState } from 'react'
import { HiOutlineTrash,HiMiniPlus } from 'react-icons/hi2';

const TodoListInput = ({todolist,settodolist}) => {
    const [option,setoption]=useState("");

    // function to handle adding on option
    const handleaddoption=()=>{
        if (option.trim()) {
            settodolist([...todolist,option.trim()]);
            setoption("");
        }
    };
    // function to handle removing an option
    const handleremoveoption=(index)=>{
        const updateedarr=todolist.filter((_,index1)=> index1 !== index);
        settodolist(updateedarr);
    }
  return (
    <div>
        {todolist.map((item,index)=>(
            <div key={item} className='flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2'>
                <p className='text-xs text-black'>
                    <span className='text-xs text-gray-400 font-semibold mr-2'>
                        {index < 9 ? `0${index + 1}` : index + 1}
                    </span>{item}
                </p>
                <button className='cursor-pointer' onClick={()=>{handleremoveoption(index)}}>
                    <HiOutlineTrash className='text-lg text-red-500' />

                </button>
            </div>
        ))}
        <div className='flex items-center gap-5 mt-4'>
            <input type="text" placeholder='Enter Task' value={option} onChange={({target})=> setoption(target
                .value
            )} className='w-full text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md' />
            <button className='card-btn text-nowrap' onClick={handleaddoption}>
                <HiMiniPlus className='text-lg'/>Add
            </button>
        </div>
    </div>
  )
}

export default TodoListInput