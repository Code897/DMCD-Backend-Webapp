import dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET;
export const EMAIL = process.env.EMAIL;
export const PASSWORD = process.env.PASSWORD;
export const IMGUR_CLIENTID = process.env.imgur_CLIENTID;
export const IMGUR_CLIENTSECRET = process.env.imgur_CLIENTSECRET;
export const IMGUR_ACCESS_TOKEN = process.env.imgur_ACCESS_TOKEN;
export const IMGUR_REFRESH_TOKEN = process.env.imgur_REFRESH_TOKEN;
export const MONGO_ATLAS_PASSWORD = process.env.mongo_Atlas_Password;
export const PORT = process.env.PORT;
export const WHATSAPP_TOKEN = process.env.whatsapp_TOKEN;
export const MONGO_CONNECTION_STRING = process.env.mongo_Connection_String
