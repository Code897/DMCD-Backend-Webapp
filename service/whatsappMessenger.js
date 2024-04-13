import axios from "axios";
import { WHATSAPP_TOKEN } from "../config.js";

export const sendWhatsAppMessage=async (phone,message)=>{
  console.log(phone,message);
  // const receipientList=[phone]
  const messageData = {
    messaging_product: 'whatsapp',
    to: phone,
    type: 'template',
    template: {
        name: 'hello_world',
        language: {
            code: 'en_US'
        }
    }
};
      axios.post('https://graph.facebook.com/v18.0/295945193595918/messages', messageData, {
  headers: {
    Authorization: `Bearer ${WHATSAPP_TOKEN}`,
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('Message sent successfully:', response.data);
})
.catch(error => {
  console.error('Error sending message:', error.response.data);
});
}