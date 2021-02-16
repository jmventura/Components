<script>
  import TableView, {Store} from './components/table/Table.svelte';
  import contacts from './components/table/contacts.js';

  const mappings = {
    id:       'id',
    nome:     'names.first',
    cognome:  'names.last',
    telefono: 'phone',
    email:    'email'
  };
  const print    = item => console.log(item.detail);
  const store    = Store(contacts.filter(item => item.email), mappings);
  const filter   = name => () => store.rows.filter(item => item['nome'] === name);
</script>

<main>
  <div class="ui basic segment">
    <button class="ui button" on:click={filter('Franco')}>Filter by Name = Franco</button>
    <button class="ui button" on:click={filter('Paolo')}>Filter by Name = Paolo</button>
    <button class="ui button" on:click={store.rows.reset}>Reset filter</button>
  </div>

  <TableView {store} headers="{true}" search="{true}" on:select={print}/>
</main>