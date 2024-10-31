import { Router } from "express";
import UserController from "../controllers/UserController.js";

const router = Router();

// get all users
router.get("/users", UserController.getAllUsers);

// get user by id
router.get("/user/:id", UserController.getUserById);

// update user by id
router.put("/users/update/:id", UserController.updateUserById);

// delete user by id
router.delete("/users/delete/:id", UserController.deleteUserById);

// create user client
router.post("/users/:id/clients/create", UserController.createUserClient);

//delete user client
router.delete("/users/:id/clients/delete/:clientId", UserController.deleteUserClient);

export default router;

