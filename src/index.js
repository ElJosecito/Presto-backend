import express from "express";
//database connection
import connect from "./config/database.js";


//load env variables
process.loadEnvFile();

//initialize express
const app = express();

//connect to database
connect();

//midelewares
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET,HEAD,OPTIONS,POST,PUT,DELETE"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, auth-token"
    );
    next();
  });
  

//body parser
app.use(express.json());

//routes
//auth routes
import AuthRoutes from "./routes/AuthRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";
import ClientRoutes from "./routes/ClientRoutes.js";

app.use("/api", AuthRoutes, UserRoutes, ClientRoutes);

const PORT = process.env.PORT || 8080;
console.log(PORT);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

