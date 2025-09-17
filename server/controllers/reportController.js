import exceljs from 'exceljs'
import Task from '../models/Task.js'
import User from '../models/User.js'

const exporttasksreport=async(req,res)=>{
    try {
        const tasks=await Task.find().populate('assignedTo','name email ')
        const workbook=new exceljs.workbook();
        const woorksheet=workbook.addWorksheet("task report");

        woorksheet.columns=[
            {header:"Task ID",key:"_id",width:25},
            {header:"Title",key:"title",width:30},
            {header:"Description",key:"description",width:50},
            {header:"Priority",key:"priority",width:15},
            {header:"Status",key:"status",width:20},
            {header:"Due Date",key:"dueDate",width:20},
            {header:"Assigned To",key:"assignedTo",width:30}
        ];

        tasks.forEach((task)=>{
            const assignedTo=task.assignedTo.map((user)=> `${user.name} (${user.email})`).join(", ");
            woorksheet.addRow({
                _id:task._id,
                title:task.title,
                description:task.description,
                priority:task.priority,
                status:task.status,
                dueDate:task.dueDate.toString().split("T")[0],
                assignedTo:assignedTo ||"unassigned"
            });
        })
        res.setHeader("Content-type","application/vnd.openxmlformats-officedocument.spreasdsheetml.sheet");
        res.setHeader("Content-Disposition",
            'attachment; filename="tasks_report.xlsx"'
        );
        return workbook.xlsx.write(res).then(()=>{
            res.end();
        })
    } catch (error) {
        res.status(500).json({message:"Error exporting tasks",error:error.message})
    }
}

const exportuserreport=async(req,res)=>{
    try {
        const users=await User.find().select("name email _id").lean();
        const usertasks=await Task.find().populate(
            "assignedTo","name email _id"
        );

        const usertaskmap={};
        users.forEach((user)=>{
            usertaskmap[user._id]={
                name:user.name,
                email:user.email,
                taskcount:0,
                pendingtasks :0,
                inProgresstask:0,
                completedtask:0,

            }
        })

        usertasks.forEach((task) => {
            if (task.assignedTo) {
                // Check if assignedTo is an array
                if (Array.isArray(task.assignedTo)) {
                    task.assignedTo.forEach((assigneduser) => {
                        // Process each assigned user
                        if (usertaskmap[assigneduser._id]) {
                            usertaskmap[assigneduser._id].taskcount += 1;
                            if (task.status === "pending") {
                                usertaskmap[assigneduser._id].pendingtasks
                                += 1;
                            } else if (task.status === "progress") {
                                usertaskmap[assigneduser._id].inProgresstask += 1;
                            } else if (task.status === "completed") {
                                usertaskmap[assigneduser._id].completedtask += 1;
                            }
                        }
                    });
                } else if (typeof task.assignedTo === 'object') {
                    // If assignedTo is an object, convert it to an array
                    const assigneduser = task.assignedTo; // This is the single user object
                    if (usertaskmap[assigneduser._id]) {
                        usertaskmap[assigneduser._id].taskcount += 1;
                        if (task.status === "pending") {
                            usertaskmap[assigneduser._id].pendingtasks += 1;
                        } else if (task.status === "progress") {
                            usertaskmap[assigneduser._id].inProgresstask += 1;
                        } else if (task.status === "completed") {
                            usertaskmap[assigneduser._id].completedtask += 1;
                        }
                    }
                } else {
                    console.error("assignedTo is not an array or object:", task.assignedTo);
                }
            }
        });
        const workbook=new exceljs.Workbook();
        const worksheet=workbook.addWorksheet("user task report")

        worksheet.columns=[
            {header:"User Name",key:"name",width:30},
            {header:"Email",key:"email",width:40},
            {header:"Total Assigned Tasks",key:"taskcount",width:20},
            {header:"Pending Tasks",key:"pendingtasks",width:20},
            {header:"Progress Tasks",key:"inProgresstask",width:20},
            {header:"Completed Tasks",key:"completedtask",width:20},
            
        ];

        Object.values(usertaskmap).forEach((user)=>{
            worksheet.addRow(user);
        })

        res.setHeader("Content-Type","application/vnd.openxmlformats-officedocument.spreadsheet")
        res.setHeader("Content-Disposition",'attachment; filename="users_report.xlsx"');

        return workbook.xlsx.write(res).then(()=>{
            res.end();
        })
    } catch (error) {
        res.status(500).json({message:"Error exporting tasks",error:error.message})
    }
}

export {exporttasksreport,exportuserreport}