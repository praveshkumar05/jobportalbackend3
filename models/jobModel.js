import mongoose from "mongoose";

const jobSchema=new mongoose.Schema({
    company:{
        type:String,
        required:[true,'Company name is required']
    },
    position:{
        type:String,
        required:[true,'Position is required']
    },
    status:{
        type:String,
        enum:["pending",'reject','interview'],
        default:'pending'
    },
    workType:{
        type:"String",
        enum:['full-time','part-time','internship','contract'],
        default:'full-time'
    },
    worklocation:{
        type:"String",
        default:'Mumbai',
        required:[true,'work location is created by']
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    }
},{timestamps:true});
export default mongoose.model("Job",jobSchema);