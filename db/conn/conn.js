import mongoose from "mongoose"
import { MONGO_ATLAS_PASSWORD } from "../../config.js";
import { MONGO_CONNECTION_STRING } from "../../config.js";
const mongoConn = () => {
    mongoose.connect(`${MONGO_CONNECTION_STRING}`)
        .then(() => console.log('Connected to MongoDB'))
        .catch(error => console.error('MongoDB connection error:', error))
}

export default mongoConn;