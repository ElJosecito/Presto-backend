import User from "../models/UserModel.js";
import ClientController, { createClient } from "./ClientController.js";


//get all users

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
};

//get user by id
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).populate("clients");

        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        res.status(200).json({ message: "User found", user: user });

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
};

//update user by id
const updateUserById = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, req.body);
        res.send("User updated successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}

//delete user by id
const deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        //delete all clients associated with the user
        const clients = user.clients;
        if (clients.length > 0) {
            clients.forEach(async (client) => {
                await ClientController.deleteClient(client);
            });
        }

        await User.findByIdAndDelete(id);
        res.send("User deleted successfully");
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}


//user clients controllers
const createUserClient = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await createClient(req);

        // If client creation fails, return error
        if (result.error) {
            return res.status(409).json({ message: result.message });
        }

        const clientId = result.clientId;

        // Push the client ID to the user's clients array
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        user.clients.push(clientId);
        await user.save();

        res.status(201).json({ message: "Client added successfully to user." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


//delete user client
const deleteUserClient = async (req, res) => {
    try {
        const { id, clientId } = req.params;
        const user = await User.findById(id);



        //check if the client exists in the user's clients array
        if (user.clients.includes(clientId)) {

            await ClientController.deleteClient(clientId);
            //remove the client from the user's clients array
            user.clients.pull(clientId);
            await user.save();
            res.status(200).send("Client deleted successfully from User");
            return;
        }
        else {
            res.status(404).send("Client not found in User");
            return;
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }

}



const UserController = { getAllUsers, getUserById, updateUserById, deleteUserById, createUserClient, deleteUserClient };

export default UserController;
