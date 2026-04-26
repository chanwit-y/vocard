/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-5a5d9309'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();

  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "index.html",
    "revision": "3cc32bd539ddaf463604d2a1461f99cb"
  }, {
    "url": "icon-512.png",
    "revision": "e55556f76c26609dc86f3f18096d627a"
  }, {
    "url": "icon-192.png",
    "revision": "e08ff7511dabbe9309ae011161e08090"
  }, {
    "url": "favicon.svg",
    "revision": "d779516cfcb025d23f17a08c437fa93a"
  }, {
    "url": "data.json",
    "revision": "40b64c6bd69c4e23e9f548bf4b454209"
  }, {
    "url": "assets/workbox-window.prod.es5-vqzQaGvo.js",
    "revision": null
  }, {
    "url": "assets/index-Dc6MYAV5.css",
    "revision": null
  }, {
    "url": "assets/index-DKIEtlf7.js",
    "revision": null
  }, {
    "url": "favicon.svg",
    "revision": "d779516cfcb025d23f17a08c437fa93a"
  }, {
    "url": "icon-192.png",
    "revision": "e08ff7511dabbe9309ae011161e08090"
  }, {
    "url": "icon-512.png",
    "revision": "e55556f76c26609dc86f3f18096d627a"
  }, {
    "url": "manifest.webmanifest",
    "revision": "f48b388ba328da7969deb34cec356e8a"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));

}));
