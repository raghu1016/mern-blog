
import { Alert, Button, TextInput } from "flowbite-react";
import {  useSelector } from "react-redux"
import { useState,useRef,useEffect} from "react";
import {getStorage, ref,uploadBytesResumable,getDownloadURL} from 'firebase/storage'
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function DashProfile() {
    const {currentUser} = useSelector((state)=>state.user);
    const [imageFile,setImageFile] = useState(null);
    const [imageFileUrl ,setImageFileUrl] = useState(null);
    const [imageFileUploadProgress,setimageFileUploadProgress] = useState(0);
    const [imageFileUploadError,setimageFileUploadError] = useState(null);
    const [formData,setFormData] = useState({});
    const filePickerRef = useRef();

    const handleImageChange = (e) =>{
        const file = e.target.files[0];
        if(file){
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
        
    }
    useEffect(()=>{
        if(imageFile){
            uploadImage();
        }
    },[imageFile])

    const uploadImage = async ()=>{
        // service firebase.storage {
        //     match /b/{bucket}/o {
        //       match /{allPaths=**} {
        //         allow read;
        //         allow write: if
        //         request.resource.size < 5 *1024*1024 &&
        //         request.resource.contentType.matches('image/.*')
        //       }
        //     }
        //   }
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        console.log(imageFile.name);
        const storageRef = ref(storage,fileName);4
        const uploadTask = uploadBytesResumable(storageRef,imageFile);
        uploadTask.on(
            'state_changed',
            (snapshot)=>{
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes)*100;
                setimageFileUploadProgress(progress.toFixed(0));
            },
            (error)=>{
                setimageFileUploadError('Could not upload image');
                setimageFileUploadProgress(null);
                setImageFile(null);
                setImageFileUrl(null);
            },
            ()=>{
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                        setImageFileUrl(downloadURL);
                        setFormData({...formData,profilePicture:downloadURL})
                })
            }
        )
    }

    const handleChange = (e)=>{
        setFormData({...formData,[e.target.id]:e.target.value});
    }
    console.log(formData);
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
        <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
        <form className="flex flex-col gap-4">
            <input type = "file" accept="image/*" onChange = {handleImageChange} ref={filePickerRef} hidden/>
            <div className="relative w-32 h-32 self-center shadow-md overflow =-hidden rounded-full" onClick = {()=>filePickerRef.current.click()}>
            {imageFileUploadProgress && (
                <CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`}
                strokeWidth={5}
                styles = {{
                    root:{
                        width:'100%',
                        height:'100%',
                        position : 'absolute',
                        top:0,
                        left:0,
                    },
                    path:{
                        stroke :`rgba(62,152,199,${imageFileUploadProgress/100})`,
                    },
                }}
                />
            )}
            <img src = {imageFile?imageFileUrl :currentUser.profilePicture} 
            alt="user" 
            className ={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress <100 && 'opacity-60'}`}/>

            </div>

            {imageFileUploadError && <Alert color='failure'>
                {imageFileUploadError}
            </Alert>}
            <TextInput type = 'text' id = 'username ' placeholder="username" defaultValue={currentUser.username} onChange= {handleChange}></TextInput>
            <TextInput type = 'email' id = 'email ' placeholder="email" defaultValue={currentUser.email} onChange= {handleChange}></TextInput>
            <TextInput type = 'password' id = 'password ' placeholder="password" onChange= {handleChange}></TextInput>
            <Button type = 'submit' gradientDuoTone='purpleToBlue' outline >
                Update
            </Button>
            <div className="text-red-500 flex justify-between mt-5">
                <span className="cursor-pointer">Delete Account</span>
                <span className="cursor-pointer">Sign out</span>
            </div>
        </form>

    </div>
  )
}
