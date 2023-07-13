// error middleware || Next function
const errorMiddleware=(err,req,res,next)=>{
    
    const defaultError={
        status:200,
        message:err,
    }
     console.log(defaultError.message);
     return res.status(defaultError.status).send({ success:false, message:defaultError.message});
};
export default errorMiddleware