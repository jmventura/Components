<script lang="ts">
  import {writable}              from 'svelte/store';
  import {createEventDispatcher} from 'svelte';
  import type {Header}           from './types';

  export let data              = writable([]);
  export let selected          = '';
  export let headers: Header[] = [];
  export let show_headers      = true;

  const dispatch        = createEventDispatcher();
  const search_criteria = writable('');

  function select(item) {
    selected = item.id;
    dispatch('select', item);
  }

  const pager = {
    start:   0,
    end:     0,
    size:    5,
    current: 0,
    items:   []
  };

  const pages = {
    size:    12,
    current: [],
    items:   []
  };

  const sorting = {
    asc:  false,
    key:  null,
    icon: ''
  };

  function access(path, object) {
    return path.replace(/\[|]\.?/g, '.').split('.').reduce((a, v) => a && a[v], object) || '';
  }

  function sort(field) {
    data.update(values => values.sort(function (a, b) {
      a = access(field, a) ? access(field, a).toUpperCase() : '';
      b = access(field, b) ? access(field, b).toUpperCase() : '';

      return sorting.asc ? a >= b ? 1 : -1 : a <= b ? 1 : -1;
    }));

    sorting.key  = field;
    sorting.asc  = !sorting.asc;
    sorting.icon = sorting.asc ? 'sort alphabet up icon grey' : 'sort alphabet down icon grey';
  }

  function paginate(items: any[] = []) {
    if (items) {
      pages.items.length = 0;
      for (let i = 0; i <= items.length; i += pages.size) pages.items.push(items.slice(i, i + pages.size));
      pages.current = pages.items[0];
    }

    const middle       = Math.floor(pager.size / 2);
    pager.items.length = 0;
    pager.start        = pager.current - middle;
    pager.end          = pager.current + middle;

    if (pager.start <= 0) {
      pager.start = 0;
      pager.end   = pager.size;
    }

    if (pager.end >= pages.items.length - 1) {
      pager.start = pages.items.length - pager.size - 1;
      pager.end   = pages.items.length - 1;
    }

    if (pager.size >= pages.items.length) {
      pager.start = 0;
      pager.end   = pages.items.length - 1;
    }

    for (let i = pager.start; i <= pager.end; i++) pager.items.push(i);
  }

  function go(num) {
    if (num < 0) num = 0;
    if (num >= pages.items.length) num = pages.items.length - 1;

    pager.current = num;
    pages.current = pages.items[num];

    paginate();
  }

  function up() {
    go((pager.current + 1) < pages.items.length ? (pager.current + 1) : pages.items.length - 1);
  }

  function down() {
    go((pager.current - 1) >= 0 ? (pager.current - 1) : 0);
  }

  function search(criteria) {
    const filtered = $data.filter(item => {
      return headers.map(header => (access(header.key, item) || '').toLowerCase()).join(' ').includes(criteria.toLowerCase());
    });

    paginate(filtered);
  }

  search_criteria.subscribe(search);
  data.subscribe(paginate);
</script>

<div class="ui basic segment">
  <table class="ui fixed single line selectable table">
    <thead>

    <!-- SEARCH-->
    <tr>
      <th colspan="5">
        <div class="ui form">
          <div class="ui fluid icon input">
            <input type="text" placeholder="Cerca..." bind:value={$search_criteria}>
            <i class="search icon"></i>
          </div>
        </div>
      </th>
    </tr>

    <!-- HEADERS-->
    {#if show_headers}

      <tr>
        {#each headers as header}
          <th class="sticky {header.width} wide" on:click={()=> sort(header.key)}>
            <div class="ui items">
              <div class="item">
                <div class="ui left aligned content">
                  {header.title}
                </div>
                <div class="ui right aligned content">
                  <i class="{header.key === sorting.key ? sorting.icon: ''}"></i>
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
    {#if pages.items.length}
      {#each pages.current as item}
        <tr class={item.id === selected ? 'selected' : ''} on:click={()=> select(item)}>
          {#each headers as header,i}
            {#if header.key === 'email' || header.key === 'phone'}
              <td class="left aligned" class:sorted={sorting.key === header.key}>

                {#if access(header.key, item).length !== 0}
                  {access(header.key, item)}
                {/if}

              </td>

            {:else}
              <td class="{header.align} aligned"
                  class:sorted={sorting.key === header.key}>
                {#if i === 0 && (item.parent || item.children)}
                  <i class="users icon"></i>
                {/if}
                {access(header.key, item)}</td>
            {/if}

          {/each}
        </tr>
      {/each}
    {:else}
      {#each Array(pages.size) as item}
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
    <tfoot>
    <tr>
      <th colspan="1">
        {#if pages.items.length}
          <div class="ui left aligned container">
            {pages.items.flat().length} registri di {$data.flat().length}
          </div>
        {:else}
          <div class="ui placeholder">
            <div class="header">
              <div class="full line"></div>
            </div>
          </div>
        {/if}
      </th>
      <th colspan="3">
        <div class="ui center aligned container">
          <div class="ui pagination menu">

            <a class="icon item" on:click={down}>
              <i class="left chevron icon"></i>
            </a>

            {#if pager.start > 0}
              <a class="icon item" on:click={()=>go(pager.current-pager.size-1)}>
                ...
              </a>
            {/if}

            {#each pager.items as pagination}
              <a class:active={pager.current === pagination} class="item"
                 on:click={()=>go(pagination)}>{pagination + 1}</a>
            {/each}

            {#if pager.end < pages.items.length - 1}
              <a class="icon item" on:click={()=>go(pager.current+pager.size+1)}>
                ...
              </a>
            {/if}

            <a class="icon item" on:click={up}>
              <i class="right chevron icon"></i>
            </a>

          </div>
        </div>
      </th>
      <th colspan="1">
        {#if pages.items.length}
          <div class="ui right aligned container">
            pagina {pager.current + 1} di {pages.items.length}
          </div>
        {:else}
          <div class="ui placeholder">
            <div class="header">
              <div class="full line"></div>
            </div>
          </div>
        {/if}
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