import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Privateroute from "./routes/Privateroutes";
import Dashboard from "./pages/Admin/Dashboard";
import ManageTask from "./pages/Admin/ManageTask";
import CreateTask from "./pages/Admin/CreateTask";
import ManageUser from "./pages/Admin/ManageUser";
import UserDashboard from "./pages/User/UserDashboard";
import Mytask from "./pages/User/Mytask";
import ViewtaskDetails from "./pages/User/ViewtaskDetails";
import UserProvider, { UserContext } from "./context/Usercontext";
import {Toaster} from 'react-hot-toast'
const App = () => {
  return (
  <UserProvider>
    <div>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* admin routes */}
          <Route element={<Privateroute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/tasks" element={<ManageTask />} />
            <Route path="/admin/create-task" element={<CreateTask />} />
            <Route path="/admin/users" element={<ManageUser />} />
          </Route>

          {/* user routes */}
          <Route element={<Privateroute allowedRoles={["user"]} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/tasks" element={<Mytask />} />
            <Route path="/user/task-details/:id" element={<ViewtaskDetails/>} />
            
          </Route>

          {/* default route  */}
          <Route path="/" element={<Root/>} />
        </Routes>
      </Router>
    </div>
    <Toaster toastoptions={{className:"",style:{
      fontSize:"13px",
    }}}/>
    </UserProvider>
  );
};

export default App;
const Root = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <Outlet />;
  }

  return user?.role === "admin"
    ? <Navigate to="/admin/dashboard" />
    : <Navigate to="/user/dashboard" />;
};
