import { errorhandler } from "../utils/errorhandler.js";
import Comment from "../models/comment.model.js";
export const createComment = async(req,res,next)=>{
    try{
        const {content,postId,userId} = req.body;
        console.log(req.body);

        if(userId !== req.user.id){
            return next(errorhandler(403,'You are not allowed to crate this commemt'))
        }

        const newComment = new Comment({
            content,
            postId,
            userId,
        })

        await newComment.save();
        res.status(200).json(newComment)

    }
    catch(err){
        next(err)
    }
}

export const getPostComments = async (req,res,next)=>{
    try{
        const comments = await Comment.find({postId:req.params.postId}).sort({
            createdAt:-1,
        })
        res.status(200).json(comments)
    }
    catch(err){
        next(err)
    }

}

export const likeComment  = async(req,res,next)=>{
    try{
        const comment = await Comment.findById(req.params.commentId);  
        if(!comment){
            return next(errorhandler(404,'comment not found'));
        }  
        const userIndex = comment.likes.indexOf(req.user.id);
        if(userIndex===-1){
            comment.likes.push(req.user.id);
            comment.numberOfLikes+=1;
        }
        else{
            comment.likes.splice(userIndex,1);
            comment.numberOfLikes-=1;
        }
        await comment.save();
        res.status(200).json(comment);
    }
    catch(err){
        next(err);
    }
}

export const editComment  = async(req,res,next)=>{
    try{
        const comment = await Comment.findById(req.params.commentId);  
        if(!comment){
            return next(errorhandler(404,'comment not found'));
        }  
        if(!comment.userId!==req.user.id&& !req.user.isAdmin){
            return next(errorhandler(403,'you are not allowed to edit this comment'))
        }
        const editedCommet = await Comment.findByIdAndUpdate(req.params.commentId,{
            content : req.body.content,
        },{
            new:true
        })

        await comment.save();
        res.status(200).json(editedCommet);
    }
    catch(err){
        next(err);
    }
}

export const deleteComment  = async(req,res,next)=>{
    try{
        const comment = await Comment.findById(req.params.commentId);  
        if(!comment){
            return next(errorhandler(404,'comment not found'));
        }  
        if(comment.userId!==req.user.id&& !req.user.isAdmin){
            return next(errorhandler(403,'you are not allowed to edit this comment'))
        }
        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json('comment has been deleted');
    }
    catch(err){
        next(err);
    }
}

export const getcomments = async(req,res,next)=>{
    if(!req.user.isAdmin){
        return next(errorhandler(403,'You are not allowed to get all comments'));
    }
    try{

        
        const startIndex = parseInt(req.query.startIndex)||0;
        const limit = parseInt(req.query.limit)||9;
        const sortDirection = req.query.sort==='desc'?-1:1;
        const comments = await Comment.find()
        .sort({createdAt:sortDirection})
        .limit(limit)
        .skip(startIndex);
       
        const totalComments = await Comment.countDocuments();        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(),now.getMonth()-1,now.getDate());
        const lastMonthComments = await Comment.countDocuments({createdAt : {$gte:oneMonthAgo}});
        res.status(200).json({comments,totalComments,lastMonthComments});


    }   

    catch(err){
        next(err);
    }
}