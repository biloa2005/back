import { Router } from "express";
import {registerUser} from "../controllers/user.controller.js"
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
const  router=Router()
router.post('/', verifyJWT,requireRole(['ADMIN'],registerUser));
export default router;