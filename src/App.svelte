<script>
  import Table from './components/table/Table.svelte';
  import contacts from './components/table/contacts.js';
  import Store from './components/table/Store';

  const headers = ['nome', 'cognome', 'telefono', 'email'];
  const store   = Store(contacts.filter(item => item.email).map(contact => {
    return {
      id:       contact.id,
      nome:     contact.names.first,
      cognome:  contact.names.last,
      telefono: contact.phone,
      email:    contact.email
    };
  }));
  const filter  = name => () => store.filter(item => item.nome === name);
</script>

<main>
  <div class="ui basic segment">
    <button class="ui button" on:click={filter('Franco')}>Filter by Name = Franco</button>
    <button class="ui button" on:click={filter('Roberto')}>Filter by Name = Roberto</button>
    <button class="ui button" on:click={()=>store.reset()}>Reset filter</button>
  </div>

  <Table {store} {headers} on:select={item => console.log(item.detail)}/>
</main>