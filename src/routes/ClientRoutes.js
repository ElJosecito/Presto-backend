import { Router } from "express";
import ClientController from "../controllers/ClientController.js";


const router = Router();

// Get client by id
router.get("/clients/:id", ClientController.getClient);

// Get all clients
router.get("/clients", ClientController.getClients);

// Create a new client
router.post("/clients/create", ClientController.createClient);

// update client
router.put("/clients/update/:id", ClientController.updateClient);

// make payment
router.put("/clients/payment/:id", ClientController.makePayment);


export default router;