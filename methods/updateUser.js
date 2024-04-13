import { User } from "../db/models/schema.js";

const updateUserDB = async (userid, body) => {
    try {
        if (userid) {
            await User.updateOne({ _id: userid }, body)
        }
        else {
            throw new Error('Internal server error');
        }
    } catch (error) {
        console.error('Error getting User:', error);
        throw new Error('Internal server error');
    }
}

export default updateUserDB;