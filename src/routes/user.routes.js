import { Router } from "express";
import {registerUser} from "../controllers/user.controller.js"
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
const  router=Router()
router.post('/', verifyJwt,requireRole(['ADMIN'],registerUser));
export default router;