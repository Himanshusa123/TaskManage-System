import Task from "../models/Task.js";

// get all task
const gettasks = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status) {
      filter.status = status;
    }
    let tasks;
    if (req.user.role === "admin") {
      tasks = await Task.find(filter).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    } else {
      tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    }
    // add completed todochecklist count to each task
    tasks = await Promise.all(
      tasks.map(async (task) => {
        const completedcount = task.todochecklist.filter(
          (item) => item.completed
        ).length;
        return(
         { ...task._doc, completedtodocount: completedcount });
      })
    );
    // status summary count
    const alltasks = await Task.countDocuments(
      req.user.role === "admin" ? {} : { assignedTo: req.user._id }
    );

    const pendingtask = await Task.countDocuments({
      ...filter,
      status: "pending",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    const inprogresstask = await Task.countDocuments({
      ...filter,
      status: "progress",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    const completedtask = await Task.countDocuments({
      ...filter,
      status: "completed",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    res.json({
      tasks,
      statusSummary: {
        all: alltasks,
        pendingtask,
        inprogresstask,
        completedtask,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// get task by id
const gettaskbyid = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// create new task
const cratetask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
      todochecklist,
    } = req.body;
    if (!Array.isArray(assignedTo)) {
      return res
        .status(400)
        .json({ messge: "assignedTo must be an array of user id" });
    }
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      createdBy: req.user._id,
      attachments,
      todochecklist,
    });
    res.status(200).json({ message: "Task created successfully ", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// update task
const updatetask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.todochecklist = req.body.todochecklist || task.todochecklist;
    task.attachments = req.body.attachments || task.attachments;

    if (req.body.assignedTo) {
      if (!Array.isArray(req.body.assignedTo)) {
        return res
          .status(400)
          .json({ message: "assigned must be an array of user id" });
      }
      task.assignedTo = req.body.assignedTo;
    }

    const updatetask = await task.save();
    res.json({ message: "task updated successfully", updatetask });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// delete task
const deletetask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    await task.deleteOne();
    res.json({ message: "task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// update task status
const updatetaskstatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found " });
    }
    // Check if the user is assigned to the task or is an admin
    const isAssigned = Array.isArray(task.assignedTo) && task.assignedTo.some(
      (userId) => userId.toString() === req.user._id.toString()
    );;

    if (!isAssigned && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    task.status = req.body.status || task.status;
    if (task.status === "completed") {
      task.todochecklist.forEach((item) => (item.completed = true));
      task.progress == 100;
    }
    await task.save();
    res.json({ message: "Task status updated", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// update task checklist
const updatetaskchecklist = async (req, res) => {
  try {
    const { todochecklist } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update checklist" });
    }

    task.todochecklist = todochecklist;

    // auto update progress based on checklist completion
    const completedcount = task.todochecklist.filter(
      (item) => item.completed
    ).length;
    const totalitems = task.todochecklist.length;
    task.progress =
      totalitems > 0 ? Math.round((completedcount / totalitems) * 100) : 0;

    // auto mark task as completed if all items are checked
    if (task.progress == 100) {
      task.status = "completed";
    } else if (task.progress > 0) {
      task.status = "progress";
    } else {
      task.status = "pending";
    }

    await task.save();
    const updatedtask = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageurl"
    );
    res.json({ message: "Task checklist updated", task: updatedtask });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// dashboard data
const getDashboarddata = async (req, res) => {
  try {
    // fetch statistics
    const totaltask = await Task.countDocuments();
    const pendingtask = await Task.countDocuments({ status: "pending" });
    const completedtask = await Task.countDocuments({ status: "completed" });
    const overduetask = await Task.countDocuments({
      status: { $ne: "completed" },
      dueDate: { $lt: new Date() },
    });

    // ensure  all possible status are included
    const taskstatuses = ["pending", "progress", "completed"];
    const taskdistributionraw = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    const taskdistribution = taskstatuses.reduce((acc, status) => {
      const formattedkey = status.replace(/\$+/g, "");
      acc[formattedkey] =
        taskdistributionraw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});
    taskdistribution["All"] = totaltask;

    // ensure all priority levels are included
    const taskpriorities = ["low", "medium", "high"];
    const taskprioritylevelraw = await Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);
    const taskprioritylevel = taskpriorities.reduce((acc, priority) => {
      acc[priority] =
        taskprioritylevelraw.find((item) => item._id === priority)?.count || 0;
      return acc;
    }, {});

    // fetch recent 10 task
    const recenttask = await Task.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority duedate createdAt");

    res.status(200).json({
      statistics: {
        totaltask,
        pendingtask,
        completedtask,
        overduetask,
      },
      charts: {
        taskdistribution,
        taskprioritylevel,
      },
      recenttask,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// dashboard data user-specified
const getuserdashboarddata = async (req, res) => {
  try {
    const userId=req.params._id
    const totaltask = await Task.countDocuments({assignedTo:userId});
    const pendingtask = await Task.countDocuments({assignedTo:userId, status: "pending" });
    const completedtask = await Task.countDocuments({assignedTo:userId, status: "completed" });
    const overduetask = await Task.countDocuments({
        assignedTo:userId,
      status: { $ne: "completed" },
      dueDate: { $lt: new Date() },
    });

    // task distribution by status
    const taskstatuses=['pending','progress','completed'];
    const taskdistributionraw=await Task.aggregate([{
        $match:{assignedTo:userId}
    },{$group:{_id:"$status",count:{$sum:1}}}]);

    const taskdistribution=taskstatuses.reduce((acc,status)=>{
        const formattedkey=status.replace(/\$+/g, "");
        acc[formattedkey]=taskdistributionraw.find((item)=> item._id === status)?.count ||0;
        return acc;
    },{})
    taskdistribution["All"]=totaltask;

    // task distribution by priority
    const taskpriorities=['low','medium','high'];
    const taskprioritylevelraw=await Task.aggregate([{
        $match:{assignedTo:userId}
    },{$group:{_id:"$priority",count:{$sum:1}}}]);

    const taskprioritylevel=taskpriorities.reduce((acc,priority)=>{
        acc[priority]=taskprioritylevelraw.find((item)=>item._id===priority )?.count ||0;
        return acc;
    },{});

    // fetch recent 10 tasks for the loggedin user
    const recenttask=await Task.find({assignedTo:userId}).sort({createdAt:-1}).limit(10).select("title status priority duedate createdat ");

    res.status(200).json({
        statistics:{
            totaltask,pendingtask,completedtask,overduetask
        },
        charts:{taskdistribution,taskprioritylevel},recenttask
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export {
  gettasks,
  gettaskbyid,
  cratetask,
  updatetask,
  deletetask,
  updatetaskstatus,
  updatetaskchecklist,
  getDashboarddata,
  getuserdashboarddata,
};
