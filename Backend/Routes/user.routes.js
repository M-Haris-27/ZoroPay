import express from "express"
import { createUser, getAllUsers, getUserById, updateUserById, deleteUserById } from "../Controllers/user.controller.js";

const router = express.Router();

router.post("/new", createUser);
router.get("/all", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUserById);
router.delete("/:id", deleteUserById);


export default router;