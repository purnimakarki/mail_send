import express from "express";
import {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
 
    changePassword
} from "../controllers/userController.js";
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);

router.post("/change-password", authMiddleware, changePassword);

export default router;
