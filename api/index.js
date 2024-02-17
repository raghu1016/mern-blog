import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js'
import authRotes from './routes/auth.route.js'


dotenv.config();

mongoose.connect(process.env.ConnectionURL).then(()=>{
    console.log("mongodb is connected");
}).catch(err=>{
    console.log(err);
})

const app = express();

app.use(express.json());
app.listen(3000,()=>{
    console.log('server is running on port 3000!!!!')
})

app.use('/api/user',userRoutes)
app.use('/api/auth',authRotes);

app.use((err,req,res,next)=>{
    const statuscode = err.statuscode || 500;
    const message = err.message || "Internal server error";
    res.status(statuscode).json({
        success : false,
        statuscode,
        message,
    })
})