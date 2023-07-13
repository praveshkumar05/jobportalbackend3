
import express from 'express'
import { testingController } from '../controllers/testControllers.js';
import { authenticateUser } from '../middlwares/authMiddleware.js';

const router=express.Router();

 router.get('/test-post',authenticateUser, testingController);

export default router;