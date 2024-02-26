import {errorhandler} from '../utils/errorhandler.js'
import Post from '../models/post.model.js'

export const create = async (req,res,next)=>{
    console.log(req.user);
    if(!req.user.isAdmin){
        return next(errorhandler(403,'You are not allowed to create a post'))
    }

    if( !req.body.tittle || !req.body.content){
        return next(errorhandler(400,'Please provide all required fields'));
    }

    const slug = req.body.tittle.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9]/g,'-');
    const newPost = new Post ({
        ...req.body,
        slug,userId:req.user.id
    })

    try{
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    }
    catch(err){
        console.log(err);
    }
}
