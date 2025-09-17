import React, { use, useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { LuTrash2 } from "react-icons/lu";
import { PRIORITY_DATA } from "../../Utils/data";
import SelectDropdown from "../../components/input/SelectDropdown";
import { SelectUser } from "../../components/input/SelectUser";
import TodoListInput from "../../components/input/TodoListInput";
import AddAttachmentsInput from "../../components/input/AddAttachmentsInput";
import axiosInstance from "../../Utils/axiosInstance";
import { API_PATHS } from "../../Utils/apiPath";
import { toast } from "react-hot-toast";
import moment from "moment";
import DeleteAlert from "../../components/DeleteAlert";
import Model from "../../components/Model";


const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskdata, settaskdata] = useState({
    title: "",
    description: "",
    priority: "low",
    dueDate: null,
    assignedTo: [],
    todochecklist: [],
    attachments: [],
  });

  const [currenttask, setcurrenttask] = useState(null);
  const [error, seterror] = useState("");
  const [loading, setloading] = useState(false);
  const [opendeletealert, setopendeletealert] = useState(false);

  const handlevaluechange = (key,value) => {
    settaskdata((prevdata) => ({ ...prevdata, [key]: value }));
  };
  const cleardata = () => {
    settaskdata({
      title: "",
      description: "",
      priority: "low",
      dueDate: null,
      assignedTo: [],
      todochecklist: [],
      attachments: [],
    });
  };

  // create task function
  const createtask = async () => {
    setloading(true);

    try {
      const todolist = taskdata.todochecklist.map((item)=>({
        text:item,
        completed:false,
      }))
      const res=await axiosInstance.post(API_PATHS.TASK.CREATE_TASK,{...taskdata,dueDate:new Date(taskdata.dueDate).toISOString(),todochecklist:todolist});
      toast.success("Task created Successfully");
      cleardata();
    } catch (error) {
      console.error("Error creating tasks:",error);
      setloading(false)
      
    }finally{
      setloading(false)
    }
  };
  // update task function
  const updatetask = async () => {
    setloading(true)
    try {
      const todolist=taskdata.todochecklist?.map((item)=>{
        const prevtodolist=currenttask?.todochecklist ||[];
        const matchtask=prevtodolist.find((task)=>task.text===item);
        return{
          text:item,
          completed:matchtask?matchtask.completed : false,
        }
      });
      const res=await axiosInstance.put(API_PATHS.TASK.UPDATE_TASK(taskId),{...taskdata,dueDate:new Date(taskdata.dueDate).toISOString(),todochecklist:todolist});
      toast.success("Task updated Successfully");
    } catch (error) {
      console.error("Error updating task:",error);
      setloading(false)
      
    } finally{
      setloading(false)
    }
  };
  const handlesubmit = async () => {
    seterror(null);

    // input validation
    if (!taskdata.title.trim()) {
      seterror("Please enter task title");
      return;
      
    }
    if (!taskdata.description.trim()) {
      seterror("Please enter task description");
      return;
      
    }
    if(!taskdata.dueDate){
      seterror("Please select due date");
      return;
    }
    if (taskdata.assignedTo?.length===0) {
      seterror("Please select assigned user");
      return;
    }
    if (taskdata.todochecklist?.length===0) {
      seterror("Please add todo checklist");
      return;
    }
    if (taskId) {
      updatetask()
      return
    }
    createtask()
  };
  //get task by id function
  const gettaskbyid = async () => {
    try {
      const res=await axiosInstance.get(API_PATHS.TASK.GET_TASK_BY_ID(taskId));
      if (res.data) {
        const taskinfo=res.data;
        setcurrenttask(taskinfo)

        settaskdata((prev)=>({
          title:taskinfo.title,
          description:taskinfo.description,
          priority:taskinfo.priority,
          dueDate:taskinfo.dueDate? moment(taskinfo.dueDate).format("YYYY-MM-DD") : null,
          assignedTo:taskinfo?.assignedTo?.map((item)=> item?._id)||[],
          todochecklist:taskinfo.todochecklist.map((item)=> item?.text) || [],
          attachments:taskinfo.attachments || []
        }))
      }
    } catch (error) {
      console.error("Error fetching task:",error);
      
    }
  };
  //delete task function
  const deletetask = async () => {
    try {
      const res=await axiosInstance.delete(API_PATHS.TASK.DELETE_TASK(taskId));
      setopendeletealert(false)
      toast.success("Task deleted successfully");
      navigate("/admin/tasks")
    } catch (error) {
      console.error("Error deleting task:",error);
      
    } finally{
      setloading(false)
    }
  };

  useEffect(() => {
    if (taskId) {
      gettaskbyid(taskId);
    }
    return () => {};
  }
  , [taskId]);
  return (
    <DashboardLayout activemenu="Create Task">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium" >{taskId ? "update task" : "create task"}</h2>
              {taskId && (
                <button className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer" onClick={() => deletetask(true)}>
                  <LuTrash2 className=""/> Delete
                </button>
              )}
            </div>
            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600" >Task Title</label>
              <input 
              placeholder="Create App UI"
              className="form-input"
              value={taskdata.title}
              onChange={({target})=>
              handlevaluechange('title',target.value)} />
            </div>
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600 " >Description</label>
              <textarea placeholder="Describe Task" className="form-input" rows={4} value={taskdata.description} onChange={({target})=> handlevaluechange("description",target.value)} />
            </div>
            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">Priority</label>
                <SelectDropdown
                options={PRIORITY_DATA}
                value={taskdata.priority}
                onChange={(value)=> handlevaluechange('priority',value)}
                placeholder='Select Priority'
                />
              </div>
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">Due Date</label>
                <input placeholder="Create App UI" className="form-input" value={taskdata.dueDate} onChange={({target})=> handlevaluechange("dueDate",target.value)} type="date" />
              </div>
              <div className="col-span-12 md:col-span-3">
                <label className="text-xs font-medium text-slate-600" >
                  Assign To
                </label>
                
                <SelectUser selectesuser={taskdata.assignedTo}
                setselecteduser={(value)=> handlevaluechange('assignedTo',value)}/>
              </div>

            </div>
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600" >TODO Checklist</label>
              <TodoListInput todolist={taskdata?.todochecklist} settodolist={(value)=> handlevaluechange('todochecklist',value)} />
            </div>
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600" >Add Attachments</label>
              <AddAttachmentsInput attachments={taskdata?.attachments} setattachment={(value)=> handlevaluechange('attachments',value)}/>
            </div>
            {error && (
              <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
            )}
            <div className="flex justify-end mt-7">
              <button className="add-btn" onClick={handlesubmit} disabled={loading}> 
                {taskId? "UPDATE TASK":"CREATE TASK"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Model  isOpen={opendeletealert} onClose={()=> setopendeletealert(false)} title='Delete Task'>
        <DeleteAlert content='Are you sure you want to delete this task?' onDelete={()=>deletetask()}/>
      </Model>
    </DashboardLayout>
  );
};

export default CreateTask;
