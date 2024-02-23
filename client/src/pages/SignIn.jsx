import React,{useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {Label,TextInput,Button, Alert,Spinner}  from 'flowbite-react'
import { useDispatch ,useSelector} from 'react-redux'
import {signInStart,signInSuccess,signInFailure} from "../Redux/user/userSlice"
import OAuth from '../components/OAuth'

export default function SignIn() {
 const [formData,setFormData] = useState({});
 const {loading,error:errorMessage} = useSelector(state=>state.user);
 const navigate = useNavigate();
 const dispatch = useDispatch();
  const handlechange =(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value.trim()});
  }
  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(!formData.password || !formData.email){
      return dispatch(signInFailure('please fill all the fields'));
    }
    try{
      dispatch(signInStart());
      console.log(JSON.stringify(formData))
      const res = await fetch('/api/auth/signin',{
        method : 'POST',
        headers :{'Content-Type':'application/json'},
        body : JSON.stringify(formData)
      });
      const data = await res.json();
      dispatch(signInFailure());
      if(data.success===false){
        return dispatch(signInFailure(data.message));
      }
      if(res.ok){
        dispatch(signInSuccess(data));
        navigate('/');
      }
    }
    catch(err){
      dispatch(signInFailure(err.message));
    }
    
  }
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        <div className='flex-1'>
          <Link to ="/" className=' font-semibold dark:text-white text-4xl'>
              <span className='px-2 py-1 bg-gradient-to-r  from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
                  Dhanraj's
              </span>
              Blog
              <p className='text-sm mt-5'>
                This is a demo project. you can sign in with you email and password
              </p>
          </Link>
        </div>
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit = {handleSubmit}>
            <div>
              <Label value = "Your email"/>
              <TextInput
                type = "text" placeholder = "email"
                id = "email"
                onChange = {handlechange}
              />
            </div>
            <div>
              <Label value = "Your password"/>
              <TextInput
                type = "text" placeholder = "password"
                id = "password"
                onChange = {handlechange}
              />
            </div>
            <Button gradientDuoTone = 'purpleToPink' type = 'submit' disabled={loading}>
              {loading ? (
                 <>
                 <Spinner size = 'sm'/>
                 <span className ='pl-3'>Loading...</span>
                 </>
               ) : 'Sign In'
              }
            </Button>
            <OAuth/>
          </form>
          <div className= 'flex gap-2 text-sm mt-5'>
            <span>Dont have an account</span>
            <Link to = "/sign-up" className = 'text-blue-500'>
              Sign Up
            </Link>
          </div>
        </div>
        {errorMessage && 
        <Alert className='mt-5' color='failure'>
            {errorMessage}
          </Alert>}
      </div>
    </div>
  )
}
