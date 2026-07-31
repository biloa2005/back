import { Router } from 'express';
import { verifyJwt } from '../middlewares/auth.middleware.js'; // Import du middleware
import { newCenter } from '../controllers/center.controller.js';

const router=Router();
router.post("/", newCenter)
export default router;