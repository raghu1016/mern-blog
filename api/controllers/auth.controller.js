import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs' ;
import {errorhandler } from '../utils/errorhandler.js';
import jwt from 'jsonwebtoken';
export const signup = async (req,res,next)=>{
    const user = req.body;
    // console.log(user);
    if(user.username && user.email && user.password){
        // const hashpassword= bcryptjs.hashSync(user.password,10);
        // const hashuser = {...user,password:hashpassword};
        try{
            await new User(user).save();
            res.json({message:"signup successfull"})
        }
        catch(error){
            //console.log(err);
            // return res.status(500).json({message:err.message});
            next(error);
        }
        
    }
    else{
        // return res.status(400).json({message : "All fields are required " });
        next(errorhandler(400,"All fields are required"))
    }   

}

export const signin = async (req,res,next)=>{
    const {email,password} = req.body;
    // console.log(req.body);
    if(!email || !password || email==='' || password===''){
        return next(errorhandler(400,'All fields are required'))
    }
    try{
        const validUser = await User.findOne({email});
        if(!validUser){
            return next(errorhandler(404,'User not found'));
        }
        // const validpassword = bcryptjs.compareSync(password,validUser.password);
        const validpassword = (password===validUser.password);
        console.log(password+" "+validUser.password+" "+validpassword);
        if(!validpassword){
            return next(errorhandler(400,'Invalid password'))
        }

        const token = jwt.sign({id:validUser._id,isAdmin:validUser.isAdmin},process.env.JWT_SECERT);

        const {password:pass,...rest} = validUser._doc;

        res.status(200).cookie('access_token',token,{
            httpOnly:true,
    
        }).json(rest);
    }
    catch(err){
        next(err);
    }
}

export const google = async (req,res,next)=>{
    const {email,name,googlePhotoUrl} = req.body;
    //console.log(req.body);
    try{
        const user = await User.findOne({email});
        if(user){
            // console.log(user);
            const token = jwt.sign({id:user._id},process.env.JWT_SECERT);
            const {password,...rest} = user._doc;
            res.status(200).cookie('access_token',token,{
                httpOnly:true,
            }).json(rest);
        }
        else{
            const generatedPassword = Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8);

            const newUser = new User({
                username : name.toLowerCase().split(' ').join('')+Math.random().toString(9).slice(-4),
                email,
                password : generatedPassword,
                profilePicture : googlePhotoUrl,
            })
            // console.log(newUser);
            await newUser.save();
            const token = jwt.sign({id:newUser._id,isAdmin:newUser.isAdmin},process.env.JWT_SECERT);
            // const token = jwt.sign({id:validUser._id},process.env.JWT_SECERT);
            const {password,...rest} = newUser._doc;
            res.status(200).cookie('access_token',token,{
                httpOnly:true,
            }).json(rest);

        }
    }
    catch(err){
        console.log(err);
    }
}

