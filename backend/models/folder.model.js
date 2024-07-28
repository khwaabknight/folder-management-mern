import mongoose, {Schema} from "mongoose";

const folderSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    parentFolder: {
        type: Schema.Types.ObjectId,
        ref: "Folder"
    },
    location: {
        type: String,
        required: true,
    },
    childrenFolders: [
        {
            type: Schema.Types.ObjectId,
            ref: "Folder"
        }
    ],
    childrenFiles: [
        {
            type: Schema.Types.ObjectId,
            ref: "File"
        }
    ],
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true});

export const Folder = mongoose.model("Folder", folderSchema);
