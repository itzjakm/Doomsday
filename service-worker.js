/*
Copyright 2015, 2019, 2020, 2021 Google LLC. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

// Incrementing OFFLINE_VERSION will kick off the install event and force
// previously cached resources to be updated from the network.
// This variable is intentionally declared and unused.
// Add a comment for your linter if you want:
// eslint-disable-next-line no-unused-vars
const OFFLINE_VERSION = 1;
const CACHE_NAME = 'offline';
// Customize this with a different URL if needed.
const OFFLINE_URL = './index.html';

self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(OFFLINE_VERSION + CACHE_NAME);
      // Setting {cache: 'reload'} in the new request will ensure that the
      // response isn't fulfilled from the HTTP cache; i.e., it will be from
      // the network.
      await cache.addAll(['/', 'style.css', 'script.js']);
    })()
  );
  // Force the waiting service worker to become the active service worker.
  // self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  /* Just like with the install event, event.waitUntil blocks activate on a promise.
     Activation will fail unless the promise is fulfilled.
  */
  console.log('WORKER: activate event in progress.');

  event.waitUntil(
    caches
      /* This method returns a promise which will resolve to an array of available
         cache keys.
      */
      .keys()
      .then(function (keys) {
        // We return a promise that settles when all outdated caches are deleted.
        return Promise.all(
          keys
            .filter(function (key) {
              // Filter by keys that don't start with the latest version prefix.
              return !key.startsWith(OFFLINE_VERSION);
            })
            .map(function (key) {
              /* Return a promise that's fulfilled
                 when each outdated cache is deleted.
              */
              return caches.delete(key);
            })
        );
      })
      .then(function () {
        console.log('WORKER: activate completed.');
      })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    /* If we don't block the event as shown below, then the request will go to
       the network as usual.
    */
    console.log(
      'WORKER: fetch event ignored.',
      event.request.method,
      event.request.url
    );
    return;
  }
  event.respondWith(
    (async () => {
      /* const cached = await caches.match(event.request);
      const networked = await fetch(event.request)
        .then(fetchedFromNetwork, unableToResolve)
        .catch(unableToResolve);
      console.log(networked);
      return cached || networked; */
      try {
        const networkResponse = await fetch(event.request);
        // console.log('From network');
        return networkResponse;
      } catch (error) {
        const cached = await caches.match(event.request);
        // console.log('From cache');
        return cached;
      }
    })()
  );

  // If our if() condition is false, then this fetch handler won't intercept the
  // request. If there are any other fetch handlers registered, they will get a
  // chance to call event.respondWith(). If no fetch handlers call
  // event.respondWith(), the request will be handled by the browser as if there
  // were no service worker involvement.
});
