import Client from "../models/ClientModel.js";

// functions
// hash unique account code for client
const hashAccountCode = (client) => {
    const accountCode = `${client.email}-${client.number}`;
    return accountCode;
};



export const createClient = async (req) => {
    try {
        const { email, loanAmount, paymentIntervalDays, ...clientData } = req.body;

        // Check if client already exists
        const existingClient = await Client.findOne({ email });
        if (existingClient) {
            return { error: true, message: "Client with this email already exists." };
        }

        // Generate unique account ID
        const accountCode = hashAccountCode({ email, number: clientData.number });

        // Set nextPaymentDate based on current date and paymentIntervalDays
        const nextPaymentDate = new Date();
        nextPaymentDate.setDate(nextPaymentDate.getDate() + (paymentIntervalDays || 30)); // Default to 30 days if undefined

        // Create new client instance
        const newClient = new Client({
            ...clientData,
            email,
            accountUniqueId: accountCode,
            loanAmount,
            remainingBalance: loanAmount, // Set initial balance equal to loan amount
            paymentIntervalDays: paymentIntervalDays || 30, // Default to 30 days if undefined
            nextPaymentDate,
        });

        // Save client to database
        await newClient.save();
        return { clientId: newClient._id };
    } catch (error) {
        console.error(error);
        return { error: true, message: "An error occurred while creating the client." };
    }
};

// delete client
const deleteClient = async (req, res) => {
    try {
        await Client.findByIdAndDelete(req);
    } catch (error) {
        throw error;
    }
};

//update client
const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const client = req.body;

        // Check if client exists
        const existingClient = await Client.findById(id);
        if (!existingClient) return res.status(404).json({ message: "Client not found" });

        // Calculate interest amount
        const interestAmount = calculateInterestAmount(client);

        // Update client
        const updatedClient = await Client.findByIdAndUpdate(id, { ...client, interestAmount }, { new: true });
        res.status(200).json(updatedClient);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

// get all clients
const getClients = async (req, res) => {
    try {
        const clients = await Client.find();
        res.status(200).json(clients);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// get a single client
const getClient = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "Client ID is required" });

        const client = await Client.findById(id);
        res.status(200).json(client);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};


// fix interest amount update, function to update interest amount
// Helper function to calculate interest amount
const calculateInterestAmount = (client) => {
    return (client.remainingBalance * client.interestRate) / 100;
};

// Helper function to calculate the next payment date based on the client's payment interval
const calculateNextPaymentDate = (client) => {
    const nextPaymentDate = new Date(client.nextPaymentDate);
    nextPaymentDate.setDate(nextPaymentDate.getDate() + client.paymentIntervalDays);
    return nextPaymentDate;
};

const makePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentAmount, isPaid } = req.body;

        // Check if client exists
        const client = await Client.findById(id);
        if (!client) return res.status(404).json({ message: "Client not found" });

        // Calculate interest and principal parts of the payment
        const interestAmount = calculateInterestAmount(client);
        const principalAmount = paymentAmount - interestAmount;

        // Update remaining balance
        const remainingBalance = client.remainingBalance - principalAmount;

        // Update next payment date
        const nextPaymentDate = calculateNextPaymentDate(client);

        // Update client document with new values and push payment history
        client.isPaid = isPaid;
        client.remainingBalance = remainingBalance;
        client.nextPaymentDate = nextPaymentDate;

        // Add this payment to the client's payment history
        client.paymentHistory.push({
            date: new Date(),
            amount: paymentAmount,
            interest: interestAmount,
            principal: principalAmount,
        });

        // Save updates
        await client.save();

        res.status(200).json({
            message: "Payment processed successfully",
            updatedClient: client,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while processing the payment" });
    }
};

// Export the functions

const ClientController = { createClient, deleteClient, updateClient, getClients, getClient, makePayment };

export default ClientController;
