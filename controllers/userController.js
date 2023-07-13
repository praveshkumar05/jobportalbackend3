import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import { hashPassword, verifyPassword } from "../utils/hashPassword.js";


const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"praveshkumar1062002@gmail.com",
        pass:"yqdiibfirtxndqnb"
        
    }
})
export const registerController=async(req,res,next)=>{
    try {
        const {fname,lname,email,phone,password,location}=req.body;
        console.log(req.body);
        if(!fname)
        {
           return  next("Please provide the the first name");
        }
        else if(!email)
        {
           return  next("Please provide the  email");
        }
        else if(!password)
        {
           return   next("Please provide the password");
        }
        else if(!phone)
        {
           return  next("Please provide the Phone ");
        }
        const userfind=await userModel.findOne({email});
        if(!userfind){
            const hash=await hashPassword(password);
            const userData=new userModel({fname,lname,email,password:hash,location,phone});
            await userData.save();
            return res.status(201).send({
                message:"You Are Registered",
                success:true,
                user:{
                    fname:userData.fname,
                    lname:userData.lname,
                    email:userData.email,
                    phone:userData.phone,
                    location:userData.location,
                }
             })
        }
        else{
          return  next("user already exist");
        }  
    } catch (error) {
        console.lor(error);
      return  next(error);
    }
}
export const loginController=async(req,res,next)=>{
    try {
        const {email,password}=req.body;
         
        if(!email||!password){
           return next("please provide correct email and password")
        }
        const userExist=await userModel.findOne({email});
        if(!userExist)
        {
           return next(`user with ${email} not exist please register first`)
        }
        const hashedPassword=userExist.password;
        const verify=await verifyPassword(password,hashedPassword);
        if(!verify)
        {
           return next(`either email id or password is Incorrect `);
        }
        else{
            const token=jwt.sign({_id:userExist._id},process.env.JWT_SECRET,{expiresIn:"1d"});
            return res.status(201).send({
            success:true,
            user:{
                fname:userExist.fname,
                lname:userExist.lname,
                email:userExist.email,
                phone:userExist.phone,
                location:userExist.location,
            },
            message:"You are logged in ",
            token
        })

        }
        
        
    } catch (error) {

    return next(error);
    }
}

export const updateuserController=async(req,res,next)=>{
    try { 
       let {fname,lname,email,password,phone,location}=req.body;
        if(!fname||!lname||!email||!password||!phone||!location){
            next("please provide all the details");
        }
        fname= fname?fname:req.user.fname;
        lname= lname?lname:req.user.lname;
        phone= phone?phone:req.user.phone;
        email= email?email:req.user.email;
        location= location?location:req.user.location;
       
        const check=await verifyPassword(password,req.user.password);
        if(!check)
        {
            console.log("password is updating now ;");
            const hashedPassword=await hashPassword(password);
            password=hashedPassword;
        }
        else{
            password=req.user.password;
        }
        const updatedUser=await userModel.findByIdAndUpdate({_id:req.user._id},{fname,lname,phone,location,email,password},{new:true});
        return  res.status(201).send({
            success:true,
            updatedUser
        })   
        
    } catch (error) {
        console.log(error);
        next(error);
    }
}
export const forgetPasswordController=async(req,res,next)=>{
    try {
            const {email}=req.body;
            const userExist=await userModel.findOne({email:email});
            if(userExist)
            {
               const token=  jwt.sign({_id:userExist._id},process.env.JWT_SECRET,{expiresIn:"1d"});
               const setUserToken=await userModel.findByIdAndUpdate({_id:userExist._id},{token:token},{new:true});
               console.log(setUserToken);
               if(setUserToken)
               {
                       const mailOptions=
                       {
                           from:"praveshkumar1062002@gmail.com",
                           to:email,
                           subject:"sending Email for password Reset",
                           text: `This Link valid For 5 minutes only http://localhost:3000/resetpassword/${userExist._id}/${token}`
                       }   
                       
                       transporter.sendMail(mailOptions,(error,info)=>{
                           if(error)
                           {
                               res .status(401).json({success:false,message:"no link is sent"})
                           }
                           else
                           {
                               res.status(201).json({success:true,message:"Email sent succesfully"});
                           }
                       })
               }
            }
        
    } catch (error) {
        console.log(error);
        
    }
}
export const resetpasswordController=async(req,res,next)=>{
    try {
           const {id,token}=req.params;
           let {password}=req.body;
           const userExist=await userModel.findById({_id:id});
           if(userExist)
           {
              const verify=jwt.verify(token,process.env.JWT_SECRET);
                if(verify)
                {
                    const hashedPassword=await hashPassword(password);
                    password=hashedPassword;
                    const updatepassword=await userModel.findByIdAndUpdate({_id:id},{password:password},{new:true});
                    if(updatepassword)
                    {
                        console.log("password updated")
                       return res.status(201).send({
                            success:true,
                            message:"Your Password is updated"
                        })
                    }
                    else{
                        res.status(401).send({
                            success:false,
                            message: "something went wrong please try again"
                        })
                    }
                }
                else{
                    next("Link Is expired");
                }

           }else{
             next("invalid user");
           }
           
    } catch (error) {
        console.log(error);
        next("something went wrong");
    }
}
