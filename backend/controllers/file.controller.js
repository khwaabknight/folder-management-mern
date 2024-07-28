import { File } from "../models/image.model.js";
import { uploadFile } from "../utils/uploadFIleToCloudinary.js";
import { deleteFile as deleteFileFromCloudinary } from "../utils/deleteFileFromCloudinary.js";  
import { Folder } from "../models/folder.model.js";

const createFile = async (req, res) => {

    const { filename, parentFolder } = req.body;
    const { _id: userId } = req.user;

    try {

        //uploading image
        const file = req.files ? (Array.isArray(req.files.file) ? req.files.file[0] : req.files.file) : null;
        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const imageResponse = await uploadFile(file);
        if(!imageResponse) return res.status(500).json({message : "Error in uploading image"});
        const {url:imageUrl,fileId} = imageResponse;

        //creating File object in db
        if([filename,parentFolder,imageUrl,fileId].some((field) => field?.trim() === "") || !imageUrl || !fileId){
            return res.status(400).json({ message: "Filename is required" });
        }
        const newFile = await File.create({
            filename: filename,
            imageUrl: imageUrl,
            parentFolder: parentFolder,
            userId: userId,
            cloudinaryFileId: fileId
        });

        const parent = await Folder.findById(parentFolder);
        parent.childrenFiles.push(newFile._id);
        await parent.save();

        return res.status(201).json(newFile);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });
    }
};

const deleteFile = async (req, res) => {
    const { _id: userId } = req.user;
    const fileId = req.params.fileId;
    try {
        const file = await File.findById(fileId);
        if (file.userId.toString() !== userId.toString()) {
            return res.status(404).json({ message: "File not found" });
        }
        await deleteFileFromCloudinary(file.cloudinaryFileId);
        await File.findByIdAndDelete(fileId);
        res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateFile = async (req, res) => {
    const { _id: userId } = req.user;
    const fileId = req.params.fileId;
    const { filename } = req.body;
    try {
        const file = await File.findById(fileId);
        if (file.userId.toString() !== userId.toString()) {
            return res.status(404).json({ message: "File not found" });
        }
        if (filename.trim() === "") {
            return res.status(400).json({ message: "Filename is required" });
        }
        file.filename = filename;
        await file.save();
        res.status(200).json(file);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const searchFiles = async (req,res) => {
    const { _id: userId } = req.user;
    const { query } = req.params;
    try {
        const files = await File.find({ userId: userId, filename: { $regex: query, $options: "i" } });
        return res.status(200).json(files);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    
}

export { createFile, deleteFile, updateFile, searchFiles };