import React, { useContext, useEffect } from "react";
import { UserContext} from "../context/Usercontext";
import { useNavigate } from "react-router-dom";

const useUserAuth = () => {
    const contextValue = useContext(UserContext);
console.log(contextValue); // This should log the context value or undefined
  const [user,loading, clearUser] = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return
    }
    if (user) {
      return
    }
    if (!user) {
      clearUser();
      navigate("/login");
    }
  }, [user, loading, clearUser, navigate]);
  
};

export default useUserAuth;
