import { Table ,Modal,Button} from 'flowbite-react';
import React from 'react'
import { useEffect,useState } from 'react'
import {useSelector} from 'react-redux';
import { Link } from 'react-router-dom';
import {HiOutlineExclamationCircle} from 'react-icons/hi'
import {FaCheck,FaTimes} from 'react-icons/fa'



export default function DashComments() {
  const {currentUser} = useSelector((state)=>state.user)
  const [comments,setComments] = useState([])
  const [showMore,setShowMore] = useState(true);
  const [showModal,setShowModal] = useState(false);
  const [commentIdToDelete,setCommentIdToDelete] = useState('');

  useEffect(()=>{
    const fetchComments = async ()=>{
      try{
        const res = await fetch(`/api/comment/getcomments`)
        const data = await res.json()
        if(res.ok){
          setComments(data.comments);
          if(data.comments.length<9){
            setShowMore(false);
          }
        }
      }
      catch(error){
        console.log(error.message);
      }
    }
    if(currentUser.isAdmin){
      fetchComments();
    }
    
  },[currentUser._id])

  const handleShowMore = async ()=>{
    const startIndex = comments.length;

    try{
      const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`)
      const data = await res.json();
      if(res.ok){
        setComments((prev)=>{
            [...prev,...data.comments]
        })
        if(data.comments.length<9){
          setShowMore(false);
        }
      }
    }
    catch(err){

    }
  }

  

  const handleDeleteComment= async()=>{
    setShowModal(false);
    try{
      const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method :'DELETE'
        }
      )
      const data = res.json();
      console.log(data);
      if(!res.ok){
        console.log(data.message);
      }
      else{
        setComments((prev)=>prev.filter((comment)=>comment._id!==commentIdToDelete))
      }
    }
    catch(err){
      console.log(err.message);
    }
  }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-thumb-slate-300 scrollbar-track-slate-100 dark:scrollbar-track-slate-700 dark:thumb-slate-500'>
      {currentUser.isAdmin && comments.length>0 ?(
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
            <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Number of Likes</Table.HeadCell>
              <Table.HeadCell>PostID</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comments.map((comment)=>(
              <Table.Body className='divide-y' key = {comment._id}>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                      {comment.content}

                  </Table.Cell>
                  <Table.Cell>
                        {comment.numberOfLikes}
                  </Table.Cell>
                  <Table.Cell>
                  {comment.postId}
                  </Table.Cell>
                  <Table.Cell>
                  {comment.userId}
                  </Table.Cell>
                  <Table.Cell>
                      <span onClick={()=>{
                        setShowModal(true),
                        setCommentIdToDelete(comment._id)}}  
                        className='font-medium text-red-500 hover:underline cursor-pointer'>
                        Delete
                      </span>
                  </Table.Cell>
                  {/* <Table.Cell>
                    <Link className='text-teal-500 hover:underline' to={`/update-post/${comment._id}`}>
                      <span>
                        Edit
                      </span>
                    </Link>
                  </Table.Cell> */}

                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && <button className = "w-full text-teal-500 self-center text-sm py-7" onclick = {handleShowMore}>
              ShowMore
            </button>}

            <Modal show={showModal} onClose = {()=>setShowModal(false)} popup size='md'>
                <Modal.Header/>
                <Modal.Body>
                    <div className="text-center">

                        <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:rexr-gray-200 mb-4 mx-auto"/>
                        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this comment?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color = 'failure' onClick = {handleDeleteComment}>
                                Yes, I'am sure
                            </Button>
                            <Button color = 'gray' onClick={()=>setShowModal(false)}>
                                No, Cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
      ):(
        <p>You have no comments yet</p>
      )}
    </div>
  )
}