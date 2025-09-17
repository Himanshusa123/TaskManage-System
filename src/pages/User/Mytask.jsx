import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Utils/axiosInstance";
import { API_PATHS } from "../../Utils/apiPath";
import { LuFileSpreadsheet } from "react-icons/lu";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/card/TaskCard";
import toast from "react-hot-toast";

const Mytask = () => {
  const [alltask, setalltask] = useState([]);
  const [tabs, settabs] = useState([]);
  const [filterstatus, setfilterstatus] = useState("All");

  const navigate = useNavigate();

  const getalltask = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.TASK.GET_ALL_TASKS, {
        params: {
          status: filterstatus === "All" ? "" : filterstatus,
        },
      });
      setalltask(res.data?.tasks?.length > 0 ? res.data?.tasks : []);

      // map status data with fixed labels and order
      const statssummary = res.data?.statusSummary || {};
      const statusarray = [
        { label: "All", count: statssummary?.all || 0 },
        { label: "pending", count: statssummary?.pendingtask || 0 },
        { label: "progress", count: statssummary?.inprogresstask || 0 },
        { label: "completed", count: statssummary?.completedtask || 0 },
      ];
      settabs(statusarray);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const handleclick = (taskId) => {
    navigate(`/user/task-details/${taskId}`);
  };

  useEffect(() => {
    getalltask(filterstatus);
    return () => {};
  }, [filterstatus]);
  return (
    <DashboardLayout activemenu="My Tasks">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium ">My Tasks</h2>

          {tabs?.[0]?.count > 0 && (
            <TaskStatusTabs
              tabs={tabs}
              activetab={filterstatus}
              setactivetab={setfilterstatus}
            />
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3  gap-4 mt-4">
          {alltask?.map((item, index) => (
            <TaskCard
              key={item._id}
              title={item.title}
              description={item.description}
              priority={item.priority}
              status={item.status}
              progress={item.progress}
              createdAt={item.createdAt}
              dueDate={item.dueDate}
              assignedTo={item.assignedTo?.map((user) => user.profileImageUrl) 
              }
              completed={item.completedtodocount}
              attachmentCount={item.attachments.length }
              todochecklist={item.todochecklist}
              onClick={() => {
                handleclick(item._id);
              }}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Mytask;
