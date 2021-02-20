<script>
  import Table from './components/table/Table.svelte';
  import contacts from './components/table/contacts.js';
  import Store from './components/table/Store';

  const store       = Store(contacts.map(contact => ({
    id:         contact.id,
    name_first: contact.names.first,
    name_last:  contact.names.last,
    phone:      contact.phone,
    email:      contact.email,
    membership: contact.membership.key,
    amount:     contact.membership.amount || 0
  })));
  const options     = {
    columns:      {name_first: 'nome', name_last: 'cognome', phone: 'telefono', email: 'e-mail'},
    show_search:  true,
    show_headers: true,
    show_footer:  true,
    icon:         row => row.membership === 'family-member' ? 'users' : null,
    marker:       row => row.amount !== 114 ? 'red' : null
  };
  const memberships = new Set(contacts.map(contact => contact.membership.key));
  const filter      = name => () => store.filter(item => item.membership === name);
</script>

<div class="ui basic segment">
  <div class="ui buttons fluid">
    {#each [...memberships].sort() as name}
      <button class="ui basic blue button" on:click={filter(name)}>{name}</button>
    {/each}

    <button class="ui basic red button" on:click={() => store.reset()}>Reset filter</button>
  </div>

  <Table {store} {options} on:select={item => console.log(item.detail)}/>
</div>