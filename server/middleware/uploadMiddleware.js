import multer from "multer";

// configure storage
const Storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/")
    },
    filename:(req,file,cb)=>{
        cb(null,`${Date.now()}-${file.originalname}`)
    }
    })

    // file filter 

    const fileFilter=(req,file,cb)=>{
        const allowedTypes=['image/png','image/jpg','image/jpeg']
        if(allowedTypes.includes(file.mimetype)){
            cb(null,true)
        }else{
            cb(new Error('Invalid file type'),false)
        }
    }

    const upload=multer({
        storage:Storage,
       
        fileFilter:fileFilter
    })

    export default upload