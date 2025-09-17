import React from 'react'
import { useState } from 'react'
import { FaRegEye,FaRegEyeSlash } from 'react-icons/fa'

const Input = ({value,
    onChange,
    label,
    placeholder,
    type}) => {
      const [showpassword,setshowpassword]=useState(false)

      const toggleshowpassword=()=>{
        setshowpassword(!showpassword)
      }
  return (
    <div>
        <label className='text-[13px] text-slate-800'>{label}</label>
        <div className='input-box'>
            <input type={type=='password' ? showpassword ? 'text':'password':type} 
            placeholder={placeholder}
            className='w-full bg-transparent outline-none'
            value={value}
            onChange={(e)=> onChange(e)}/>
            {type==='password'&&(
              <>
            {showpassword?(
              <FaRegEye size={22}
              className='text-primary cursor-pointer'
              onClick={()=>toggleshowpassword} />
            ):(
              <FaRegEyeSlash
              size={22}
              className='text-slate-400 cursor-pointer'
              onClick={toggleshowpassword}
              />
            )}
            </>
            )}
        </div>
    </div>
  )
}

export default Input