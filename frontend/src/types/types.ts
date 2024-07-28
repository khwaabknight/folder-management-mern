export type FolderType = {
    _id: string;
    name: string;
    parentFolder?: string;
    location: string;
    childrenFolders: string[];
    childrenFiles: string[];
    userId: string;
    createdAt: string;
    updatedAt: string;
}