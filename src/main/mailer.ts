import nodemailer from 'nodemailer'
import { getSettings } from './settings'
import 'dotenv/config'

async function setMailSettings() {
  try {
    let userSettings = await getSettings('anmeldedaten')
    let transporter = nodemailer.createTransport({
      host: 'securesmtp.t-online.de',
      port: 465,
      secure: true,
      pool: true,
      auth: {
        user: userSettings.emailAddress,
        pass: userSettings.password
      }
    })
    return {
      transporter: transporter,
      emailSender: userSettings.emailAdress,
      emailText: userSettings.emailText
    }
  } catch (error) {
    throw error
  }
}
export async function main(
  downloadLink: string,
  emailReceiver: string,
  mainWindow: Electron.BrowserWindow
) {
  let { transporter, emailSender, emailText } = await setMailSettings()
  transporter.sendMail(
    createMessage(downloadLink, emailReceiver, emailSender, emailText),
    function (error, info) {
      if (error) {
        mainWindow.webContents.send('mail-error', error)
      } else {
        mainWindow.webContents.send('mail-sent', info.response)
      }
    }
  )
}

function createMessage(
  downloadLink: string,
  emailReceiver: string,
  emailSender: string,
  emailText: string
) {
  return {
    from: emailSender,
    to: emailReceiver,
    subject: 'Kindergarten Downloadlink',
    text: emailText.replace('{download}', downloadLink)
  }
}
