import jwt from 'jsonwebtoken';
import {errorhandler} from './errorhandler.js'
export const verifyToken = (req,res,next)=>{
    const token = req.cookies.access_token;
    if(typeof token==='undefined' || token===null){
        return next(errorhandler(401,'Unauthorized'));
    }
    jwt.verify(token,process.env.JWT_SECERT,(err,user)=>{
        if(err){
            return next(errorhandler(401,'Unauthorized'));
        }
        req.user=user;
        console.log(user);
        next();
    })
}