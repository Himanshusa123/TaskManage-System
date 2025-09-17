import React, { useContext, useState } from 'react'
import Authlayout from '../../components/layouts/Authlayout'
import Profilephotoselector from '../../components/input/Profilephotoselector';
import Input from '../../components/input/Input';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../Utils/axiosInstance';
import { API_PATHS } from '../../Utils/apiPath';
import { UserContext } from '../../context/Usercontext';
import uploadImage from '../../Utils/uploadimage';
const Signup = () => {

  const [profilepic,setprofilepic]=useState(null);
  const [fullname,setfullname]=useState("");
  const [email,setemail]=useState("");
  const [password,setpassword]=useState("");
  const [admininvitetoken,setadmininvitetoken]=useState('')
  const [error,seterror]=useState(null);
  const { user, loading, updateUser  } = useContext(UserContext);
  const navigate=useNavigate()

   // handle signin form submit
    const handlesignup=async(e)=>{
      e.preventDefault();

      let profileimageurl=''
      if (!fullname) {
        seterror("Please enter a full name")
      }
      if (!email) {
        seterror("Please enter a valid email adress.")
      }
      if (!password) {
         seterror("Please enter the password");
         return
      }
      seterror("");
   // signup api call
   try {
    // upload image if present
    if (profilepic) {
      const imguploadres=await uploadImage(profilepic);
      profileimageurl=imguploadres.imageUrl || " "
    }
    const response=await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
      name:fullname,
      email,password,profileImageUrl:profileimageurl,admininvitetoken
    });
    const {token,role}=response.data;
    if (token) {
      localStorage.setItem("token",token);
      // updateUser(response.data)

      //redirect based on role
      if (role==='admin') {
        navigate("/admin/dashboard");
      }else{
        navigate("/user/dashboard")
      }
    }
    
  } catch (error) {
    if (error.response) {
        // Check if error.response.data exists and has a message
        if (error.response.data && error.response.data.message) {
            seterror(error.response.data.message);
        } else {
            seterror("An error occurred. Please try again.");
        }
    } else {
        // Handle network errors or other issues
        console.log(error);
        
        seterror("Network error or unexpected issue. Please try again.");
    }
}
      
    }
  return (
   <Authlayout>
    <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'><h3 className='text-xl font-semibold text-black'>Create an Account</h3>
    <p className='text-xs text-slate-700 mt-[5px]mb-6'>Join us today by entering your details below.</p>
    <form onSubmit={handlesignup}>
      <Profilephotoselector image={profilepic} setimage={setprofilepic
      } />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Input 
        value={fullname}
        onChange={({target})=>setfullname(target.
        value)} 
        label='Full Name'
        placeholder='John'
        type='text'
        />
        <Input
      value={email}
      onChange={({target})=>setemail(target.value)}
      label="Email Address"
      placeholder="john@example.com"
      type="text"
      />
       <Input
      value={password}
      onChange={({target})=>setpassword(target.value)}
      label="Password"
      placeholder="12345678"
      type="password"
      />
       <Input
      value={admininvitetoken}
      onChange={({target})=>setadmininvitetoken(target.value)}
      label="Admin Invite Token"
      placeholder="6 Digit Code"
      type="text"
      /> </div>
       {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
      <button type='submit' className='btn-primary'>
        SIGN UP
      </button>
      <p className='text-[13px] text-slate-800 mt-3'>Already an account? {" "}
        <Link className='font-medium text-primary underline' to='/login'>
        LOGIN</Link> </p>
     
    </form>
    </div>
   </Authlayout>
  )
}

export default Signup