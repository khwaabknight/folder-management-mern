import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import api from "@/utils/axiosConfig";
import { TbArrowBack } from "react-icons/tb";

import { FolderType } from "@/types/types";
import AddFileOrFolder from "./AddFileOrFolder";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";



function FolderDisplay() {
    const [folders, setFolders] = useState<FolderType[]>([]);
    const [files, setFiles] = useState([]);
    const [currentDirectory, setCurrentDirectory] = useState<FolderType | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const {user} = useSelector((state:RootState) => state.user)

    const getFoldersUsingId = (folderId: string | undefined) => {
        api.get(`/api/v1/folders/${folderId ?? ""}`).then(response => {
            console.log(response)
            setCurrentDirectory(response.data[0]);
            setFolders(response.data[0].childrenFolders);
            setFiles(response.data[0].childrenFiles);
        }).catch(error => {
            console.log('Error fetching folders: ', error);
        })
    }
    useEffect(() => getFoldersUsingId(user?.rootFolder), []);
    const handleFolderClick = (folder: FolderType) => {
        console.log(folder)
        getFoldersUsingId(folder._id)
    }
    const handleBackClick = () => {
        if(currentDirectory?.location === '/') return
        getFoldersUsingId(currentDirectory?.parentFolder)
    }

    const searchFiles = (e:any) => {
        e.preventDefault();
        api.get(`/api/v1/files/${searchQuery}`).then(response => {
            console.log(response)
            setFolders([]);
            setFiles(response.data)
        }).catch(error => {
            console.log('Error fetching files: ', error);
        })
    }

  return (
    <section className="border rounded-lg border-gray-300 bg-white flex justify-between items-center py-5 px-8 gap-3">
        <div className="flex flex-col items-center gap-10 w-full">
            <div className="w-full">
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex items-stretch justify-center gap-2 w-full">
                        <AddFileOrFolder 
                            currentDirectory={currentDirectory as FolderType}
                            getFoldersUsingId={getFoldersUsingId}
                        />                    
                        <div>
                            <Button 
                                type="button"
                                variant={'outline'}
                                className="text-base leading-3 h-full"
                                onClick={handleBackClick}
                                >
                                <TbArrowBack size={24} className=" text-gray-600"/>
                            </Button>
                        </div>
                        <div className="border border-slate-200 rounded-md px-4 py-2 flex items-center w-full">
                            <p className="text-gray-600 font-bold text-lg">@{currentDirectory?.location}</p>
                        </div>
                    </div>                
                    <form onSubmit={searchFiles} className="flex gap-3">
                        <input 
                            type="text" 
                            className="w-full border border-gray-200 rounded-lg p-2 pl-5"
                            placeholder="Search files"
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div>
                            <Button type="submit" className="h-full">Search</Button>
                        </div>
                    </form>
                </div>
                <p className="w-full text-end px-2">{(currentDirectory?.childrenFiles.length ?? 0) + (currentDirectory?.childrenFolders.length ?? 0)} items found</p>
            </div>
            <div className="w-full">
                <div className="flex flex-wrap gap-2">
                    {folders.map((folder: FolderType) => (
                        <button onClick={() => handleFolderClick(folder)} key={folder._id} className="border border-gray-200 rounded-lg p-2 flex flex-col items-center gap-2 aspect-square">
                            <div className="w-24 h-24 aspect-square overflow-hidden rounded-full p-2">
                                <img src="/images/folder.jpg" alt="" />
                            </div>
                            <div>
                                <p className="text-gray-800 font-bold">{folder.name}</p>
                                <p className="text-gray-400 text-sm">{folder.childrenFiles.length + folder.childrenFolders.length} items</p>
                            </div>
                        </button>
                    ))}
                    {files.map((file: any) => (
                        <Dialog key={file._id}>
                            <DialogTrigger asChild>
                                <button className="border border-gray-200 rounded-lg p-2 flex flex-col items-center gap-2">
                                    <div className="w-24 h-24 aspect-square overflow-hidden rounded-full bg-gray-200">
                                        <img src={file.imageUrl} alt="" />
                                    </div>
                                    <div>
                                        <p className="text-gray-800 font-bold">{file.filename}</p>
                                        <p className="text-gray-400 text-sm">{file.size} bytes</p>
                                    </div>
                                </button>
                            </DialogTrigger>
                            <DialogContent>
                                <div className="w-full">
                                    <img src={file.imageUrl} alt="" className="w-full"/>
                                </div>
                            </DialogContent>
                        </Dialog>
                    ))}
                </div>
            </div>
        </div>
    </section>
  )
}

export default FolderDisplay