<script lang="ts">
  import toast, { Toaster } from "svelte-french-toast";

  import Modal from "./components/Modal.svelte";
  import SettingsIcon from "./components/svg/SettingsIcon.svelte";

  let showModal = false;
  function toggleModal() {
    if (!showModal) {
      window.electron.ipcRenderer.send("load-settings");
    }
    showModal = !showModal;
  }

  const ipcHandle = (): void => window.electron.ipcRenderer.send("ping");
  let uploading = false;
  let folderAmount = 0;
  let folderProcessed = 0;
  let fileAmount = 0;
  let fileProcessed = 0;
  let passwordField: HTMLInputElement;
  let emailText = "";
  let emailAddress = "";
  let password = "";

  const togglePasswordVisibility = () => {
    passwordField.type =
      passwordField.type === "password" ? "text" : "password";
  };
  const saveSettings = () => {
    window.electron.ipcRenderer.send("save-settings", {
      emailAddress,
      password,
      emailText,
    });
    toggleModal();
    toast.success("Einstellungen gespeichert!");
  };

  window.electronAPI.onFolderUpload((value) => {
    toast.success(`Bilder erfolgreich hochgeladen\n${value}`);
  });

  window.electronAPI.onMailSent((value) => {
    toast.success(`E-Mail verschickt!\n${value}`);
  });

  window.electronAPI.onMailError((value) => {
    toast.error(`E-Mail konnte nicht verschickt werden!\n${value}`, {
      duration: 6000,
    });
  });

  window.electronAPI.onSetUploading((value) => {
    uploading = value;
  });

  window.electronAPI.onFolderAmount((value) => {
    folderProcessed = 0;
    folderAmount = value;
  });

  window.electronAPI.onFileAmount((value) => {
    fileProcessed = 0;
    fileAmount = value;
  });

  window.electronAPI.onFileProcessed(() => {
    fileProcessed += 1;
  });

  window.electronAPI.onFolderProcessed(() => {
    folderProcessed += 1;
  });

  window.electronAPI.onSettingsLoad((settings) => {
    emailAddress = settings.emailAddress;
    password = settings.password;
    emailText = settings.emailText;
  });
</script>

<Toaster />
<div class="actions">
  <div class="action">
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions a11y-missing-attribute-->
    <button
      disabled="{uploading}"
      target="_blank"
      class="kindergarten_button"
      rel="noreferrer"
      on:click={ipcHandle}>Kindergarten verschicken!</button
    >
  </div>
</div>

<Modal isOpen={showModal} close={toggleModal}>
  <div>
    <input
      type="text"
      bind:value={emailAddress}
      placeholder="E-Mail Adresse"
      required
    />
    <input
      type="password"
      bind:this={passwordField}
      bind:value={password}
      placeholder="Passwort"
      required
    />
    <input
      type="checkbox"
      id="passwordVisible"
      on:click={togglePasswordVisibility}
    />
    <label for="passwordVisible">Passwort anzeigen</label>
    <div class="email-Text">
      <textarea
        rows="20"
        cols="50"
        bind:value={emailText}
        class="resize-none"
      />
      <p>Platzhalter für den Downloadlink muss EXAKT {"{"}download{"}"} sein</p>
    </div>
    <div>
      <button class="save-button" on:click={saveSettings}>Speichern</button>
      <button class="save-button" on:click={toggleModal}>Schließen</button>
    </div>
    {@html emailText}
  </div>
</Modal>
<div class="settings">
  <button class="settings-button" on:click={toggleModal}
    ><SettingsIcon /></button
  >
</div>
{#if uploading}
  <div class="upload-status">
    <p>Upload Status</p>
    <p>Ordner hochgeladen: {folderProcessed}/{folderAmount}</p>
    <p>Dateien hochgeladen: {fileProcessed}/{fileAmount}</p>
  </div>
{/if}

<style lang="scss">
  .kindergarten_button {
	padding: 20px;
	font-size: 24px;
	color: black;
}
  .upload-status {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 10px;
    p {
      margin: 5px 0;
    }
  }

  .email-Text {
    display: flex;
    flex-direction: column;
  }
</style>
