import express from 'express';
import {protect,adminOnly} from "../middleware/authMiddleware.js"
import { exporttasksreport, exportuserreport } from '../controllers/reportController.js';
const router=express.Router();

router.get("/export/tasks",protect,adminOnly,exporttasksreport);
router.get("/export/users",protect,adminOnly,exportuserreport)

export default router