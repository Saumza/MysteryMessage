import mongoose from "mongoose";

// defined data type for connection 
type connectionObject = {
    isConnected?: Number
}

// actual connection object for checking whether the DB is already connected or not
const connection: connectionObject = {}

export const connectDB = async (): Promise<void> => {
    if (connection.isConnected) {
        console.log("Database is already connected");
    }

    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI || "")  // OR operator used cause for env variable each defined with string || undefined so typescript shows and error for undefined as it might crash. So is used with an empty string
        connection.isConnected = connectionInstance.connections[0].readyState
        console.log(connectionInstance.connection.host);
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}