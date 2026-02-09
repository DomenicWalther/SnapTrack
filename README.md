# SnapTrack

This is an internal Tool developed for use at the photographic studio I work at.
Therefore this isn't really ready to be used by anyone else.

## Technology Stack

- Svelte
- Electron
- Google Drive API
- Node.js
- Nodemailer

## Features

- **Automated Uploads:** Transfers local image folders to Google Drive via API.
- **Email integration:** Sends download links directly to clients.
- **Folder Parsing:** Extracts client email addresses from directory names.
- **Configuration interface:** Settings menu for email credentials and API tokens.

## Usage

You need to get an API-Token by Google and save it as token.json in the Root Folder of this Project.
Follow [this Link](https://developers.google.com/identity/protocols/oauth2) in Order to get your Token.

### Install

```bash
$ npm install
```

### Running

```bash
$ npm run dev
```

Press the Cogwheel at the top-left of the Application, enter your E-Mail Address and Password _only T-Online is supported at the moment_

The Use-Case for this Application is to take a List of Folders, whose Names are E-Mail Adresses, containing Images that clients ordered. You take all of those folders and the Tool uploads them to Google and sends the respective Downloadlink to the Client.
