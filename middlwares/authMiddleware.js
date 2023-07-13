import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js";
 export const authenticateUser=async(req,res,next)=>{
    try {
      
        const token=req.headers.authorization;
        console.log(token);
        const data=  jwt.verify(token,process.env.JWT_SECRET);
        const fullData=await userModel.findOne({_id:data._id});
        req.user=fullData;
        next();
    } catch (error) {
        console.log("authentication failed")
        next("Authentication  Failed")
    }
}