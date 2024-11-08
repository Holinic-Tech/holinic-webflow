'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"6480589508a7fb99895cef2e_BHC-Offerstack-flashy-leaves_LD.jpg": "79b6723d2ab3206a7f8b664d281c6bd0",
"assets/AssetManifest.bin": "5b705416b7607b45e550a301e72ad233",
"assets/AssetManifest.bin.json": "fcccc3a2dc2844d461869b7d68b7e16e",
"assets/AssetManifest.json": "3a11c170934ffc2c333942619c6472b3",
"assets/assets/audios/favicon.png": "5dcef449791fa27946b3d35ad8803796",
"assets/assets/fonts/favicon.png": "5dcef449791fa27946b3d35ad8803796",
"assets/assets/fonts/RecklessNeue-Book.otf": "d41d8cd98f00b204e9800998ecf8427e",
"assets/assets/fonts/Roboto-Regular.ttf": "8a36205bd9b83e03af0591a004bc97f4",
"assets/assets/images/%255BHAIRQARE%255D-%255BLOGO%255D-periwinkle_1.png": "81c965f67eb360a391161ad1892f35ad",
"assets/assets/images/6480589508a7fb99895cef2e_BHC-Offerstack-flashy-leaves_LD.jpg": "79b6723d2ab3206a7f8b664d281c6bd0",
"assets/assets/images/Caution.png": "5068896a6baf0bf5bfce0a408ed1e03b",
"assets/assets/images/favicon.png": "5dcef449791fa27946b3d35ad8803796",
"assets/assets/images/Group_39948.png": "f239795cf36c1964e1447d94b1ed39bf",
"assets/assets/images/Group_39949.png": "4780aa56d95ed0844745c4399286ce84",
"assets/assets/images/Question_1_-_Wavy.svg": "24ce4ff3c4a8473424b1ac590b54c293",
"assets/assets/images/Question_2_-_Damage_Hair.svg": "1ce4d6c8c2dd3cce48732c4e35b9a722",
"assets/assets/images/Question_2_-_Hair_loss.svg": "ce0a8a5dd3944c7f1feb1146b50eb78e",
"assets/assets/images/Question_2_-_Irritation.svg": "e0b74a47396f17cacd206926e337ec8d",
"assets/assets/images/Question_2_-_other.svg": "60b9b65f231ae7c69921bdb878a37c5f",
"assets/assets/images/Question_2_-_Split_ends.svg": "6c03f9145502631ae6d9951610a53884",
"assets/assets/images/Question_4_-_1.png": "885cea3fc10c5aee322a186d1d3f41db",
"assets/assets/images/Question_4_-_2.png": "5a0738741886d5aada50dc4705ba6b26",
"assets/assets/images/Question_4_-_3.png": "37c3fb624d1a91962b996fb98ed646ff",
"assets/assets/images/Question_4_-_4.png": "983185f5b5201451ca37b15f0397b08b",
"assets/assets/images/Question_4_-_5.png": "fdabfc5f505b2c80d3ea6e125b01eb88",
"assets/assets/images/Question_6_-_Balanced_Diet.webp": "a4a12f3d6ba93a7210cd79061a842011",
"assets/assets/images/Question_6_-_Researhed_Diet.webp": "fb4e5ff0c2292c2d205a6c7bc78fe58a",
"assets/assets/images/Question_6_-_Unhealthy_Diet.webp": "d668f673220be99c4b61c76aa18fd08b",
"assets/assets/jsons/favicon.png": "5dcef449791fa27946b3d35ad8803796",
"assets/assets/pdfs/favicon.png": "5dcef449791fa27946b3d35ad8803796",
"assets/assets/rive_animations/blue_gradient_loading_bar.riv": "d21923cb3962481e1268082651092de7",
"assets/assets/rive_animations/favicon.png": "5dcef449791fa27946b3d35ad8803796",
"assets/assets/rive_animations/purple_loader_(2).riv": "4bb9e62f9bd3e712abcdb9e76920672b",
"assets/assets/rive_animations/Rive_Editor_liquid_download.riv": "dfca69c81f0699b68eceddeb61759a52",
"assets/assets/rive_animations/scrollgrey.riv": "bcdf55b71db3905390bd09f678062a89",
"assets/assets/videos/favicon.png": "5dcef449791fa27946b3d35ad8803796",
"assets/FontManifest.json": "3c3f6ef1fc3a9f55e8dfb1e97356f625",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/NOTICES": "e4ef841946b39ba64d25262cf320e582",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "b93248a553f9e8bc17f1065929d5934b",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "17ee8e30dde24e349e70ffcdc0073fb0",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "f3307f62ddff94d2cd8b103daf8d1b0f",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "04f83c01dded195a11d21c2edf643455",
"assets/packages/wakelock_plus/assets/no_sleep.js": "7748a45cd593f33280669b29c2c8919a",
"assets/packages/youtube_player_iframe/assets/player.html": "fedadd807717e2e72a56a1117ebb1338",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "66177750aff65a66cb07bb44b8c6422b",
"canvaskit/canvaskit.js.symbols": "48c83a2ce573d9692e8d970e288d75f7",
"canvaskit/canvaskit.wasm": "1f237a213d7370cf95f443d896176460",
"canvaskit/chromium/canvaskit.js": "671c6b4f8fcc199dcc551c7bb125f239",
"canvaskit/chromium/canvaskit.js.symbols": "a012ed99ccba193cf96bb2643003f6fc",
"canvaskit/chromium/canvaskit.wasm": "b1ac05b29c127d86df4bcfbf50dd902a",
"canvaskit/skwasm.js": "694fda5704053957c2594de355805228",
"canvaskit/skwasm.js.symbols": "262f4827a1317abb59d71d6c587a93e2",
"canvaskit/skwasm.wasm": "9f0c0c02b82a910d12ce0543ec130e60",
"canvaskit/skwasm.worker.js": "89990e8c92bcb123999aa81f7e203b1c",
"Email_profile_img.svg": "d1ee7fa14e2e1a0336047efacad9199d",
"favicon.png": "2704101cb06ce66e2000356a312be25c",
"flutter.js": "f393d3c16b631f36852323de8e583132",
"flutter_bootstrap.js": "7245e1fb841c13c012d1267266439e76",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "5f4ed145b8e67055a5dc8238347ba5a7",
"/": "5f4ed145b8e67055a5dc8238347ba5a7",
"main.dart.js": "5cc21766ddaf29fcf639bf933f3856c0",
"version.json": "87fec4309906fc9d7f93ded9c47d86f6"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
