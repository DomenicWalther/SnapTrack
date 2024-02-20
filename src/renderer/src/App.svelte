<script lang="ts">
  import SettingsIcon from './components/svg/SettingsIcon.svelte'

  import Modal from './components/Modal.svelte'
  let showModal = false
  function toggleModal() {
    showModal = !showModal
  }

  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  let emailAdress: String = ''
  let password: String = ''
  const saveSettings = () => {
    window.electron.ipcRenderer.send('save-settings', { emailAdress, password })
    toggleModal()
  }
</script>

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
