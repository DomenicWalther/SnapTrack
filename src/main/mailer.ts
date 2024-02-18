import nodemailer from 'nodemailer'
import 'dotenv/config'

let transporter = nodemailer.createTransport({
  host: 'securesmtp.t-online.de',
  port: 465,
  secure: true,
  pool: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
})

var message = {
  from: process.env.EMAIL_TESTSENDER,
  to: process.env.EMAIL_TESTRECEIVER,
  subject: 'Test Email',
  text: 'Das ist eine Testmail',
  html: '<p>HTML Version meiner Testmail</p>'
}

export async function main() {
  const info = await transporter.sendMail(message)
  console.log(info.messageId)
}

