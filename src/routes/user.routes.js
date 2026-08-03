import { Router } from "express";
import {registerUser,getAllUsers,deleteUser} from "../controllers/user.controller.js"
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
const  router=Router()
// router.post('/register', verifyJwt,requireRole(['ADMIN'],registerUser));
router.post('/register',registerUser);
router.get('/',getAllUsers)
router.delete("delete/:id",deleteUser)
export default router;