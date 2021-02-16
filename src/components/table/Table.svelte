<script context="module">
  import {writable} from 'svelte/store';

  const cache = [];

  export function Store(data, mappings) {
    data = Array.isArray(data) ? data : [data];
    if (!('id' in mappings)) throw Error('an "id" field must be defined');

    const rows    = writable([]);
    const columns = [];

    function access(path, o) {
      return path.replace(/\[|]\.?/g, '.').split('.').reduce((a, v) => a && a[v], o);
    }

    for (const mapping in mappings) if (mappings.hasOwnProperty(mapping)) {
      columns.push({key: mappings[mapping], title: mapping});
    }

    for (const record of data) {
      const row = {};

      for (const mapping in mappings) if (mappings.hasOwnProperty(mapping)) {
        row[mapping] = access(mappings[mapping], record);
      }

      cache.push(row);
    }

    rows.set(cache);

    rows.filter = function (fn) {
      rows.reset();
      rows.update(items => {
        return items.filter(fn);
      });
    };

    rows.reset = function () {
      rows.set(cache);
    };

    return {rows, columns};
  }
</script>

<script>
  import {createEventDispatcher} from 'svelte';

  export let store     = Store({}, {});
  export let headers   = false;
  export let searchbar = false;
  export let page_size = 12;

  const {rows, columns} = store;
  const dispatch        = createEventDispatcher();
  const selected        = writable(null);
  const search_criteria = writable('');
  const sorting         = {asc: false, key: null, icon: ''};

  let current_page = 1;
  let page         = $rows.slice(current_page * page_size, (current_page * page_size) + page_size);

  selected.subscribe(item => dispatch('select', item));
  search_criteria.subscribe(search);

  function sort(field) {
    rows.update(values => values.sort(function (a, b) {
      a = a[field].toLowerCase();
      b = b[field].toLowerCase();

      return sorting.asc ? a >= b ? 1 : -1 : a <= b ? 1 : -1;
    }));

    sorting.key  = field;
    sorting.asc  = !sorting.asc;
    sorting.icon = sorting.asc ? 'sort alphabet up icon grey' : 'sort alphabet down icon grey';
    page         = $rows.slice(current_page * page_size, (current_page * page_size) + page_size);
  }

  function search(criteria) {
    const filtered = cache.filter(item => {
      return columns.map(header => item[header.title].toLowerCase()).join(' ').includes(criteria.toLowerCase());
    });

    rows.set(filtered);
    move(current_page);
  }

  function move(index) {
    const pages = Math.ceil($rows.length / page_size);

    if (index < 1 || index >= pages) return;

    page         = $rows.slice(index * page_size, (index * page_size) + page_size);
    current_page = index;
    console.log(current_page, 'of', pages - 1, $rows.length);
  }

</script>

<div class="ui basic segment">
  <table class="ui fixed single line selectable table">
    <thead>

    <!-- SEARCH-->
    {#if (searchbar)}
      <tr>
        <th colspan="{columns.length - 1}">
          <div class="ui form">
            <div class="ui fluid icon input">
              <label>
                <input type="text" placeholder="Cerca..." bind:value={$search_criteria}>
              </label>
              <i class="search icon"></i>
            </div>
          </div>
        </th>
      </tr>
    {/if}

    <!-- HEADERS-->
    {#if headers}
      <tr>
        {#each columns as header}
          {#if (header.key !== 'id')}
            <th class="sticky four wide" on:click={()=> sort(header.title)}>
              <div class="ui items">
                <div class="item">
                  <div class="ui left aligned content">
                    {header.title.toUpperCase()}
                  </div>
                  <div class="ui right aligned content">
                    <i class="{header.title === sorting.key ? sorting.icon: ''}"></i>
                  </div>
                </div>
              </div>
            </th>
          {/if}
        {/each}
      </tr>
    {/if}
    </thead>

    <!-- BODY -->
    <tbody>
    <!--{#if pages.items.length}-->
    {#each page as item, i}
      <!--{#each pages.current as item}-->
      <tr class={item.id === $selected ? 'selected' : ''} on:click={()=> selected.set(item)}>
        {#each columns as header, i}
          {#if (header.key !== 'id')}
            <td class:sorted={sorting.key === header.title}>
              {item[header.title]}
            </td>
          {/if}
        {/each}
      </tr>

    {/each}
    <!--{:else}-->
    <!--  {#each Array(pages.size) as item}-->
    <!--    <tr>-->
    <!--      {#each columns as header}-->
    <!--        <td>-->
    <!--          <div class="ui placeholder">-->
    <!--            <div class="line"></div>-->
    <!--          </div>-->
    <!--        </td>-->
    <!--      {/each}-->
    <!--    </tr>-->
    <!--  {/each}-->
    <!--{/if}-->
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
      <th colspan="{columns.length - 3}">
        <div class="ui center aligned container">
          <div class="ui pagination menu">

            <a class="icon item" on:click={()=>move(current_page - 1)}>
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

            <a class="icon item" on:click={()=>move(current_page + 1)}>
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