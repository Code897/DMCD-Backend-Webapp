import bcrypt from 'bcrypt';
import { User } from '../db/models/schema.js';

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

const passwordReset = (identifier, password) => {
    if (!identifier || !identifier.value || !identifier.type) {
        throw new Error('Some error occurred, please try again');
    }

    return User.findOne({ [identifier.type]: identifier.value })
        .then((user) => {
            return hashPassword(password)
                .then((hashedPassword) => {
                    return User.updateOne({ _id: user._id }, { password: hashedPassword })
                        .then(() => user);
                });
        })
        .catch((error) => {
            throw new Error(`User with this ${identifier.type} not found`);
        });
}

export default passwordReset;