'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"6480589508a7fb99895cef2e_BHC-Offerstack-flashy-leaves_LD.jpg": "79b6723d2ab3206a7f8b664d281c6bd0",
"assets/AssetManifest.bin": "e150092bc495c0e7cc30603547a1e5fc",
"assets/AssetManifest.bin.json": "6e7a37e7a00cd7871823fd0c0dc42fb7",
"assets/AssetManifest.json": "415aaab65d547e9fc703d81d22120069",
"assets/assets/audios/favicon.png": "5dcef449791fa27946b3d35ad8803796",
"assets/assets/fonts/favicon.png": "5dcef449791fa27946b3d35ad8803796",
"assets/assets/fonts/RecklessNeue-Book.otf": "d41d8cd98f00b204e9800998ecf8427e",
"assets/assets/fonts/Roboto-Medium.ttf": "68ea4734cf86bd544650aee05137d7bb",
"assets/assets/fonts/Roboto-Regular.ttf": "8a36205bd9b83e03af0591a004bc97f4",
"assets/assets/images/%255BHAIRQARE%255D-%255BLOGO%255D-periwinkle_1.png": "81c965f67eb360a391161ad1892f35ad",
"assets/assets/images/%255BHAIRQARE%255D-%255BLOGO%255D-white.png": "804f5d6f4c2bf78f2a8947d14e105047",
"assets/assets/images/6480589508a7fb99895cef2e_BHC-Offerstack-flashy-leaves_LD.jpg": "79b6723d2ab3206a7f8b664d281c6bd0",
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
"assets/assets/lottie_animations/favicon.png": "5dcef449791fa27946b3d35ad8803796",
"assets/assets/pdfs/favicon.png": "5dcef449791fa27946b3d35ad8803796",
"assets/assets/rive_animations/blue_gradient_loading_bar.riv": "d21923cb3962481e1268082651092de7",
"assets/assets/rive_animations/favicon.png": "5dcef449791fa27946b3d35ad8803796",
"assets/assets/rive_animations/Rive_Editor_liquid_download.riv": "dfca69c81f0699b68eceddeb61759a52",
"assets/assets/rive_animations/scrollgrey.riv": "bcdf55b71db3905390bd09f678062a89",
"assets/assets/rive_animations/timer_ios.riv": "7caf8061aef106cfeee6c9d4f67d6de8",
"assets/assets/videos/favicon.png": "5dcef449791fa27946b3d35ad8803796",
"assets/FontManifest.json": "3c3f6ef1fc3a9f55e8dfb1e97356f625",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/NOTICES": "28c9b7a8e954d4245dfddc7c5c36b535",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "b93248a553f9e8bc17f1065929d5934b",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "f25e8e701660fb45e2a81ff3f43c6d5c",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "a5d7457fda15b7622c14f432ba63039a",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "b72c617acdf2227c8b1413215f620711",
"assets/packages/wakelock_plus/assets/no_sleep.js": "7748a45cd593f33280669b29c2c8919a",
"assets/packages/youtube_player_iframe/assets/player.html": "fedadd807717e2e72a56a1117ebb1338",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "738255d00768497e86aa4ca510cce1e1",
"canvaskit/canvaskit.js.symbols": "74a84c23f5ada42fe063514c587968c6",
"canvaskit/canvaskit.wasm": "9251bb81ae8464c4df3b072f84aa969b",
"canvaskit/chromium/canvaskit.js": "901bb9e28fac643b7da75ecfd3339f3f",
"canvaskit/chromium/canvaskit.js.symbols": "ee7e331f7f5bbf5ec937737542112372",
"canvaskit/chromium/canvaskit.wasm": "399e2344480862e2dfa26f12fa5891d7",
"canvaskit/skwasm.js": "5d4f9263ec93efeb022bb14a3881d240",
"canvaskit/skwasm.js.symbols": "c3c05bd50bdf59da8626bbe446ce65a3",
"canvaskit/skwasm.wasm": "4051bfc27ba29bf420d17aa0c3a98bce",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03",
"Email_profile_img.svg": "d1ee7fa14e2e1a0336047efacad9199d",
"favicon.png": "2704101cb06ce66e2000356a312be25c",
"flutter.js": "383e55f7f3cce5be08fcf1f3881f585c",
"flutter_bootstrap.js": "0c8d7e02dc8dc2e1cb378b7730bf62b8",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "a266741b35a3a0832992813c81eb3fff",
"/": "a266741b35a3a0832992813c81eb3fff",
"main.dart.js": "89a3c950e0445e0c874bb38b342773f9",
"version.json": "81c18a1fc3bca3c183d40942ae8665fa"};
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
