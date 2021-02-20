<script>
  import {createEventDispatcher} from 'svelte';
  import {writable} from 'svelte/store';
  import Store from './Store';

  export let store   = Store([]);
  export let options = {
    columns:      {},
    show_headers: true,
    show_search:  true,
    show_footer:  true,
    icon:         row => row,
    marker:       row => row
  };

  const headers    = Object.entries(options.columns);
  const selected   = writable(null);
  const dispatch   = createEventDispatcher();
  const sorting    = {asc: false, key: null, icon: ''};
  const paging     = {index: 1, current: [], pages: 0, size: 12, boundaries: []};
  const {criteria} = store;

  selected.subscribe(item => dispatch('select', item));
  store.subscribe(paginate);

  function paginate(records) {
    if (records.length <= paging.size) {
      paging.current = records;
      paging.pages   = 1;
      paging.index   = 1;
    } else {
      paging.pages = Math.ceil(records.length / paging.size);

      if (paging.index > paging.pages) {
        paging.index = paging.pages;
      }

      const start    = (paging.index - 1) * paging.size;
      paging.current = records.slice(start, start + paging.size);
    }

    paging.boundaries[0] = (paging.index - 1) * paging.size;
    paging.boundaries[1] = paging.index === paging.size ? $store.length : paging.boundaries[0] + paging.current.length;
  }

  function marker(item) {
    if (options.marker && typeof options.marker === 'function') {
      const marker = options.marker(item);
      return marker ? `left marked ${options.marker(item)}` : '';
    }

    return '';
  }

  function icon(i, item) {
    if (i === 0 && options.icon && typeof options.icon === 'function') {
      const icon = options.icon(item);

      return icon ? `<i class="${icon} icon"></i>` : '';
    }

    return '';
  }

  function sort(field) {
    store.update(values => values.sort(function (a, b) {
      a = a[field].toLowerCase();
      b = b[field].toLowerCase();

      return sorting.asc ? a >= b ? 1 : -1 : a <= b ? 1 : -1;
    }));

    sorting.key  = field;
    sorting.asc  = !sorting.asc;
    sorting.icon = sorting.asc ? 'sort alphabet up icon grey' : 'sort alphabet down icon grey';
  }

  function move(index) {
    if (index < 1 || index > paging.pages) return;
    paging.index = index;
    paginate($store);
  }
</script>

<table class="ui fixed single line selectable table">
  <thead>
  <!-- SEARCH-->
  {#if options.show_search}
    <tr>
      <th colspan="{headers.length}">
        <div class="ui form">
          <div class="ui fluid icon input">
            <input type="text" placeholder="Cerca..." bind:value={$criteria}>
            <i class="search icon"></i>
          </div>
        </div>
      </th>
    </tr>
  {/if}

  <!-- HEADERS-->
  {#if options.show_headers}
    <tr>
      {#each headers as header}
        <th class="sticky four wide" on:click={()=> sort(header[0])}>
          <div class="ui items">
            <div class="item">
              <div class="ui left aligned content">
                {header[1].toUpperCase()}
              </div>
              <div class="ui right aligned content">
                <i class="{header === sorting.key ? sorting.icon: ''}"></i>
              </div>
            </div>
          </div>
        </th>
      {/each}
    </tr>
  {/if}
  </thead>

  <!-- BODY -->
  <tbody>
  {#each paging.current as item}
    <tr class:selected={$selected === item} class="{marker(item)}" on:click={() => selected.set(item)}>
      {#each headers as header, i}
        <td class:sorted={sorting.key === header}>{@html icon(i, item)} {item[header[0]]} </td>
      {/each}
    </tr>
  {/each}

  <!--fill with empty rows-->
  {#each Array(paging.size - paging.current.length) as item}
    <tr>
      {#each headers as header}
        {#if (header !== 'id')}
          <td class:sorted={sorting.key === header}>&zwnj;</td>
        {/if}
      {/each}
    </tr>
  {/each}
  </tbody>

  <!-- FOOTER -->
  {#if options.show_footer}
    <tfoot>
    <tr>
      <th colspan="{1}">
        <div class="ui left aligned container">
          {paging.boundaries[0] + 1} -  {paging.boundaries[1]}
        </div>
      </th>
      <th colspan="{headers.length - 2}">
        <div class="ui center aligned container">
          <div class="ui pagination menu">

            {#if paging.index === 1}
              <a class="icon item disabled">
                <i class="left chevron icon"></i>
              </a>
            {:else }
              <a class="icon item" on:click={() => move(paging.index - 1)}>
                <i class="left chevron icon"></i>
              </a>
            {/if}

            <div class="item">
              {paging.index} di {paging.pages}
            </div>

            {#if paging.index === paging.pages}
              <a class="icon item disabled">
                <i class="right chevron icon"></i>
              </a>
            {:else }
              <a class="icon item" on:click={()=>move(paging.index + 1)}>
                <i class="right chevron icon"></i>
              </a>
            {/if}

          </div>
        </div>
      </th>
      <th colspan="{1}">
        <div class="ui right aligned container">
          {$store.length}
        </div>
      </th>
    </tr>
    </tfoot>
  {/if}
</table>

<style>
    th {
        font-weight: bold;
    }

    td.sorted,
    .ui.selectable.table tbody tr.selected {
        background: #effabb;
    }

    .ui.selectable.table tbody tr:hover {
        background: #f3fce5;
    }

    .sticky {
        position: sticky;
        top: 0;
        z-index: 10;
        user-select: none;
    }
</style>