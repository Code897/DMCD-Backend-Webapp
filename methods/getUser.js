import { User } from "../db/models/schema.js";

const getUserDB = async (userid) => {
    try {
        const user = await User.findOne({ _id: userid }).select('-password');
        if (!user) {
            throw new Error('Invalid id');
        }
        return user;
    } catch (error) {
        console.error('Error getting User:', error);
        throw new Error('Internal server error');
    }
}

export default getUserDB;