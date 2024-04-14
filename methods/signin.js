import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../db/models/schema.js';
import { JWT_SECRET } from '../config.js';

const userSignIn = async (email, password) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid email or password');
        }

        const token = jwt.sign({ userId: user._id, userEmail: user.email }, JWT_SECRET, { expiresIn: '5D' });
        const responseUser = (({ password, ...userWithoutPassword }) => userWithoutPassword)(user.toObject());
        return { responseUser, token }

    } catch (error) {
        throw new Error(error);
    }
}

export default userSignIn;