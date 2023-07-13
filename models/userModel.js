import mongoose from "mongoose";
import validator from "validator";
const userSchema= new mongoose.Schema({  

    fname:{
        type:String,
        required:[true,'Name is require']
    },
    lname:{
        type:String
    },
    email:{
        type:String,
        required:[true,'Email is require'],
        unique:true,
        validate:validator.isEmail
    },
    password:{
        type:String,
        required:[true,'Email is require'],   
        minlength:10
    },
    phone:{
        type:String,
        required:[true,'Phone is require'],
        minlength:10
    },
    
   location:{
        type:String,
        default:"India"
    }
},{timestamps:true});

export default  new mongoose.model("User",userSchema);
