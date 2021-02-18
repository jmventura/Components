import {writable, get} from 'svelte/store';

export default function Store(records) {
  let cache = records;
  const f   = writable(null);

  const store    = writable(cache);
  const criteria = writable('');

  criteria.subscribe(pattern => {
    if (pattern) return apply(get(f));

    if (get(f)) {
      store.set(cache.filter(get(f)));
    } else {
      store.set(cache);
    }
  });

  f.subscribe(apply);

  function reset(records) {
    if (records) cache = records;

    store.set(cache);
    criteria.set('');
    f.set(null);
  }

  function apply(filter) {
    if (filter) {
      store.set(cache.filter(filter).filter(search));
    } else {
      store.set(cache.filter(search));
    }
  }

  function filter(fn) {
    f.set(fn);
  }

  function search(item) {
    const values = Object.keys(item).filter(key => key !== 'id').map(key => item[key]);
    const string = values.map(value => value.toLowerCase()).join(' ');

    return string.includes(get(criteria).toLowerCase());
  }

  return {...store, reset, filter, criteria};
}