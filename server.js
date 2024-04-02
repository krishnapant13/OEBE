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
    path: "./.env",
  });
}

//connect db
connectDatabase()
  .then(() => {
    // Start the server after the database connection is established
    const server = app.listen(process.env.PORT, () => {
      console.log(`Server is running on http://localhost:${process.env.PORT}`);
    });

    // Handling unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.error(`Unhandled Rejection: ${err.message}`);
      console.error("Shutting down the server...");
      server.close(() => {
        process.exit(1);
      });
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });

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
