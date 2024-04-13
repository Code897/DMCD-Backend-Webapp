import mongoose from "mongoose"
import { MONGO_ATLAS_PASSWORD } from "../../config.js";
const mongoConn = () => {
    mongoose.connect(`mongodb+srv://aryanap3098:${MONGO_ATLAS_PASSWORD}@dmcd.0avpmjo.mongodb.net/?retryWrites=true&w=majority&appName=DMCD`)
        .then(() => console.log('Connected to MongoDB'))
        .catch(error => console.error('MongoDB connection error:', error))
}

export default mongoConn;