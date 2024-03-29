import React,{useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {Label,TextInput,Button, Alert,Spinner}  from 'flowbite-react'
import OAuth from '../components/OAuth.jsx';

export default function SignUp() {
 const [formData,setFormData] = useState({});
 const [errorMessage,setErrorMessage] = useState();
 const [loading,setLoading] = useState(false);
 const navigate = useNavigate();
  const handlechange =(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value.trim()});
  }
  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(!formData.username || !formData.password || !formData.email){
      return setErrorMessage('Enter All fields');
    }
    try{
      setLoading(true);
      setErrorMessage(null);
      console.log(JSON.stringify(formData))
      const res = await fetch('/api/auth/signup',{
        method : 'POST',
        headers :{'Content-Type':'application/json'},
        body : JSON.stringify(formData)
      });
      const data = await res.json();
      setLoading(false);
      if(data.success===false){
        return setErrorMessage(data.message);
      }
      if(res.ok){
        navigate('/sign-in');
      }
    }
    catch(err){
      setLoading(false);
      setErrorMessage(err.message);
      
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

              </p>
          </Link>
        </div>
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit = {handleSubmit}>
            <div>
              <Label value = "Your username"/>
              <TextInput
                type = "text" placeholder = "username"
                id = "username"
                onChange = {handlechange}
              />
            </div>
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
               ) : 'Sign Up'
              }
            </Button>
            <OAuth/>
          </form>
          <div className= 'flex gap-2 text-sm mt-5'>
            <span>Have an account</span>
            <Link to = "/sign-in" className = 'text-blue-500'>
              Sign In 
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
