import {v2 as cloudinary} from 'cloudinary';
export const deleteFile = async (file_id) => {
    if(!file_id) return;
    try {
        await cloudinary.uploader.destroy(file_id);
    } catch (error) {
        console.log(error);
    }
}