import {writable} from 'svelte/store';

export default function Store(records) {
  let cache      = records;
  const criteria = {search: '', filter: null};
  const rows     = writable(cache);

  function apply(variable, value) {
    criteria[variable] = value;

    const found = !criteria.search ? cache : cache.filter(item => {
      const values = Object.keys(item).filter(key => key !== 'id').map(key => item[key]);
      const string = values.map(value => value ? value.toString().toLowerCase() : '').join(' ');

      return string.includes(criteria.search);
    });

    rows.set(criteria.filter ? found.filter(criteria.filter) : found);
  }

  const filter = fn => apply('filter', fn);
  const search = pattern => apply('search', pattern);

  function reset(records) {
    if (records) cache = records;

    apply('filter', null);
  }

  return {...rows, reset, filter, search};
}