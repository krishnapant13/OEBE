const app = require("./app");
const connectDatabase = require("./db/database");

// Handling uncought exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Sutting down the server for handling uncought exception");
});

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "./config/.env",
  });
}

//connect db
connectDatabase();

//creating a server
const server = app.listen(process.env.PORT, () => {
  console.log(`server is running on http://localhost:${process.env.PORT}`);
});

//unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Sutting down the server for ${err.message} `);
  console.log("sutting down the server for unhandled promise rejection");
  server.close(() => {
    process.exit();
  });
});
