import nodemailer from 'nodemailer'
import Mailgen from 'mailgen'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url';
import { EMAIL, PASSWORD } from '../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logoPath = join(__dirname, 'C:\Users\Win10\Documents\DMCD\dmcd-backend\assets\images\DMCD-logos_transparent.png');
const nodeConfig = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: EMAIL,
        pass: PASSWORD,
    },
};

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "DMCD",
        logo: logoPath,
        logoHeight: '30px',
        link: "https://dmcd.co.in"
    }
})

export const registerMail = async (req, res) => {
    const { name, email, text, subject } = req.body;

    var verifyEmailText = {
        body: {
            name: name,
            intro: text || "Welcome to Drive My Car Driver! We\'re very excited to have you as our customer",
            outro: "Click on the link provided to verify your email /n Thank You!!!"
        }
    }

    var emailBody = MailGenerator.generate(verifyEmailText)

    let mailOptions = {
        from: {
            name: "DMCD",
            address: EMAIL
        },
        to: email,
        subject: subject || "Verification Email",
        html: emailBody
    }

    transporter.sendMail(mailOptions)
        .then(() => {
            return res.status(200).send({ message: "You should receive an email from us." })
        })
        .catch((error) => {
            res.status(500).send({ error })
        })
}