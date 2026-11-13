const CACHE_NAME = 'mobile-studio-pwa-v2026.11h';
const urlsToCache = [
    './',
    './index.html',
    './player.html',
    './loops.html',
    './fonts/fonts.css',
    './style.css?v=2026.11h',
    './script.js?v=2026.11h',
    './player.js?v=2026.11h',
    './rec_buffer.js?v=2026.11h',
    './about.html',
    './portfolio.html',
    './services.html',
    './contact.html',
    './privacy.html',
    './offline.html',
    './icon-192.png',
    './icon-512.png',
    './DE.png',
    './EN.jpg',
    './PL.png',
    './ES.png',
    './Facebook.png',
    './Instagram.png',
    './YouTube.png',
    './SMARTPHONE_TABLET_ASSETS/Beatcloud_Emblem.png',
    './sounds/vplayer_demos/crocketts_theme.mp3',
    './sounds/vplayer_demos/dance_of_the_protons.mp3',
    './sounds/vplayer_demos/edm_phantom.mp3',
    './sounds/vplayer_demos/marv_x_2_ts.mp3',
    './sounds/vplayer_demos/new_indian_world.mp3',

    // Studio Loops
    './sounds/loops/Cinematic Dark/VIR2OSE_Cinematic_1.wav',
    './sounds/loops/Hard-Hitting Drill/VIR2OSE_Drill_1.wav',
    './sounds/loops/Industrial Techno/Techno_1.wav',
    './sounds/loops/Luxury Lofi/VIR2OSE_Lofi_1.wav',
    './sounds/loops/Melodic House/VIR2OSE_House_1.wav',

    './SMARTPHONE_TABLET_ASSETS/Background_iPAD_Tablet.webp',
    './SMARTPHONE_TABLET_ASSETS/Background_iPAD_Tablet.png',
    './SMARTPHONE_TABLET_ASSETS/Background_Subpages_Clean.webp',
    './SMARTPHONE_TABLET_ASSETS/Background_Subpages_Clean.png',
    './SMARTPHONE_TABLET_ASSETS/Logo_Kopfzeile_tight.png',
    './SMARTPHONE_TABLET_ASSETS/16_step_sequencer_tight.png',
    './SMARTPHONE_TABLET_ASSETS/Lyrics_Glass_tight.png',
    './SMARTPHONE_TABLET_ASSETS/Quer_Clean.png',
    './SMARTPHONE_TABLET_ASSETS/Quer_Komplett.png',
    './SMARTPHONE_TABLET_ASSETS/fader_knob.png',
    './SMARTPHONE_TABLET_ASSETS/fader_knob_for_mixer.png',
    './SMARTPHONE_TABLET_ASSETS/fader_knob_for_swing.png',
    './NEUE_ASSETS_26/Landig_Background_Clean.png',
    './NEUE_ASSETS_26/V_logo.png',
    './NEUE_ASSETS_26/golden_head.png',
    './NEUE_ASSETS_26/V_Chopper.png',
    './NEUE_ASSETS_26/V_SPH3RE.png',

    // LoFi_Retro SoundSet
    './NEUE_ASSETS_26/SoundSets_Beatcloud/LoFi_Retro/Kick_LoFi_vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/LoFi_Retro/Snare_LoFi_vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/LoFi_Retro/Clap_LoFi_vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/LoFi_Retro/HiHat_Closed_LoFi_vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/LoFi_Retro/HiHat_Open_LoFi_vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/LoFi_Retro/Congas1_LoFi_vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/LoFi_Retro/Congas2_LoFi_vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/LoFi_Retro/Cowbell_LoFi_vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/LoFi_Retro/Cymbal_LoFi_vir2ose.wav',

    // Organic SoundSet
    './NEUE_ASSETS_26/SoundSets_Beatcloud/Organic/Kick_Organic_vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/Organic/Snare_Organic_vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/Organic/Claps_Organic_vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/Organic/HiHat_Closed_Organic_vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/Organic/HiHat_Open_Organic_vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/Organic/Congas1_Organic_vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/Organic/Congas2_Organic_vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/Organic/Cowbell_Organic_vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/Organic/Shaker_Organic_vir2ose.wav',

    // Urban_Trap SoundSet
    './NEUE_ASSETS_26/SoundSets_Beatcloud/Urban_Trap/Kick_UrbanTrap_vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/Urban_Trap/Snare_UrbanTrap_vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/Urban_Trap/Clap_UrbanTrap_vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/Urban_Trap/HiHat_Closed_UrbanTrap_vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/Urban_Trap/HiHat_Open_UrbanTrap_vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/Urban_Trap/Congas1_UrbanTrap_vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/Urban_Trap/Congas2_UrbanTrap_vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/Urban_Trap/Cowbell_UrbanTrap_vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/Urban_Trap/Cymbal_UrbanTrap_vir2ose.wav',

    // POP SoundSet
    './NEUE_ASSETS_26/SoundSets_Beatcloud/POP/Kick_1_POP__vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/POP/Kick_2_POP__vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/POP/Snare_POP__vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/POP/Clap_POP__vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/POP/Clap_Long_POP__vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/POP/HiHat_POP__vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/POP/Cabasa_POP__vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/POP/Crash_POP__vir2ose.wav',

    // Classic_Rock SoundSet
    './NEUE_ASSETS_26/SoundSets_Beatcloud/Classic_Rock/Kick_1_Rock_vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/Classic_Rock/Kick_2_Rock_vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/Classic_Rock/Snare_Rock_vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/Classic_Rock/HiHat_Rock_vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/Classic_Rock/Ride_Bel_Rock_vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/Classic_Rock/Crash_Rock_vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/Classic_Rock/Tom_1_Rock_vir2ose.wav',
    './NEUE_ASSETS_26/SoundSets_Beatcloud/Classic_Rock/Tom_2_Rock_vir2ose.wav'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Mobile Studio Service Worker: Caching offline suite');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log('Mobile Studio Service Worker: Clearing old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request).then(networkResponse => {
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        return networkResponse;
                    }

                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });

                    return networkResponse;
                }).catch(() => {
                    if (event.request.mode === 'navigate') {
                        return caches.match('./offline.html');
                    }
                });
            })
    );
});
