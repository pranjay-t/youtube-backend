import {v2 as cloudinary} from "cloudinary";
import fs from "fs";


const uploadOnCloudinary = (localFilePath)=>{
    try {
        if(!localFilePath) return null;

        //upload on cloudinary

        const response = cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        console.log('File has been uploaded successfully', response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.log('Failed to upload a file', error);
        return null;
    }

}

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});