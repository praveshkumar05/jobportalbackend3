import express from 'express'
import { forgetPasswordController, loginController, registerController, resetpasswordController } from '../controllers/userController.js';
import rateLimit from 'express-rate-limit'
import { authenticateUser } from '../middlwares/authMiddleware.js';


const limiter = rateLimit({
	windowMs: 100 * 60 * 1000, // 100 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const router=express.Router();

router.post('/register',limiter,registerController);
router.post('/login',limiter,loginController);
router.post("/forget-password",limiter,forgetPasswordController);
router.post("/reset-password/:id/:token",limiter,resetpasswordController);
router.get('/user-auth',authenticateUser,(req,res)=>{
    try {
            res.status(200).send({ok:true});
    } catch (error) {
            console.log(error);
    }
   
})
export default router