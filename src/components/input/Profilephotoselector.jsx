import React, { useRef, useState } from 'react';
import { LuUser,LuUpload,LuTrash } from 'react-icons/lu';

const Profilephotoselector = ({image,setimage}) => {
    const inputref=useRef(null);
    const [previewurl,setpreview]=useState(null);

    const handleimagechange=(event)=>{
        const file=event.target.files[0];
        if (file) {
            // update the image state
            setimage(file);

            // generate preview url from the file
            const preview=URL.createObjectURL(file);
            setpreview(preview)
        }
    }
    const handleremoveimage=()=>{
        setimage(null)
        setpreview(null);
    }

    const onchoosefile=()=>{
        inputref.current.click();
    }
  return (
    <div className='flex justify-center mb-6'>
        <input type="file" accept='image/*' ref={inputref} onChange={handleimagechange} className='hidden' />
        {!image ?(
            <div className='w-20 h-20 flex items-center justify-center bg-blue-100/50 rounded-full relative cursor-pointer'>
                <LuUser className='text-4xl text-primary' />
                <button type='button'
                className='w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer'
                onClick={onchoosefile}>
                    <LuUpload/>
                </button>
            </div>
        ):(
            <div className='relative'>
                <img src={previewurl} alt='profile photo'
                className='w-20 h-20 bg-slate-400 rounded-full'  />
                <button type='button'
                className='w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1'
                onClick={handleremoveimage}>
                    <LuTrash/>
                </button>
            </div>
        )}
    </div>
  )
}

export default Profilephotoselector