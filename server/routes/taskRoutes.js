import express from "express";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { cratetask, deletetask, getDashboarddata, gettaskbyid, gettasks, getuserdashboarddata, updatetask, updatetaskchecklist, updatetaskstatus } from "../controllers/taskController.js";

const router=express.Router()

router.get("/dashboard-data",protect,getDashboarddata)
router.get("/user-dashboard-data/:id",protect,getuserdashboarddata)
router.get("/",protect,gettasks)
router.get("/:id",protect,gettaskbyid)
router.post("/",protect,adminOnly,cratetask)
router.put("/:id",protect,updatetask)
router.delete("/:id",protect,adminOnly,deletetask)
router.put("/:id/status",protect,updatetaskstatus)
router.put("/:id/todo",protect,updatetaskchecklist)

export default router