<script>
  import TableView, {Store} from './components/table/Table.svelte';
  import contacts from './components/table/contacts.js';

  const mappings        = {
    id:       'id',
    nome:     'names.first',
    cognome:  'names.last',
    telefono: 'phone',
    email:    'email'
  };
  const print           = item => console.log(item.detail);
  const {columns, rows} = Store(contacts, mappings);
  const filter          = name => () => rows.filter(item => item['nome'] === name);
</script>

<main>
  <div class="ui basic segment">
    <button class="ui button" on:click={filter('Luigi')}>Filter: Luigi</button>
    <button class="ui button" on:click={filter('Luca')}>Filter: Luca</button>
    <button class="ui button" on:click={rows.reset}>Reset</button>
  </div>

  <TableView {columns} {rows} headers="{true}" searchbar="{true}" on:select={print}/>
</main>