import jwtDecode from 'jwt-decode';
import { empty, identity, clean, normalizeEntities } from './utils';

/* -------------------------------------------------------------------------
   ------------------------------- BARE API --------------------------------
   ------------------------------------------------------------------------- */


/* istanbul ignore next */
const root = '/api';


/* istanbul ignore next */
const store = window.localStorage;


/* istanbul ignore next */
let currentAccessToken = null;


/* istanbul ignore next */
const encode = encodeURIComponent;


function query(target, search = {}) {
  const params = Object.keys(search)
    .map((key) =>
      search[key] instanceof Array
        ? `${key}=${search[key].map(encode).join(':')}`
        : `${key}=${encode(search[key])}`
    )
    .filter(identity);

  return empty(params) ? target : `${target}?${params.join('&')}`;
}

Object.assign(query, { encode });


/**
 * TODO
 */
class APIError extends Error {

  constructor(code, message, data = {}) {
    super(message);
    this.code     = code;
    this.message  = message;
    this.data     = data;
  }

}


/**
 * Fetch asynchronously the given api resource with the provided config.
 *
 * @namespace api
 *
 * @param { string } endpoint The api endpoint requested.
 * @param { object } config The request configuration.
 * @param { body }   [config.body=null] The request payload, the request
 *                   defaults to a `GET` method when this argument is null, to
 *                   `POST` otherwise.
 * @param { ...any } [config.providedConfig=null] [Fetch parameters]
 *                   {@link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API}
 *                   to override automatic parameters.
 */
function api(endpoint, { body, ...providedConfig } = {}) {
  const headers = { 'content-type': 'application/json' };

  if (currentAccessToken)
    headers['Authorization'] = `Bearer ${currentAccessToken}`;

  const method = providedConfig.method || (body ? 'POST' : 'GET');
  const config = {
    method,
    ...providedConfig,
    headers: {
      ...headers,
      ...providedConfig.headers,
    },
  };

  let target = `${root}${endpoint}`;
  if (body)
    if (method === 'GET')
      target = query(target, clean(body));
    else
      config.body = JSON.stringify(clean(body));

  return window
    .fetch(target, config)
    .then((response) =>
      Promise.all([
        new Promise((resolve, _) => resolve(response.status)),
        (response.headers.get('Content-Type') || '').includes('application/json')
          ? response.json()
          : response.text(),
      ])
    )
    .then(([status, data]) => {
      if (status < 200 || status >= 300) throw { ...data, code: status };
      return data;
    });
}

/* -------------------------------------------------------------------------
   ------------------------------- AUTH API --------------------------------
   ------------------------------------------------------------------------- */

/**
 * A voucher of the user authorization. Claims are short lived and should be
 * renewed before their expiration.
 *
 * @typedef {Object} Claim
 *
 * @property {string} iss Issuer: The authority whom issued the token.
 * @property {number} nbf Not Before: The time, in seconds since epoch, at
 *                        which this token becomes valid.
 * @property {number} exp Expiration: The time, in seconds since epoch, at
 *                        which this token becomes invalid.
 * @property {string} sub Subject: The subject for whom the token was issued.
 */

/**
 * The auth object represents a dual token authentication mechanism. The first
 * token, the '''refresh token''', is delivered on login and is meant to be
 * long lived. Its sole purpose is to permit the request of a short lived
 * '''access token'''. The access token is a '''JSON Web Token''' claim, meant
 * to be used for resource protection and identity validation.
 *
 * Calling this object by itself will delegate the call to the api on the auth
 * API segment.
 *
 * @param {string}      endpoint The auth endpoint meant to be reached
 * @param {RequestInit} config   The request configuration
 *
 * @returns {Promise<any>} The request response
 */
async function auth(endpoint, config = {}) {
  return api(`/auth${endpoint}`, config);
}


