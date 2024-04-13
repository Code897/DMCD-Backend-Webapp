import otpGenerator from 'otp-generator'
import { localVariables } from '../middleware/auth.js';

const generateOTP = async () => {
    req.app.local = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
}