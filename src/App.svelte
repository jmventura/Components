<script>
  import Table from './components/table/Table.svelte';
  import contacts from './components/table/contacts.js';
  import Store from './components/table/Store';

  const store = Store(contacts.filter(item => item.email).map(contact => ({
    id:         contact.id,
    name_first: contact.names.first,
    name_last:  contact.names.last,
    phone:      contact.phone,
    email:      contact.email,
    membership: contact.membership.key,
    amount:     contact.membership.amount || 0
  })));

  const options = {
    columns:      {name_first: 'nome', name_last: 'cognome', phone: 'telefono', email: 'e-mail'},
    show_search:  true,
    show_headers: true,
    show_footer:  true,
    icon:         row => row.membership !== 'regular' ? 'users' : null,
    marker:       row => row.amount !== 114 ? 'red' : null
  };

  const filter = name => () => store.filter(item => item.name_first === name);
</script>

<main>
  <div class="ui basic segment">
    <div class="ui buttons fluid">
      <button class="ui blue button" on:click={filter('Franco')}>Filter by Name = Franco</button>
      <button class="ui blue button" on:click={filter('Roberto')}>Filter by Name = Roberto</button>
      <button class="ui blue button" on:click={filter('Stefano')}>Filter by Name = Stefano</button>
      <button class="ui red button" on:click={()=>store.reset()}>Reset filter</button>
    </div>
  </div>

  <Table {store} {options} on:select={item => console.log(item.detail)}/>
</main>