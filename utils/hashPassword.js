
import bcrypt from 'bcryptjs'
export const hashPassword=async(planepassword)=>{
    try {
        const hashedPassword=await bcrypt.hash(planepassword,10);
        return hashedPassword;

    } catch (error) {
            console.log(error,"Error in Hashing");
    }
}
export const verifyPassword=async(planePassword,hashedPassword)=>{
    console.log(planePassword,hashedPassword);
    try {
        const result=await bcrypt.compare(planePassword,hashedPassword);
        return result;

    } catch (error) {

            console.log(error,"Error in Hashing");
    }
}
