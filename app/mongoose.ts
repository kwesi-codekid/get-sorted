// import mongoose from "mongoose";

// const databaseUrl = process.env.MONGODB_URI as string;

// let isConnected = false; // Track the connection status

// async function connectToDatabase() {
//   if (isConnected) {
//     return;
//   }

//   try {
//     await mongoose.connect(databaseUrl);
//     isConnected = true;
//     console.log(`Connected to MongoDB`);
//   } catch (error) {
//     console.error(`Error connecting to MongoDB: ${error}`);
//   }
// }

// connectToDatabase();

// const db = mongoose.connection;

// db.on("connected", () => {
//   console.log(`Connected to MongoDB`);
// });

// db.on("error", (error) => {
//   console.error(`Error connecting to MongoDB: ${error}`);
// });

// export default mongoose;

import mongoose from "mongoose";

// Define the database URL
const databaseUrl = process.env.MONGODB_URI as string;

// Connect to the database
mongoose.connect(databaseUrl);

// Get the default connection
const db = mongoose.connection;

// Event handlers for successful and failed connection
db.on("connected", () => {
  console.log(`Connected to MongoDB`);
});

db.on("error", (error) => {
  console.error(`Error connecting to MongoDB: ${error}`);
});

// Export the connected mongoose instance
export default mongoose;
