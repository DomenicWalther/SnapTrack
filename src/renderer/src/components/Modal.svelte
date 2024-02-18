<script>
  export let isOpen = false
  export let close

  function handleBackdropClick(event) {
    if (event.target.classList.contains('backdrop')) {
      close()
    }
  }
</script>

{#if isOpen}
  <div class="backdrop" on:click={handleBackdropClick}>
    <div class="modal">
      <slot />
      <button on:click={close}>Close</button>
    </div>
  </div>
{/if}

<style>
  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.75);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    background: white;
    padding: 20px;
    border-radius: 5px;
    color: black;
  }
</style>
