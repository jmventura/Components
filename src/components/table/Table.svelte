<script>
  import {createEventDispatcher} from 'svelte';
  import {writable} from 'svelte/store';

  export let headers = [];
  export let store;

  const selected   = writable(null);
  const dispatch   = createEventDispatcher();
  const sorting    = {asc: false, key: null, icon: ''};
  const paging     = {index: 1, current: [], pages: 0, size: 12};
  const {criteria} = store;

  selected.subscribe(item => dispatch('select', item));
  store.subscribe(paginate);

  $: console.log(`page ${paging.index} of ${paging.pages} (${$store.length} records)`);

  function paginate(records) {
    if (records.length <= paging.size) {
      paging.current = records;
      paging.pages   = 1;
    } else {
      const start    = (paging.index - 1) * paging.size;
      paging.current = records.slice(start, start + 12);
      paging.pages   = Math.ceil(records.length / paging.size);
    }
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

<div class="ui basic segment">
  <table class="ui fixed single line selectable table">
    <thead>

    <!-- SEARCH-->
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

    <!-- HEADERS-->
    {#if headers}
      <tr>
        {#each headers as header}
          <th class="sticky four wide" on:click={()=> sort(header)}>
            <div class="ui items">
              <div class="item">
                <div class="ui left aligned content">
                  {header.toUpperCase()}
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
    {#if paging.current.length}
      {#each paging.current as item, i}
        <tr class={item.id === $selected ? 'selected' : ''} on:click={()=> selected.set(item)}>
          {#each headers as header}
            {#if (header !== 'id')}
              <td class:sorted={sorting.key === header}>
                {item[header]}
              </td>
            {/if}
          {/each}
        </tr>
      {/each}
    {:else}
      {#each Array(paging.size) as item}
        <tr>
          {#each headers as header}
            <td>
              <div class="ui placeholder">
                <div class="line"></div>
              </div>
            </td>
          {/each}
        </tr>
      {/each}
    {/if}
    </tbody>

    <!-- FOOTER -->
    <tfoot>
    <tr>
      <th colspan="1">
        <!--{#if pages.items.length}-->
        <!--  <div class="ui left aligned container">-->
        <!--    &lt;!&ndash;{pages.items.flat().length} registri di {$rows.flat().length}&ndash;&gt;-->
        <!--  </div>-->
        <!--{:else}-->
        <div class="ui placeholder">
          <div class="header">
            <div class="full line"></div>
          </div>
        </div>
        <!--{/if}-->
      </th>
      <th colspan="{headers.length - 2}">
        <div class="ui center aligned container">
          <div class="ui pagination menu">

            <a class="icon item" on:click={()=>move(paging.index - 1)}>
              <i class="left chevron icon"></i>
            </a>

            <!--{#if pager.start > 0}-->
            <!--<a class="icon item" on:click={()=>move(-1)}>-->
            <!--  ...-->
            <!--</a>-->
            <!--{/if}-->

            <!--{#each pager.items as pagination}-->
            <!--  <a class:active={pager.current === pagination} class="item" on:click={()=>move(1)}>-->
            <!--  </a>-->
            <!--{/each}-->

            <!--{#if pager.end < pages.items.length - 1}-->
            <!--<a class="icon item" on:click={()=>move(1)}>-->
            <!--  ...-->
            <!--</a>-->
            <!--{/if}-->

            <a class="icon item" on:click={()=>move(paging.index + 1)}>
              <i class="right chevron icon"></i>
            </a>

          </div>
        </div>
      </th>
      <th colspan="1">
        <!--{#if pages.items.length}-->
        <!--  <div class="ui right aligned container">-->
        <!--    pagina {pager.current + 1} di {pages.items.length}-->
        <!--  </div>-->
        <!--{:else}-->
        <div class="ui placeholder">
          <div class="header">
            <div class="full line"></div>
          </div>
        </div>
        <!--{/if}-->
      </th>
    </tr>
    </tfoot>
  </table>

</div>

<style>
    .ui.segment {
        margin: 0;
    }

    th {
        font-weight: bold;
    }

    .ui.ui.selectable.table > tbody > tr.selected {
        background-color: #effabb;
    }

    td.sorted,
    .ui.selectable.table tbody tr:hover {
        background: #effabb
    }

    .sticky {
        position: sticky;
        top: 0;
        z-index: 10;
        user-select: none;
    }
</style>