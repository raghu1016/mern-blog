
import { Alert, Button, Modal, ModalBody, TextInput } from "flowbite-react";
import {  useSelector,useDispatch } from "react-redux"
import { useState,useRef,useEffect} from "react";
import {getStorage, ref,uploadBytesResumable,getDownloadURL} from 'firebase/storage'
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {updateStart,updateSuccess,updateFailure,deleteStart,deleteSuccess,deleteFailure} from '../Redux/user/userSlice.js'
import {HiOutlineExclamationCircle} from 'react-icons/hi'
export default function DashProfile() {
    const {currentUser,loading,error} = useSelector((state)=>state.user);
    const [imageFile,setImageFile] = useState(null);
    const [imageFileUrl ,setImageFileUrl] = useState(null);
    const [imageFileUploadProgress,setimageFileUploadProgress] = useState(0);
    const [imageFileUploadError,setimageFileUploadError] = useState(null);
    const [imageFileUploading,setImageFileUploading] = useState(false);
    const [userProfileUpdated,setUserProfileUpdated] = useState(null);
    const [showModal ,setShowModal] = useState(false);

    const [formData,setFormData] = useState({});
    const filePickerRef = useRef();
    const dispatch = useDispatch();
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
        setImageFileUploading(true);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        //console.log(imageFile.name);
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
                setImageFileUploading(false);

            },
            ()=>{
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                        setImageFileUrl(downloadURL);
                        setFormData({...formData,profilePicture:downloadURL})
                })
                setImageFileUploading(false);

            }
        )
    }

    const handleChange = (e)=>{
        setFormData({...formData,[e.target.id]:e.target.value});
    }
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setUserProfileUpdated(null);
        if(Object.keys(formData).length===0){
            setUserProfileUpdated('Not Updated')   
            return;
        }
        if(imageFileUploading){
            setUserProfileUpdated('Not Updated')   
            return ;
        }
        try{
            dispatch(updateStart());
            //console.log(formData)
            const res = await fetch(`/api/user/update/${currentUser._id}`,{
                method :'PUT',
                headers :{
                    'Content-Type':'application/json',
                },
                body : JSON.stringify(formData),
            })

            const data = await res.json();
            //console.log(data);
            if(!res.ok){
                setUserProfileUpdated(data.message); 
                return dispatch(updateFailure(data.message));
                  

            }
            else{
                setUserProfileUpdated('User profile Updated successfully ');
                return dispatch(updateSuccess(data));
                
            }
        }
        catch(error){
            setUserProfileUpdated(error.message);
            return dispatch(updateFailure(error.message));
            

        }

    }

    const handleDeleteUser = async ()=> {
        setShowModal(false);
        try{
            dispatch(deleteStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`,{
                method :'DELETE',
                
            })
            const data = res.json();
            if(!res.ok){
                dispatch(deleteFailure(date.message));
            }
            else{
                dispatch(deleteSuccess(data));
            }
        }
        catch(err){
            dispatch(deleteFailure(err.message))
        }
    }
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
        <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
        <form onSubmit = {handleSubmit} className="flex flex-col gap-4">
            <input type = "file" accept="image/*" onChange = {handleImageChange} ref={filePickerRef} hidden/>
            <div className="relative w-32 h-32 self-center  cursor-pointer shadow-md overflow =hidden rounded-full" onClick = {()=>filePickerRef.current.click()}>
            {imageFileUploadProgress && (
                <CircularProgressbar value={imageFileUploadProgress||0 } text={`${imageFileUploadProgress}%`}
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
            <TextInput type = 'text' id = 'username' placeholder="username" defaultValue={currentUser.username} onChange= {handleChange}></TextInput>
            <TextInput type = 'email' id = 'email' placeholder="email" defaultValue={currentUser.email} onChange= {handleChange}></TextInput>
            <TextInput type = 'password' id = 'password' placeholder="password" onChange= {handleChange}></TextInput>
            {!loading && <Button type = 'submit' gradientDuoTone='purpleToBlue' outline >
                Update
            </Button>}
            <div className="text-red-500 flex justify-between mt-5">
                <span className="cursor-pointer" onClick={()=>setShowModal(true)}>Delete Account</span>
                <span className="cursor-pointer">Sign out</span>
            </div>
            {userProfileUpdated  && <Alert color = {userProfileUpdated.includes('successfully')?'success':'failure'}>
                {userProfileUpdated}
                </Alert>}
                {error  && <Alert color = 'failure'>
                {error}
                </Alert>}  

            <Modal show={showModal} onClose = {()=>setShowModal(false)} popup size='md'>
                <Modal.Header/>
                <ModalBody>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:rexr-gray-200 mb-4 mx-auto"/>
                        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete your account?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color = 'failure' onClick = {handleDeleteUser}>
                                Yes, I'am sure
                            </Button>
                            <Button color = 'gray' onClick={()=>setShowModal(false)}>
                                No, Cancel
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </form>

    </div>
  )
}
