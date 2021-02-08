<script lang="ts">
  import {writable} from 'svelte/store';
  import TableView  from './components/table/Table.svelte';
  import * as types from './components/table/types.ts';
  import contacts   from './components/table/contacts.ts';

  const print                   = item => console.log(item.detail);
  const data                    = writable(contacts);
  const headers: types.Header[] = [
    {align: types.ALIGNMENT.LEFT, width: types.WIDTH.FOUR, key: 'names.first', title: 'Nome'},
    {align: types.ALIGNMENT.LEFT, width: types.WIDTH.FOUR, key: 'names.last', title: 'Cognome'},
    {align: types.ALIGNMENT.LEFT, width: types.WIDTH.FOUR, key: 'names.company', title: 'Azienda'},
    {align: types.ALIGNMENT.LEFT, width: types.WIDTH.FOUR, key: 'email', title: 'Email'},
    {align: types.ALIGNMENT.RIGHT, width: types.WIDTH.THREE, key: 'phone', title: 'Telefono'}
  ];

  function filter(name) {
    data.set(contacts.filter(item => item.names.first === name));
  }

</script>

<main>
  <div class="ui basic segment">
    <button class="ui button" on:click={filter.bind(null, 'Luigi')}>Filter: Luigi</button>
    <button class="ui button" on:click={filter.bind(null, 'Luca')}>Filter: Luca</button>
    <button class="ui button" on:click={() => data.set(contacts)}>Reset</button>
  </div>
  <TableView {data} {headers} show_headers="{false}" on:select={print}/>
</main>
