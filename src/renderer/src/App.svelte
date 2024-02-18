<script lang="ts">
  import SettingsIcon from './components/svg/SettingsIcon.svelte'

  import Modal from './components/Modal.svelte'
  let showModal = false
  function toggleModal() {
    console.log('toggleModal')
    showModal = !showModal
  }

  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const sendMail = (): void => window.electron.ipcRenderer.send('sendMail')
</script>

<div class="actions">
  <div class="action">
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions a11y-missing-attribute-->
    <a target="_blank" rel="noreferrer" on:click={ipcHandle}>Send IPC</a>
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions a11y-missing-attribute-->
    <a target="_blank" rel="noreferrer" on:click={sendMail}>Send Testmail</a>
  </div>
</div>

<Modal isOpen={showModal} close={toggleModal}>
  <h1>Settings</h1>
  <p>Here are some settings</p>
</Modal>
<div class="settings">
  <button class="settings-button" on:click={toggleModal}><SettingsIcon /></button>
</div>
