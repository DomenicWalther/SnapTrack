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


export async function main(downloadLink: string) {
  const info = await transporter.sendMail(createMessage(downloadLink))
  console.log(info.messageId)
}

function createMessage(downloadLink: string) {
  return {
    from: process.env.EMAIL_TESTSENDER,
    to: process.env.EMAIL_TESTRECEIVER,
    subject: 'Kindergarten Downloadlink',
    text: 'Anbei der Downloadlink für die Kindergartenbilder' + downloadLink,
    html: '<p>Anbei der Downloadlink für die Kindergartenbilder</p>' + downloadLink
  }
}
