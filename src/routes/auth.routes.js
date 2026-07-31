import { Router } from 'express';
import { loginUser } from '../controllers/auth.controller.js';
import { changePassword,refreshAccessToken } from '../controllers/auth.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js'; // Import du middleware

const router = Router();
router.post('/login',loginUser);
router.put('/change-password',verifyJwt, changePassword)
router.post('/refresh', refreshAccessToken); //public

export default router;