<script>
  import {writable} from 'svelte/store';

  export let row;
  export let icon      = '';
  export let text      = '';
  export let copy      = false;
  export let clipboard = writable(null);
  export let hover     = false;

  let copied = '';

  function docopy(value) {
    copied   = value;
    const el = document.createElement('textarea');
    el.value = value;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    clipboard.set(value);
  }
</script>

<td class:hover on:mouseenter={() => hover = true} on:mouseleave={() => hover = false}>
  <div class="ui items">
    <div class="item">
      {#if icon}
        <div>
          <i class="{icon} icon"></i>
          &zwnj;
        </div>
      {/if}

      <div class="ui left aligned content" class:iconed={copy}>
        {text}
      </div>

      {#if copy && text.trim().length > 0}
        <div class="ui right aligned content">
          <i class="clipboard icon" class:outline={$clipboard !== text} on:click={()=>docopy(text)}></i>
        </div>
      {/if}

    </div>
  </div>

</td>

<style>
    .iconed {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .clipboard.icon {
        visibility: hidden;
    }

    .hover .clipboard.icon {
        visibility: visible;
    }
</style>