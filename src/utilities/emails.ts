import nodemailer from 'nodemailer'
import * as dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    }
})

export const sendMail = async (user_mail: string, subject: string, content: any) => {
    const email = {
        from: process.env.EMAIL,
        to: user_mail,
        subject,
        html: content
    }

    await transporter.sendMail(email)
    .then( () => {
        console.log('Email sent !!!');
    })
    .catch( e => {
        console.log(e);
    })

}