Object.assign(auth, {

  /**
   * Clears all authentication state. This implies that API-wise, the user is
   * disconnected and his session is terminated. If authentication data is
   * preserved somewhere else, said data should be removed at the same time.
   */
  clear() {
    currentAccessToken = null;
    store.removeItem('__refresh_data__');
  },

  /**
   * Attempts to login the user with the given username and password. If the
   * authentication succeeds, this function will save the received refresh
   * token and attempt to retrieve an access token. Given that the refresh
   * lifetime is not known by this function, the backend may refuse the login
   * request if the user was already within a non-expired session.
   *
   * @param {string} username   The username
   * @param {string} password   The user password
   *
   * @returns {Promise<Claim>} The authentication voucher
   */
  async login(username, password) {
    return auth('/login', { body: { username, password } })
      .then(({ token }) => {
        store.setItem('__refresh_data__', `${username}:${token}`);
        return auth.refresh();
      });
  },

  /**
   * Attempts to logout the currently connected user. If the user is within an
   * expired session or not within a session at all, this function fails with a
   * 403 error code. In case of success, clears all authentication state.
   *
   * @returns {Promise<void>}
   */
  async logout() {
    const refreshData = store.getItem('__refresh_data__') || '';
    const [username, token] = refreshData.split(':');

    if (token !== null)
      await auth('/logout', { body: { username, token } });

    auth.clear();
  },

  /**
   * Attempts to retrieve an access token with the current refresh token. If
   * the user is within an expired session or not within a session at all, this
   * function fails with a 403 error code and clears all authentication state.
   *
   * @returns {Promise<Claim>} The authentication voucher
   */
  async refresh() {
    const refreshData = store.getItem('__refresh_data__') || '';
    const [username, token] = refreshData.split(':');

    if (!token)
      throw new APIError(403, 'Unable to find/parse local refresh token');

    try {
      const { access, refresh } = await auth(
        '/refresh',
        { body: { username, token } }
      );

      currentAccessToken = access;
      store.setItem('__refresh_data__', `${username}:${refresh}`);
      return jwtDecode(currentAccessToken);
    } catch (e) {
      auth.clear();
      throw e;
    }

  },

  async register(username, password, firstName, lastName, biopic) {
    return auth('/register', { body: {
      username, password, firstName, lastName, biopic
    } });
  },

  /**
   * Whether the auth currently possess a refresh token or not. In most
   * instances, this should be a direct representation of the session status.
   * However as the auth has no way to know of the refresh token lifetime, said
   * token may be expired and this function might return a wrong result.
   *
   * @returns {boolean} true if the auth is within a session, false otherwise.
   */
  inSession() {
    return store.getItem('__refresh_data__') !== null;
  },

  /**
   * Whether a user is currently connected. Contrary to the inSession call,
   * this function always returns a correct result.
   *
   * @returns {boolean} true if a user is connected, false otherwise.
   */
  connected() {
    if (currentAccessToken === null)
      return false;
    return jwtDecode(currentAccessToken).exp > Date.now();
  }

});

/* -------------------------------------------------------------------------
   ------------------------------- USER API --------------------------------
   ------------------------------------------------------------------------- */

/**
 * TODO
 */
async function user(endpoint = '', config = {}) {
  return api(`/user${endpoint}`, config);
}

Object.assign(user, {

  async all() {
    return user().then(normalizeEntities);
  },

  async following(id) {
    throw new Error('Not implemented');
  },

  async followers(id) {
    throw new Error('Not implemented');
  },

  async self() {
    return user('/self');
  },

  async byId(id) {
    return user(`/${id}`);
  },

  async update(id, diff) {
    return user(`/${id}`, { method: 'PUT', body: diff });
  },

});


/* -------------------------------------------------------------------------
   ------------------------------ SHAREA API -------------------------------
   ------------------------------------------------------------------------- */

/**
 * TODO
 */
async function sharea(endpoint = '', config = {}) {
  return api(`/sharea${endpoint}`, config);
}

Object.assign(sharea, {

  async all() {
    return sharea().then(normalizeEntities);
  },

  async byId(id) {
    return sharea(id);
  },

  async self() {
    return user('/self/sharea').then(normalizeEntities);
  },

  async update(id, diff) {
    return sharea(`/${id}`, { method: 'PUT', body: diff });
  },

  async create(shareaDefinition) {
    return sharea('', { method: 'POST', body: shareaDefinition });
  }

});


/* -------------------------------------------------------------------------
   ------------------------------ MEDIA API --------------------------------
   ------------------------------------------------------------------------- */

/**
 * TODO
 */
async function media(endpoint = '', config = {}) {
  return api(`/media${endpoint}`, config);
}

Object.assign(media, {

  async all() {
    return media().then(normalizeEntities);
  },

  async update(id, diff) {
    return media(`/${id}`, { method: 'PUT', body: diff });
  },

  async create(mediaDefinition) {
    return media('', { method: 'POST', body: mediaDefinition });
  }

});


Object.assign(api, { auth, user, sharea, media });


export default api;
