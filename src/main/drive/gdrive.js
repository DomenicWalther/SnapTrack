const fs = require('fs')
const path = require('path')
const process = require('process')
const { authenticate } = require('@google-cloud/local-auth')
const { google } = require('googleapis')

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive']
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json')
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json')

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.promises.readFile(TOKEN_PATH)
    const credentials = JSON.parse(content)
    return google.auth.fromJSON(credentials)
  } catch (err) {
    return null
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.promises.readFile(CREDENTIALS_PATH)
  const keys = JSON.parse(content)
  const key = keys.installed || keys.web
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token
  })
  await fs.promises.writeFile(TOKEN_PATH, payload)
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist()
  if (client) {
    return client
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH
  })
  if (client.credentials) {
    await saveCredentials(client)
  }
  return client
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {OAuth2Client} authClient An authorized OAuth2 client.
 */
async function createFolder(authClient, folderName) {
  const drive = google.drive({ version: 'v3', auth: authClient })

  const fileMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };

  try {
    const file = await drive.files.create({
      resource: fileMetadata,
      fields: 'id',
    });
    console.log("Folder ID:", file.data.id);
    return file.data.id;
  } catch (err) {
    console.log(err)
  }
}


async function shareFolder(authClient, folderID) {
  const drive = google.drive({ version: 'v3', auth: authClient })
  const permissions = { type: 'anyone', role: 'reader' }


  try {
    const result = await drive.permissions.create({
      resource: permissions,
      fileId: folderID,
      fields: 'id',
    });
    console.log("Inserted permission id:", result.data.id);
  } catch (err) {
    console.log(err);
  }
}


async function uploadBasic(authClient, filePath, file, folderID) {
  const drive = google.drive({ version: 'v3', auth: authClient })
  console.log(folderID);

  const requestBody = {
    name: file,
    parents: [folderID],
  }

  const media = {
    mimeType: 'image/jpeg',
    body: fs.createReadStream(filePath + "/" + file)
  }

  try {
    const file = await drive.files.create({
      requestBody,
      media: media,
      id: 'id',
    })
    console.log('File ID:', file.data.id)
    return file.data.id
  } catch (err) {
    console.log('Error uploading file:', err)
  }
}

export async function handleFileUpload(filePath, file, folder) {
  authorize().then((authClient) => { return createFolder(authClient, folder) }).then((folderID) => { startUpload(filePath, file, folderID) }).catch(console.error)
}

async function startUpload(filePath, file, folderID) {
  authorize().then((authClient) => { uploadBasic(authClient, filePath, file, folderID) }).catch(console.error)
  authorize().then((authClient) => { shareFolder(authClient, folderID) }).catch(console.error);
}
