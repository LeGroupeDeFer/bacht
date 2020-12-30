
/* --------------------------------- Core ---------------------------------- */

export const identity = x =>
  x;


export const trace = x =>
  console.log(x) || x;


/* ------------------------------ Array utils ------------------------------ */

export const empty = xs =>
  xs instanceof Array && xs.length === 0;


export const head = xs =>
  xs.length ? xs[0] : null;


export const last = xs =>
  xs && xs.length ? xs[xs.length - 1] : null;


export const tail = xs =>
  xs && xs.length ? xs.slice(1) : null;


export const map = f => xs =>
  xs instanceof Array
    ? xs.map(f)
    : compose(fromEntries, map(([k, v]) => [k, f(v)]), entries)(xs);


export const filter = p => xs =>
  xs instanceof Array
    ? xs.filter(p)
    : compose(fromEntries, filter(([_, v]) => p(v)), entries)(xs);


export const zip = (...xs) =>
  xs.length ? xs[0].map((_, i) => xs.map(e => e[i])) : [];


export const takeUntil = p => xs => {
  const taken = [];
  for (const x of xs) {
    if (p(x)) break;
    taken.push(x);
  }
  return taken;
}


export const groupBy = kf => xs =>
  xs.reduce((a, x) => {
    const key = kf(x);
    return { ...a, [key]: [...(a[key] || []), x] };
  }, {})


export const sum = xs =>
  xs.reduce((x, a) => a + x, 0);


export const compose = (...fs) => o =>
  fs.reduceRight((a, f) => f(a), o);


/* ----------------------------- Object utils ------------------------------ */

export const keys = o =>
  Object.keys(o);


export const values = o =>
  Object.values(o);


export const entries = o =>
  Object.entries(o);


export const fromEntries = xs =>
  Object.fromEntries(xs);


export const defined = thing =>
  thing !== undefined && thing !== null;


export const truthy = thing =>
  thing instanceof Array ? thing.length : thing;


export const update = (o, k, v) =>
  ({ ...o, [k]: v });


export const clean = (o, hard = false) => {
  const predicate = hard ? truthy : defined;
  return Object
    .keys(o)
    .reduce((a, k) => predicate(o[k]) ? update(a, k, o[k]) : a, {});
}

export const normalizeEntities = xs =>
  xs.reduce((a, x) => ({ ...a, [x.id]: x }), {});

/* ------------------------------ Date utils ------------------------------- */

export const epoch = new Date(0);

export const now = () =>
  Date.now() / 1000;


/* ----------------------------- Function utils ---------------------------- */

export function debounce(fn, ms = 250) {
  if (ms <= 0) return fn;

  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, arguments);
    }, ms);
  };
}


export function delay(fn, ms = 250) {
  return ms === 0
    ? fn
    : () =>
      new Promise((resolve, _) =>
        setTimeout(() => resolve(fn.apply(this, arguments)), ms)
      );
}


export const prevent = fn => e =>
  e.preventDefault() || e.stopPropagation() || fn(e);


/* ----------------------------- Promise utils ----------------------------- */

export const subscribed = (promise, onResolve, onReject) => {
  let isSubscribed = true;
  promise
    .then(response => isSubscribed ? onResolve(response) : undefined)
    .catch(error => isSubscribed ? onReject(error) : undefined);
  return () => isSubscribed = false;
}

export const status = {
  IDLE:       'idle',
  LOADING:    'loading',
  SUCCEEDED:  'succeeded',
  FAILED:     'failed'
};

/* ----------------------------- String utils ------------------------------ */

export const capitalize = s => typeof s === 'string'
  ? `${s.charAt(0).toUpperCase()}${s.slice(1)}`
  : '';

/* ------------------------------------------------------------------------- */

export default {
  identity,
  trace,

  empty,
  head,
  last,
  tail,
  map,
  filter,
  zip,
  takeUntil,
  groupBy,
  sum,
  compose,

  keys,
  values,
  entries,
  fromEntries,
  defined,
  truthy,
  update,
  clean,
  normalizeEntities,

  epoch,
  now,

  debounce,
  delay,
  prevent,

  subscribed
};
