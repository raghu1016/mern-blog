import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'
import postRoutes from './routes/post.route.js'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';


dotenv.config();

mongoose.connect(process.env.ConnectionURL).then(()=>{
    console.log("mongodb is connected");
}).catch(err=>{
    console.log(err);
})


const app = express();
app.use(cookieParser());
app.use(cors());


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.listen(3000,()=>{
    console.log('server is running on port 3000!!!!')
})

app.use('/api/user',userRoutes)
app.use('/api/auth',authRoutes);
app.use('/api/post',postRoutes);


app.use((err,req,res,next)=>{
    const statuscode = err.statuscode || 500;
    const message = err.message || "Internal server error";
    res.status(statuscode).json({
        success : false,
        statuscode,
        message,
    })
    // console.log(res);
})