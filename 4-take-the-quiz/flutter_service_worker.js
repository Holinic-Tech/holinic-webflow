'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"6480589508a7fb99895cef2e_BHC-Offerstack-flashy-leaves_LD.jpg": "79b6723d2ab3206a7f8b664d281c6bd0",
"assets/AssetManifest.bin": "a6e1467d586dafb59c38900e506d9cfb",
"assets/AssetManifest.bin.json": "a5b0beb0ce39d56ea048d80a855b3d93",
"assets/AssetManifest.json": "6c94c7b3d456a187841f627a41861614",
"assets/assets/audios/favicon.png": "5dcef449791fa27946b3d35ad8803796",
"assets/assets/fonts/favicon.png": "5dcef449791fa27946b3d35ad8803796",
"assets/assets/fonts/RecklessNeue-Book.otf": "d41d8cd98f00b204e9800998ecf8427e",
"assets/assets/fonts/RecklessNeue-Book.ttf": "26127cb3331c52aa15260ddebd8d2de9",
"assets/assets/images/10-20.png": "414a079cd52bb1f4c30d35aaa921ce46",
"assets/assets/images/18.png": "ca5bef15d345861547d3a96d9d5c7489",
"assets/assets/images/1814.png": "8453bac35313e85245ac50f3322c657e",
"assets/assets/images/20-30.png": "72a5f6ebd788193b19af78fcc981649d",
"assets/assets/images/25-34.png": "2c5489859c33da145733f90d3c3344db",
"assets/assets/images/35-44.png": "f34257a430d9a8a2b873559b8acefe96",
"assets/assets/images/45+.png": "0069eb17eecc1bf8249f748242f6f05b",
"assets/assets/images/6480589508a7fb99895cef2e_BHC-Offerstack-flashy-leaves_LD.jpg": "79b6723d2ab3206a7f8b664d281c6bd0",
"assets/assets/images/coily.png": "043877baa98d2dbbcdd70d181d0fe28f",
"assets/assets/images/curly.png": "c265c9175acae3451757494c529a8a65",
"assets/assets/images/damagefrfomdye.png": "107a59785355a7fcfb37a18433bf37a8",
"assets/assets/images/don't%2520know.png": "05fda2905c0f84abc57cde8df7be3d86",
"assets/assets/images/dont_know.png": "05fda2905c0f84abc57cde8df7be3d86",
"assets/assets/images/favicon.png": "5dcef449791fa27946b3d35ad8803796",
"assets/assets/images/hairloss.png": "7247de656f113ddf80502ad24facc18e",
"assets/assets/images/hairqare-removebg-preview.png": "2935a31293d17cfb100565fa8422d8cd",
"assets/assets/images/hairqare.png": "ddbbd36c4d0cac335cd9186381b0ee20",
"assets/assets/images/How_much_do_you_spend_on_a_bottle_of_shampoo_-_10-20.svg": "f1171458794999b2773056e13ea9efc2",
"assets/assets/images/How_much_do_you_spend_on_a_bottle_of_shampoo_-_20-50.svg": "8f739a7a79a600f0de283e8c952eea28",
"assets/assets/images/How_much_do_you_spend_on_a_bottle_of_shampoo_-_less_than_10.svg": "002eb5ce016ee0759689f6265df48453",
"assets/assets/images/How_much_do_you_spend_on_a_bottle_of_shampoo_-_More_than_50.svg": "8405da3aa3e542150ac3f1ee4c62654e",
"assets/assets/images/How_old_are_you_-_18-24.svg": "6c20863c7102593eb69962632436e606",
"assets/assets/images/How_old_are_you_-_25-34.svg": "73b007e90edd670a66dd079452ad7d9c",
"assets/assets/images/How_old_are_you_-_35-44.svg": "c686ea8bba1051ce05996558cb5fa522",
"assets/assets/images/How_old_are_you_-_45+.svg": "74dfe6b31f1e83ca52411ac31f5d6976",
"assets/assets/images/How_old_are_you_-_Under_18.svg": "6cea3037a93b5c876b6a8c7c5ac3a60d",
"assets/assets/images/Irritationdandruff.png": "489e86ad3f6b51f3fa2ea86dfb570844",
"assets/assets/images/less%2520than%252010.png": "9ef300f28503a7108e318993ac68d2d1",
"assets/assets/images/less_than_10.png": "9ef300f28503a7108e318993ac68d2d1",
"assets/assets/images/more%2520than%252050.png": "fef7d06c2d1e03280dfefb10ce1b409e",
"assets/assets/images/more_than_50.png": "fef7d06c2d1e03280dfefb10ce1b409e",
"assets/assets/images/other.png": "ca0764b98b04c157f4fff53bfa5a804b",
"assets/assets/images/split.png": "271f36deb7a388a6a525b59787009e41",
"assets/assets/images/straight.png": "bd912e3949296f7fc07c5071266ab622",
"assets/assets/images/svgimage.svg": "e3ef97598a49efac52dae966259f660c",
"assets/assets/images/unnamed%2520(1).png": "c98b2f4a43edd7714ab8e0981959a91b",
"assets/assets/images/unnamed%2520(2).png": "15a4e8d9b4f65b85f89929468b3b4d8b",
"assets/assets/images/unnamed%2520(3).png": "eedf45d9c1120281db401b78b2e45f3a",
"assets/assets/images/unnamed.png": "ebd4cda4226feab4f95fc99d4d86125f",
"assets/assets/images/unnamed_(1).png": "c98b2f4a43edd7714ab8e0981959a91b",
"assets/assets/images/unnamed_(2).png": "15a4e8d9b4f65b85f89929468b3b4d8b",
"assets/assets/images/unnamed_(3).png": "eedf45d9c1120281db401b78b2e45f3a",
"assets/assets/images/wavy.png": "8a5de70d5ff1b6583fa6b0e913e2e991",
"assets/assets/images/What_best_describes_your_diet_-_Healthy_Diet.webp": "f4adf843272e47362a0aa7e2545e6dca",
"assets/assets/images/What_best_describes_your_diet_-_None.webp": "a8262e34a89817a3de7af93d3f3c13a4",
"assets/assets/images/What_best_describes_your_diet_-_Special_Diet.webp": "1a699cf2382f471600db275926d81a96",
"assets/assets/images/What_best_describes_your_diet_-_Unhealthy_Diet.webp": "19641ec3e280283f4172b8f3b23d29a5",
"assets/assets/images/What_best_describes_your_hair_problems_-_Damage.svg": "fecead8545067106beff478ad8387b6d",
"assets/assets/images/What_best_describes_your_hair_problems_-_Hair_Loss.svg": "6aed6c3d3a10575a6ed2277cb4634b74",
"assets/assets/images/What_best_describes_your_hair_problems_-_Irritation_or_dandruff.svg": "93b62cbcbfdf178c90fd8c5dd018ccc2",
"assets/assets/images/What_best_describes_your_hair_problems_-_Other.svg": "015128892d955a3c89c9ed5d4b3ce883",
"assets/assets/images/What_best_describes_your_hair_problems_-_Split_ends.svg": "069ee62d383b8ded747cd0f012f639d1",
"assets/assets/images/Which_hair_type_do_you_have_-_Coily.svg": "6b3a39c6ecc5fa6f30b0d5667504649f",
"assets/assets/images/Which_hair_type_do_you_have_-_Curly.svg": "fe949ac24c76301227920b4302668699",
"assets/assets/images/Which_hair_type_do_you_have_-_I_Dont_Know.svg": "d0f9aded5aee179cc1ebfd81bb0518b0",
"assets/assets/images/Which_hair_type_do_you_have_-_Straight.svg": "bbe6981d122bd85b8d62c52bfcd8433a",
"assets/assets/images/Which_hair_type_do_you_have_-_Wavy.svg": "9498261bc9b2e599ba47a1c98e0c45d3",
"assets/assets/lottie_animations/circelanimation-notext.json": "4a9efd15464be7f823782314b025aff7",
"assets/assets/lottie_animations/favicon.png": "5dcef449791fa27946b3d35ad8803796",
"assets/assets/pdfs/favicon.png": "5dcef449791fa27946b3d35ad8803796",
"assets/assets/rive_animations/favicon.png": "5dcef449791fa27946b3d35ad8803796",
"assets/assets/rive_animations/Rive_Editor_liquid_download.riv": "dfca69c81f0699b68eceddeb61759a52",
"assets/assets/videos/favicon.png": "5dcef449791fa27946b3d35ad8803796",
"assets/FontManifest.json": "7eae4aaf01b3d82d08617fdb34141240",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/NOTICES": "00e99205779eb1760b575876dbeaa414",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "b93248a553f9e8bc17f1065929d5934b",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "f25e8e701660fb45e2a81ff3f43c6d5c",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "a5d7457fda15b7622c14f432ba63039a",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "b72c617acdf2227c8b1413215f620711",
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
"flutter_bootstrap.js": "9314b3b0d7d8bca47a5383afcf0953b7",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "f3c5f3ddb3349418c39225ab5396135c",
"/": "f3c5f3ddb3349418c39225ab5396135c",
"main.dart.js": "1496c048da1bc987229f44dc51caabc8",
"manifest.json": "3cd2d2a2052c0896ba6e1d45fe72eb8c",
"version.json": "dbc825e96eca3e040f92422c13c41da9"};
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
