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
    return { transporter: transporter, emailSender: userSettings.emailAdress }
  } catch (error) {
    throw (error)
  }
}
export async function main(downloadLink: string, emailReceiver: string) {
  let { transporter, emailSender } = await setMailSettings()
  await transporter.sendMail(createMessage(downloadLink, emailReceiver, emailSender))
}

function createMessage(downloadLink: string, emailReceiver: string, emailSender: string) {
  return {
    from: emailSender,
    to: emailReceiver,
    subject: 'Kindergarten Downloadlink',
    text: 'Anbei der Downloadlink für die Kindergartenbilder' + downloadLink,
    html: '<p>Anbei der Downloadlink für die Kindergartenbilder</p>' + downloadLink
  }
}
