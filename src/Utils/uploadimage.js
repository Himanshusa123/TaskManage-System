import { API_PATHS } from "./apiPath";
import axiosInstance from "./axiosInstance";


const uploadImage = async (image) => {
    const formdata=new FormData();

    // append image file to form data
    formdata.append('image',image);
    try {
        const response=await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE,formdata,{
            headers:{
                'Content-Type':'multipart/form-data',
            }}
        );
        return response.data;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
        
    }}

    export default uploadImage