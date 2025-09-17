import React, { useState } from 'react'
import { HiMiniPlus,HiOutlineTrash } from 'react-icons/hi2'
import { LuPaperclip } from 'react-icons/lu';

const AddAttachmentsInput = ({attachments,setattachment}) => {
    const [option,setoption]=useState("");

    // function to handle adding on option
    const handleaddoption=()=>{
        if (option.trim()) {
            setattachment([...attachments,option.trim()]);
            setoption("");
        }
    }
    // function to handle removing an option
    const handleremoveoption=(index)=>{
        const updateedarr=attachments.filter((_,index1)=> index1 !== index);
        setattachment(updateedarr);
    }
  return (
    <div>
        {attachments.map((item,index)=>(
            <div key={item} className='flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2'>
                <div className='flex items-center gap-3 flex-1 border border-gray-100'>
                    <LuPaperclip className='text-gray-400' />
                    <p className='text-xs text-black'>{item}</p>
                </div>
                <button className='cursor-pointer' onClick={()=>{handleremoveoption(index)}}>
                    <HiOutlineTrash className='text-lg text-red-500' />
                </button>
            </div>
        ))}
        <div className='flex items-center gap-5 mt-4'>
            <div className='flex items-center gap-3 flex-1 border border-gray-100 rounded-md px-3'>
               <LuPaperclip className='text-gray-400' />
               <input type="text" placeholder='Add File Link' value={option} onChange={({target})=> setoption(target.value)} className='w-full text-[13px] text-black outline-none bg-white py-2' /> 
            </div>
            <button className='card-btn text-nowrap' onClick={handleaddoption} >
                <HiMiniPlus className='text-lg'/>Add
            </button>
        </div>
    </div>
  )
}

export default AddAttachmentsInput