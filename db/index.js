// ℹ️ package responsible to make the connection with mongodb
// https://www.npmjs.com/package/mongoose
const mongoose = require("mongoose");

// ℹ️ Sets the MongoDB URI for our app to have access to it.
// If no env has been set, we dynamically set it to whatever the folder name was upon the creation of the app

const MONGO_URI =
  process.env.MONGODB_URI || `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@stylio.qqrx8ll.mongodb.net/stylio`;

// mongoose
//   .connect(MONGO_URI)
//   .then((x) => {
//     const databaseName = x.connections[0].name;
//     console.log(`Connected to Mongo! Database name: "${databaseName}"`);
//   })
//   .catch((err) => {
//     console.error("Error connecting to mongo: ", err);
//   });


// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB.");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB: ", err);
  });


// Close the MongoDB connection when the application is shutting down
process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed.");
    process.exit(0);
  });
});