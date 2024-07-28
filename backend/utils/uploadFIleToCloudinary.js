import { v2 as cloudinary } from 'cloudinary';

export const uploadFile = async (file)=>{    
    try{
        if(!file) return;
        console.log("inside the try block in uploadfilee")
        const response = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: 'auto',
            folder: 'productImages',
        });
        console.log("cloudinary response",response);
        if(response) return {url: response.secure_url,fileId : response.public_id};

    }catch(error){
        
        console.log("Error in uploadFile middleware: ",error);
    }
};