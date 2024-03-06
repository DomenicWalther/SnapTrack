<script lang="ts">
  import SettingsIcon from './components/svg/SettingsIcon.svelte'
  import toast, { Toaster } from 'svelte-french-toast'

  import Modal from './components/Modal.svelte'
  let showModal = false
  function toggleModal() {
    showModal = !showModal
  }

  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  let uploading: boolean = false
  let folderAmount: number = 0
  let folderProcessed: number = 0
  let fileAmount: number = 0
  let fileProcessed: number = 0

  let emailAdress: String = ''
  let password: String = ''
  const saveSettings = () => {
    window.electron.ipcRenderer.send('save-settings', { emailAdress, password })
    toggleModal()
    toast.success('Einstellungen gespeichert!')
  }

  window.electronAPI.onFolderUpload((value) => {
    toast.success('Bilder erfolgreich hochgeladen\n' + value)
  })

  window.electronAPI.onMailSent((value) => {
    toast.success('E-Mail verschickt!\n' + value)
  })

  window.electronAPI.onMailError((value) => {
    toast.error('E-Mail konnte nicht verschickt werden!\n' + value, {
      duration: 6000
    })
  })

  window.electronAPI.onSetUploading((value) => {
    uploading = value
  })

  window.electronAPI.onFolderAmount((value) => {
    folderProcessed = 0
    folderAmount = value
  })

  window.electronAPI.onFileAmount((value) => {
    fileProcessed = 0
    fileAmount = value
  })

  window.electronAPI.onFileProcessed(() => {
    fileProcessed += 1
  })

  window.electronAPI.onFolderProcessed(() => {
    folderProcessed += 1
  })
</script>

<Toaster />
<div class="actions">
  <div class="action">
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions a11y-missing-attribute-->
    <a target="_blank" class="kindergarten_button" rel="noreferrer" on:click={ipcHandle}
      >Kindergarten verschicken!</a
    >
  </div>
</div>

<Modal isOpen={showModal} close={toggleModal}>
  <input type="text" bind:value={emailAdress} placeholder="E-Mail Adresse" required />
  <input type="password" bind:value={password} placeholder="Passwort" required />
  <button class="save-button" on:click={saveSettings}>Speichern</button>
</Modal>
<div class="settings">
  <button class="settings-button" on:click={toggleModal}><SettingsIcon /></button>
</div>
{#if uploading}
  <div class="upload-status">
    <p>Upload Status</p>
    <p>Ordner hochgeladen: {folderProcessed}/{folderAmount}</p>
    <p>Dateien hochgeladen: {fileProcessed}/{fileAmount}</p>
  </div>
{/if}

<style lang="scss">
  .upload-status {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 10px;
    p {
      margin: 5px 0;
    }
  }
</style>
