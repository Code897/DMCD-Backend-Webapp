import axios from "axios";
import { IMGUR_ACCESS_TOKEN } from "../config.js";

const imgurDelete = async (deletehash) => {
    try {
        const response = await axios.delete(`https://api.imgur.com/3/image/${deletehash}`, {
            headers: {
                'Authorization': `Bearer ${IMGUR_ACCESS_TOKEN}`
            }
        });
    } catch (error) {
        console.error('Error deleting image from Imgur:');
        throw error; // Propagate the error to handle it at the higher level
    }
}

export default imgurDelete;