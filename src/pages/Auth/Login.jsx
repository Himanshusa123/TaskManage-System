import React, { useContext, useState } from 'react'
import Authlayout from '../../components/layouts/Authlayout'
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/input/Input';
import { validateEmail } from '../../Utils/helper';
import axiosInstance from '../../Utils/axiosInstance';
import { API_PATHS } from '../../Utils/apiPath';
import { UserContext } from '../../context/Usercontext';

const Login = () => {

  const [email,setemail]=useState("");
  const [password,setpassword]=useState("");
  const [error,seterror]=useState(null);
  const { user, loading, updateUser  } = useContext(UserContext);

  const navigate=useNavigate();

  // handle login form submit
  const handlelogin=async(e)=>{
    e.preventDefault();
    if (!validateEmail(email)) {
      seterror("Please enter a valid email adress.")
    }
    if (!password) {
       seterror("Please enter the password");
       return
    }
    seterror("");

    // login api call
    try {
      const response =await axiosInstance.post(API_PATHS.AUTH.LOGIN,{
        email,
        password
      });

      const {token,role}=response.data;

      if (token) {
        localStorage.setItem("token",token);
        updateUser(response.data)
        
        
        // redirect based on role
      if (role === 'admin') {
        navigate("/admin/dashboard");
      }else{
        navigate("/user/dashboard")
      }
      }
      
    } catch (error) {
      if (error.response && error.response.data.message) {
        seterror(error.response && error.response.data.message)
      }else{
        console.log(error);
        
        seterror("Something went wrong. Please try again.")
      }
    }
  }
  return (
 <Authlayout>
  <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
    <h3 className='text-xl font-semibold text-black'>
     Welcome Back
    </h3>
     <p className='text-xs text-slate-700 mt-[5px] mb-6'>
        Please enter your details to log in
      </p>
      <form onSubmit={handlelogin}>
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
      {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
      <button type='submit' className='btn-primary'>
        LOGIN
      </button>
      <p className='text-[13px] text-slate-800 mt-3'>Don't have an account? {" "}
        <Link className='font-medium text-primary underline' to='/signup'>
        SignUp</Link> </p>
      </form>
      
  </div>
 </Authlayout>
  )
}

export default Login