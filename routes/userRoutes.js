import express from 'express'
import { authenticateUser } from '../middlwares/authMiddleware.js';
import { updateuserController } from '../controllers/userController.js';


const router=express.Router();

// Update User

router.put('/update-user', authenticateUser, updateuserController);

export default router; 