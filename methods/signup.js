import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../db/models/schema.js';
import mongoConn from '../db/conn/conn.js';

mongoConn();

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

const newUserID = () => {
    const id = "DMCD-" + uuidv4().replace(/-/g, '').substring(0, 15);
    return id;
};

const signUpUser = async (name, email, phone, password,city,dateOfBirth,gender,religion) => {
    try {
        const checkExistingEmail = await User.findOne({ email: `${email}` })
        const checkExistingPhone = await User.findOne({ phone: `${phone}` })
        if (checkExistingEmail) {
            throw new Error("Account with this email already exists")
        }
        if (checkExistingPhone) {
            throw new Error("Account with this phone number already exists")
        }
        const hashedPassword = await hashPassword(password)
        const newUser = new User({
            _id: newUserID(),
            name,
            email,
            phone,
            password: hashedPassword,
            city,
            dateOfBirth,
            gender,
            religion
        });
        const savedUser = await newUser.save();
        const responseUser = (({ password, ...userWithoutPassword }) => userWithoutPassword)(savedUser.toObject());
        return responseUser
    } catch (error) {
        throw error;
    }
};

export default signUpUser;