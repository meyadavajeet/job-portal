import express from 'express';
import { loginController, registerController } from '../controllers/auth.controller.js';


//router object
const router = express.Router();

//routes start

/**
 *REGISTER
 *endpoint- /api/v1/users/auth/register
 */
router.post("/register", registerController)


//LOGIN
router.post("/login", loginController);


export default router;
