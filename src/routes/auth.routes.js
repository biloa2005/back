import { Router } from 'express';
import { loginUser } from '../controllers/auth.controller.js';
import { changePassword } from '../controllers/auth.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js'; // Import du middleware

const router = Router();
router.post('/login',loginUser);
router.put('/change-password',verifyJwt, changePassword)
export default router;