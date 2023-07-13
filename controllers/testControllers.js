export const testingController=async(req,res)=>{
    try {
            res.status(200).send({
                success:true,
                message:"yes baby you are tested successfully"
            })
    } catch (error) {
            console.log(error)
    }
}