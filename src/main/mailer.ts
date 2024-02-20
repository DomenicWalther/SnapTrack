import nodemailer from 'nodemailer'
import { getSettings } from "./settings"
import 'dotenv/config'




async function setMailSettings() {
  try {
    let userSettings = await getSettings("anmeldedaten")
    let transporter = nodemailer.createTransport({
      host: 'securesmtp.t-online.de',
      port: 465,
      secure: true,
      pool: true,
      auth: {
        user: userSettings.emailAdress,
        pass: userSettings.password
      }
    })
    return transporter
  } catch (error) {
    console.error(error)
  }
}
export async function main(downloadLink: string, emailReceiver: string) {
  let transporter = await setMailSettings()
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
