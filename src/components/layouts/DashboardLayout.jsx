import React, { useContext } from "react";
import { UserContext } from "../../context/Usercontext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

const DashboardLayout = ({ children, activemenu }) => {
  const { user } = useContext(UserContext);
  return (
    <div className="">
      <Navbar activemenu={activemenu} />
      {user && (
        <div className="flex">
          <div className="max-[1080px]:hidden">
            <SideMenu activemenu={activemenu} />
          </div>
          <div className="grow mx-5">{children}</div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
