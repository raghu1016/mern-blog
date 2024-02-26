import User from "../models/user.model.js";
import { errorhandler } from "../utils/errorhandler.js";

export const test = (req,res)=>{
    
    res.json({message:'API is working'});
}

export const updateUser = async (req,res,next)=>{
    if(req.user.id!==req.params.userId){
        return next(errorhandler(403,'You are allowed to update this user'))
    }
    if(req.body.password){
        if(req.body.password.length<6){
            return next(errorhandler(400,'password must be at least 6 chararcters'))
        }
        
    }
    if(req.body.username){
       // console.log(req.body.username);

        if(req.body.username .length<7 || req.body.username.length>20){
            return next(errorhandler(400,'Username must be between 7 and 20 characters'));
        }
        if(req.body.username .includes(' ')){
            return next(errorhandler(400,'Username cannot contain spaces'));
        }
        if(req.body.username!==req.body.username.toLowerCase()){
            return next(errorhandler(400,'Username must be lowercase'));
        }
        if(!req.body.username.match(/^[a-zA-Z0-9]+$/)){
            return next(errorhandler(400,'Username can only contains letters and numbers'));
     
        }
    }

    try{
        const updateUser = await User.findByIdAndUpdate(req.params.userId,{
            $set:{
                username : req.body.username,
                email : req.body.email,
                password : req.body.password,
                profilePicture : req.body.profilePicture,
            },
            
        },{new :true})
        const {password,...rest} = updateUser._doc;
        res.status(200).json(rest);
    }
    catch(err){
        next(err);
    }
}

export const deleteUser = async (req,res,next)=>{

    if(req.user.id!=req.params.userId){
        return next(errorhandler(403,'You are not allowed to delete this user'));
    }
    try{
        const user = await User.findByIdAndDelete(req.params.userId);
        res.status(200).json('User has been deleted');
    }
    catch(err){
        return next(err);
    }

}