import { IoAddCircleOutline } from "react-icons/io5";
import {Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,DialogTrigger} from "@/components/ui/dialog"
import {Tabs,TabsContent,TabsList,TabsTrigger,} from "@/components/ui/tabs";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import api from "@/utils/axiosConfig";
import { FolderType } from "@/types/types";
import { useState } from "react";

interface AddFileOrFolderProps {
    currentDirectory: FolderType;
    getFoldersUsingId: (folderId: string | undefined) => void;
}

function AddFileOrFolder({currentDirectory, getFoldersUsingId}: AddFileOrFolderProps) {

    const [formData, setFormData] = useState({
        filename: '',
        folderName: '',
    })
    const [file, setFile] = useState<File | null>(null);

    const changeImage = (e:any) => {
        const file = e.target.files[0];
        console.log(file)
        if (file) {
            setFile(file);
        }
    }

    const changeHandler = (e:any) => {
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        })
    }
    
    const handleAddFile = () => {
        const formdata = new FormData();
        formdata.append('filename',formData.filename)
        formdata.append('folderName',formData.folderName)
        formdata.append('parentFolder',currentDirectory._id)
        if(file) {
            formdata.append('file',file)
        }


        console.log(formdata)
        api.post('/files',formdata).then(response => {
            console.log('File added: ', response);
            getFoldersUsingId(currentDirectory?._id);
        }).catch(error => {
            console.log('Error adding file: ', error);
        })
    }

    const handleAddFolder = () => {
        api.post('/folders',{
            ...formData,
            parentFolder:currentDirectory._id,
            location: currentDirectory?.location + formData.folderName + '/',
        }).then(response => {
            console.log('Folder added: ',response);
            getFoldersUsingId(currentDirectory?._id);
        }).catch(error => {
            console.log('Error adding folder: ', error);
        })
    }

  return (
    <form>
        <Dialog>
            <DialogTrigger asChild>
            <Button
                type="button"
                variant={'outline'}
                className="text-base leading-3 h-full text-gray-600"
            >
                <IoAddCircleOutline size={24} className=" text-gray-600"/>
            </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add File or Folder</DialogTitle>
                    <DialogDescription>
                        Fill the details to add file or folder
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="File" className="w-[400px]">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="File">File</TabsTrigger>
                        <TabsTrigger value="Folder">Folder</TabsTrigger>
                    </TabsList>
                    <TabsContent value="File">
                        <div className="flex flex-col gap-4">
                            <Label>
                                <p>File Name</p>
                                <Input 
                                    type="text" 
                                    placeholder="Enter file name" 
                                    name="filename"
                                    id="filename"
                                    className="mt-1"
                                    value={formData.filename}
                                    onChange={changeHandler}
                                />
                            </Label>
                            <Label>
                                <p>Add Image</p>
                                <Input 
                                    type="file" 
                                    className="mt-1" 
                                    accept="image/*"
                                    onChange={changeImage}
                                />
                            </Label>
                            <DialogFooter>
                                <Button 
                                    variant="default"
                                    onClick={handleAddFile}
                                >Add File</Button>
                            </DialogFooter>
                        </div>
                    </TabsContent>
                    <TabsContent value="Folder">
                        <div className="flex flex-col gap-4">
                            <Label>
                                <p>Folder Name</p>
                                <Input 
                                    type="text" 
                                    placeholder="Enter folder name" 
                                    name="folderName"
                                    id="folderName"
                                    className="mt-1"
                                    value={formData.folderName}
                                    onChange={changeHandler}
                                />
                            </Label>
                            <DialogFooter>
                                <Button 
                                    variant="default"
                                    onClick={handleAddFolder}
                                >Add Folder</Button>
                            </DialogFooter>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
        
    </form>
  )
}

export default AddFileOrFolder