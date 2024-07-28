import {Folder} from "../models/folder.model.js";
import {File} from "../models/image.model.js";
import mongoose from "mongoose";


const createFolder = async (req, res) => {

    const {folderName, parentFolder, location} = req.body;
    const {_id : userId} = req.user;
    console.log(req.body)

    try {
        const newFolder = await Folder.create({
            name: folderName,
            parentFolder: parentFolder,
            location: location,
            userId: userId,
            childrenFolders: [],
            childrenFiles: []
        });
        const parent = await Folder.findById(parentFolder);
        if(!parent){
            console.log('parent not found')
        }
        parent.childrenFolders.push(newFolder._id);
        await parent.save();
        return res.status(201).json(newFolder);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

const getFolders = async (req, res) => {
    const {_id : userId} = req.user;
    
    try {
        const parentFolder = req.params.parentFolder;
        const folders = await Folder.find({userId: userId, _id: parentFolder ? new mongoose.Types.ObjectId(parentFolder) : { $exists: false }}).populate("childrenFolders").populate("childrenFiles").exec();
        console.log(folders)
        res.status(200).json(folders);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message});
    }
}

const deleteFolder = async (req, res) => {
    const {_id : userId} = req.user;
    const folderId = req.params.folderId;
    try {
        const folder = await Folder.findById(folderId);
        if (folder.userId.toString() !== userId.toString()) {
            return res.status(404).json({message: "Folder not found"});
        }
        if(folder.childrenFiles.length > 0 || folder.childrenFolders.length > 0){
            return res.status(400).json({message: "Folder has nested folders, please delete them first"});
        }
        await Folder.findByIdAndDelete(folderId);
        await File.deleteMany({folder : folderId});
        res.status(200).json({message: "Folder deleted successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const updateFolder = async (req, res) => {
    const {_id : userId} = req.user;
    const folderId = req.params.folderId;
    const {name} = req.body;
    try {
        const folder = await Folder.findById(folderId);
        if (folder.userId.toString() !== userId.toString()) {
            return res.status(404).json({message: "Folder not found"});
        }
        folder.name = name;
        await folder.save();
        res.status(200).json(folder);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export {createFolder, getFolders, deleteFolder, updateFolder};