const mongoose = require("mongoose");

const mongoURI = "mongodb+srv://wes:wes21@cluster0.ai8ufze.mongodb.net/sessionsDB?retryWrites=true&w=majority";
const dbName = "sessionsDB";

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
const collection = db.collection("sessions");

db.on("error", (error) => {
    console.error("MongoDB connection error:", error);
});

db.once("open", async () => {
    console.log("Connected to MongoDB:", dbName);

    try {
        const result = await collection.deleteMany({});
        console.log("Deleted", result.deletedCount, "documents from the collection.");
    } catch (err) {
        console.error("Error deleting documents:", err);
    }

    // You can close the MongoDB connection here if needed
    mongoose.connection.close();
});
