<script>
  export let row;
  export let icon  = '';
  export let text  = '';
  export let copy  = false;
  export let hover = false;

  function clipboard(value) {
    const el = document.createElement('textarea');
    el.value = value;
    el.setAttribute('readonly', '');
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

</script>

<td class:hover on:mouseenter={() => hover = true} on:mouseleave={() => hover = false}>
  <div class="ui items">
    <div class="item">
      {#if icon}<i class="{icon} icon"></i>{/if}

      <div class="ui left aligned content">
        {text}
      </div>

      {#if copy}
        <div class="ui right aligned content">
          <i class="clipboard outline icon" on:click={()=>clipboard(text)}></i>
        </div>
      {/if}

    </div>
  </div>

</td>

<style>
    .clipboard.outline.icon {
        visibility: hidden;
    }

    .hover .clipboard.outline.icon {
        visibility: visible;
    }
</style>