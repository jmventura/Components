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
  const store    = Store(contacts, mappings);
  const filter   = name => () => store.rows.filter(item => item['nome'] === name);
</script>

<main>
  <div class="ui basic segment">
    <button class="ui button" on:click={filter('Luigi')}>Filter by Name = Luigi</button>
    <button class="ui button" on:click={filter('Luca')}>Filter by Name = Luca</button>
    <button class="ui button" on:click={store.rows.reset}>Reset filter</button>
  </div>

  <TableView {store} headers="{true}" searchbar="{true}" on:select={print}/>
</main>