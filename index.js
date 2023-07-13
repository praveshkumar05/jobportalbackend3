// common js ( const express =require("express");) is  replced fwith module base approach means import  syntax
//package import
import express from "express"
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
// security packages
import helmet from 'helmet'
import xss from 'xss-clean'
import mongoSanitize from  'express-mongo-sanitize'

//file import
import { connectDB } from "./config/db.js"
import testRoutes from "./routes/testRoutes.js"
import authRoutes from './routes/authRoutes.js'
import errorMiddleware from "./middlwares/errorMiddleware.js"
import userRoutes from "./routes/userRoutes.js"
import jobRoutes from "./routes/jobRoutes.js"
//config dotenv

dotenv.config();



//rest object
const app=express();
app.use(express.json());
app.use(cors());
 app.use(morgan('dev'));

// secuity packages uses
 app.use(helmet());
 app.use(xss());
app.use(mongoSanitize());
// routes
app.use('/api/v1/test',testRoutes);
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/user',userRoutes);
app.use('/api/v1/job',jobRoutes);

//

// validation middleware
app.use(errorMiddleware);

//connect databse
connectDB();


// 
const PORT=process.env.PORT||8080
app.listen(PORT,()=>{
    console.log(`port is running in ${process.env.DEV_MODE} mode  on port 8080 thank`);
})