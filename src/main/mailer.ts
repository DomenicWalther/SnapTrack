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


export async function main(downloadLink: string, emailReceiver: string) {
  console.log("Receiver: " + emailReceiver)
  const info = await transporter.sendMail(createMessage(downloadLink, emailReceiver))
  console.log(info)
}

function createMessage(downloadLink: string, emailReceiver: string) {
  return {
    from: process.env.EMAIL_TESTSENDER,
    to: emailReceiver,
    subject: 'Kindergarten Downloadlink',
    text: 'Anbei der Downloadlink für die Kindergartenbilder' + downloadLink,
    html: '<p>Anbei der Downloadlink für die Kindergartenbilder</p>' + downloadLink
  }
}
