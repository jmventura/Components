import {writable, get} from 'svelte/store';

export default function Store(records) {
  let cache             = records;
  const store           = writable(cache);
  const filter_criteria = writable(null);
  const search_criteria = writable('');

  search_criteria.subscribe(pattern => {
    if (pattern) return apply(get(filter_criteria));

    if (get(filter_criteria)) {
      store.set(cache.filter(get(filter_criteria)));
    } else {
      store.set(cache);
    }
  });

  filter_criteria.subscribe(apply);

  function reset(records) {
    if (records) cache = records;

    filter_criteria.set(null);
  }

  function apply(filter) {
    if (filter) {
      store.set(cache.filter(filter).filter(search));
    } else {
      store.set(cache.filter(search));
    }
  }

  function filter(fn) {
    filter_criteria.set(fn);
  }

  function search(item) {
    const values = Object.keys(item).filter(key => key !== 'id').map(key => item[key]);
    const string = values.map(value => value.toLowerCase()).join(' ');

    return string.includes(get(search_criteria).toLowerCase());
  }

  return {...store, reset, filter, criteria: search_criteria};
}