import express from "express";
import { getUserProfile, loginUser, registerUser, updateUserProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// auth routes
router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/profile",protect,getUserProfile)
router.put('/profile',protect,updateUserProfile)

router.post('/upload-image',upload.single("image"),(req,res)=>{
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
        
    }
    const imageUrl=`http://localhost:${process.env.PORT}/uploads/${req.file.filename}`;
    res.status(200).json({
        message:'Image uploaded successfully',
        imageUrl:imageUrl
    })
})
export default router;