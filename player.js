// ──────────────── VIR2OSE HIGH-END AUDIO ENGINE (V-PLAYER) ────────────────
// Mobile Studio Pro PWA - Offline Audio Player with IndexedDB Persistence

(function () {
    'use strict';

    // Application State
    let tracks = [];
    let currentTrackIndex = -1;
    let isPlaying = false;
    let isShuffled = false;
    let repeatMode = 0; // 0: None, 1: All, 2: One
    let lastVolume = 0.85;

    // DOM Elements
    const audio = document.getElementById('main-audio');
    const playBtn = document.getElementById('play-btn');
    const playIcon = document.getElementById('play-icon');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const repeatBtn = document.getElementById('repeat-btn');

    const currentTitle = document.getElementById('current-title');
    const currentArtist = document.getElementById('current-artist');
    const coverImg = document.getElementById('cover-img');
    const trackCounter = document.getElementById('track-counter');
    const metaStats = document.getElementById('meta-stats');

    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const totalDurationEl = document.getElementById('total-duration');

    const volumeSlider = document.getElementById('volume-slider');
    const muteBtn = document.getElementById('mute-btn');
    const playlistEl = document.getElementById('playlist');
    const dropOverlay = document.getElementById('drop-overlay');

    const fileInput = document.getElementById('file-input');
    const folderInput = document.getElementById('folder-input');
    const btnAddFiles = document.getElementById('btn-add-files');
    const btnAddFolder = document.getElementById('btn-add-folder');
    const btnDemoTracks = document.getElementById('btn-demo-tracks');
    const btnClearPl = document.getElementById('btn-clear-pl');

    // Web Audio API Visualizer Setup
    const canvas = document.getElementById('fft-canvas');
    const canvasCtx = canvas ? canvas.getContext('2d') : null;
    let audioCtx = null;
    let analyser = null;
    let source = null;
    let visualizerRunning = false;

    // Demo Tracks from vir2ose Studio (Screen 2)
    const DEMO_TRACKS = [
        {
            title: 'NEW INDIAN WORLD - TERRA',
            artist: 'vir2ose',
            url: 'sounds/vplayer_demos/new_indian_world.mp3',
            isDemo: true
        },
        {
            title: 'EDM PHANTOM',
            artist: 'vir2ose',
            url: 'sounds/vplayer_demos/edm_phantom.mp3',
            isDemo: true
        },
        {
            title: 'MARV X 2 TS',
            artist: 'vir2ose',
            url: 'sounds/vplayer_demos/marv_x_2_ts.mp3',
            isDemo: true
        },
        {
            title: 'Crocketts Theme (vir2ose)',
            artist: 'vir2ose',
            url: 'sounds/vplayer_demos/crocketts_theme.mp3',
            isDemo: true
        },
        {
            title: 'Dance Of The Protons (with Melody)',
            artist: 'Waldemar Krucinski (vir2ose)',
            url: 'sounds/vplayer_demos/dance_of_the_protons.mp3',
            isDemo: true
        }
    ];

    // ──────────────── IndexedDB Persistence ────────────────
    const DB_NAME = 'vir2ose_vplayer_db';
    const DB_VERSION = 1;
    const STORE_NAME = 'tracks';

    function openDB() {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(DB_NAME, DB_VERSION);
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                }
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    async function saveTrackToDB(track) {
        try {
            const db = await openDB();
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const id = await new Promise((res, rej) => {
                const req = store.add(track);
                req.onsuccess = () => res(req.result);
                req.onerror = () => rej(req.error);
            });
            track.id = id;
            return id;
        } catch (e) {
            console.warn('IndexedDB save notice:', e);
        }
    }

    async function loadTracksFromDB() {
        try {
            const db = await openDB();
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            return new Promise((res, rej) => {
                const req = store.getAll();
                req.onsuccess = () => res(req.result || []);
                req.onerror = () => rej(req.error);
            });
        } catch (e) {
            console.warn('IndexedDB load notice:', e);
            return [];
        }
    }

    async function deleteTrackFromDB(id) {
        try {
            const db = await openDB();
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            store.delete(id);
        } catch (e) {
            console.warn('IndexedDB delete notice:', e);
        }
    }

    async function clearDB() {
        try {
            const db = await openDB();
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            store.clear();
        } catch (e) {
            console.warn('IndexedDB clear notice:', e);
        }
    }

    // ──────────────── Web Audio & Canvas FFT ────────────────
    function initAudioContext() {
        if (audioCtx) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 64;
            analyser.smoothingTimeConstant = 0.8;

            source = audioCtx.createMediaElementSource(audio);
            source.connect(analyser);
            analyser.connect(audioCtx.destination);
        } catch (e) {
            console.warn('Web Audio API setup notice:', e);
        }
    }

    function resizeCanvas() {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * (window.devicePixelRatio || 1);
        canvas.height = rect.height * (window.devicePixelRatio || 1);
        if (canvasCtx) {
            canvasCtx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
        }
    }
    window.addEventListener('resize', resizeCanvas);

    function drawVisualizer() {
        if (!visualizerRunning || !canvasCtx || !canvas) return;
        requestAnimationFrame(drawVisualizer);

        const dpr = window.devicePixelRatio || 1;
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;
        canvasCtx.clearRect(0, 0, width, height);

        if (!analyser || !isPlaying) {
            const numBars = 32;
            const barWidth = (width / numBars) - 2;
            for (let i = 0; i < numBars; i++) {
                canvasCtx.fillStyle = 'rgba(199, 181, 132, 0.2)';
                canvasCtx.fillRect(i * (barWidth + 2), height - 2, barWidth, 2);
            }
            return;
        }

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        const barWidth = (width / bufferLength) - 2;
        for (let i = 0; i < bufferLength; i++) {
            const barHeight = (dataArray[i] / 255) * height;
            const x = i * (barWidth + 2);
            const y = height - Math.max(barHeight, 2);

            const grad = canvasCtx.createLinearGradient(0, height, 0, 0);
            grad.addColorStop(0, '#857242');
            grad.addColorStop(0.5, '#c7b584');
            grad.addColorStop(1, '#f5edd3');

            canvasCtx.fillStyle = grad;
            canvasCtx.fillRect(x, y, barWidth, Math.max(barHeight, 2));
        }
    }

    // ──────────────── Playlist & Audio Loading ────────────────
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function renderPlaylist() {
        if (!playlistEl) return;

        if (tracks.length === 0) {
            playlistEl.innerHTML = `
                <div id="empty-state" class="empty-playlist-msg">
                    <span class="empty-icon">🎵</span>
                    <p>Deine Playlist ist noch leer</p>
                    <span>Ziehe MP3, WAV, FLAC oder M4A Dateien hierher oder klicke auf „+ Dateien“</span>
                </div>
            `;
            if (trackCounter) trackCounter.textContent = '0 / 0';
            if (metaStats) metaStats.textContent = '0 Audio Tracks';
            return;
        }

        playlistEl.innerHTML = '';
        tracks.forEach((track, index) => {
            const item = document.createElement('div');
            item.className = `playlist-item ${index === currentTrackIndex ? 'active' : ''}`;

            const durationFormatted = track.duration ? formatTime(track.duration) : '';

            item.innerHTML = `
                <div class="playlist-left">
                    <span class="pl-index">${index + 1}</span>
                    <span class="pl-icon">💿</span>
                    <span class="pl-name" title="${track.title}">${track.title}</span>
                </div>
                <div class="playlist-right">
                    <span class="pl-artist">${track.artist || 'vir2ose'} ${durationFormatted ? '• ' + durationFormatted : ''}</span>
                    <button class="pl-del-btn" title="Aus Playlist entfernen">✕</button>
                </div>
            `;

            item.addEventListener('click', (e) => {
                if (e.target.closest('.pl-del-btn')) {
                    e.stopPropagation();
                    removeTrack(index);
                    return;
                }
                loadTrack(index);
                playAudio();
            });

            playlistEl.appendChild(item);
        });

        if (trackCounter) {
            trackCounter.textContent = `${currentTrackIndex >= 0 ? currentTrackIndex + 1 : 0} / ${tracks.length}`;
        }
        if (metaStats) {
            metaStats.textContent = `${tracks.length} Audio Track${tracks.length > 1 ? 's' : ''}`;
        }
    }

    async function addTracks(newTracks, autoPlay = true) {
        if (!newTracks || newTracks.length === 0) return;
        const startIndex = tracks.length;

        for (const t of newTracks) {
            if (!t.id && !t.isDemo) {
                await saveTrackToDB({
                    title: t.title,
                    artist: t.artist || 'vir2ose user',
                    duration: t.duration || 0,
                    blob: t.blob || null
                });
            }
        }

        tracks = tracks.concat(newTracks);
        renderPlaylist();

        if (autoPlay && startIndex < tracks.length) {
            loadTrack(startIndex);
            playAudio();
        }
    }

    async function removeTrack(index) {
        if (index < 0 || index >= tracks.length) return;
        const track = tracks[index];
        if (track.id) {
            await deleteTrackFromDB(track.id);
        }

        const wasPlaying = isPlaying && currentTrackIndex === index;
        tracks.splice(index, 1);

        if (tracks.length === 0) {
            currentTrackIndex = -1;
            pauseAudio();
            audio.src = '';
            if (currentTitle) currentTitle.textContent = 'KEIN TRACK GELADEN';
            if (currentArtist) currentArtist.innerHTML = 'Ziehe Audiodateien ins Fenster oder klicke auf <strong>+ Dateien</strong>';
            if (coverImg) coverImg.src = 'SMARTPHONE_TABLET_ASSETS/Beatcloud_Emblem.png';
            if (currentTimeEl) currentTimeEl.textContent = '0:00';
            if (totalDurationEl) totalDurationEl.textContent = '0:00';
            if (progressBar) progressBar.style.width = '0%';
        } else {
            if (currentTrackIndex >= tracks.length) {
                currentTrackIndex = tracks.length - 1;
            }
            if (wasPlaying) {
                loadTrack(currentTrackIndex);
                playAudio();
            } else {
                loadTrack(currentTrackIndex);
            }
        }
        renderPlaylist();
    }

    function loadTrack(index) {
        if (index < 0 || index >= tracks.length) return;
        currentTrackIndex = index;
        const track = tracks[currentTrackIndex];

        let playSrc = track.url;
        if (!playSrc && track.blob) {
            playSrc = URL.createObjectURL(track.blob);
        }
        audio.src = playSrc;

        if (currentTitle) currentTitle.textContent = track.title;
        if (currentArtist) {
            currentArtist.innerHTML = `Interpret: <strong>${track.artist || 'vir2ose'}</strong>`;
        }
        if (coverImg) {
            coverImg.src = track.cover || 'SMARTPHONE_TABLET_ASSETS/Beatcloud_Emblem.png';
        }

        if (trackCounter) {
            trackCounter.textContent = `${currentTrackIndex + 1} / ${tracks.length}`;
        }
        renderPlaylist();
    }

    // ──────────────── Playback Controls ────────────────
    function playAudio() {
        if (tracks.length === 0) return;
        initAudioContext();
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        audio.play().then(() => {
            isPlaying = true;
            if (playIcon) playIcon.textContent = '❚❚';
            visualizerRunning = true;
            drawVisualizer();
            renderPlaylist();
        }).catch(err => {
            console.warn('Playback notice:', err);
        });
    }

    function pauseAudio() {
        audio.pause();
        isPlaying = false;
        if (playIcon) playIcon.textContent = '▶';
        renderPlaylist();
    }

    function togglePlay() {
        if (isPlaying) {
            pauseAudio();
        } else {
            if (currentTrackIndex === -1 && tracks.length > 0) {
                loadTrack(0);
            }
            playAudio();
        }
    }

    function prevTrack() {
        if (tracks.length === 0) return;
        if (audio.currentTime > 3) {
            audio.currentTime = 0;
            return;
        }
        let prev = currentTrackIndex - 1;
        if (prev < 0) prev = tracks.length - 1;
        loadTrack(prev);
        playAudio();
    }

    function nextTrack() {
        if (tracks.length === 0) return;
        let next;
        if (isShuffled && tracks.length > 1) {
            do {
                next = Math.floor(Math.random() * tracks.length);
            } while (next === currentTrackIndex);
        } else {
            next = currentTrackIndex + 1;
            if (next >= tracks.length) {
                if (repeatMode === 1) {
                    next = 0;
                } else {
                    pauseAudio();
                    return;
                }
            }
        }
        loadTrack(next);
        playAudio();
    }

    // ──────────────── Event Listeners ────────────────
    if (playBtn) playBtn.addEventListener('click', togglePlay);
    if (prevBtn) prevBtn.addEventListener('click', prevTrack);
    if (nextBtn) nextBtn.addEventListener('click', nextTrack);

    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', () => {
            isShuffled = !isShuffled;
            shuffleBtn.classList.toggle('active', isShuffled);
        });
    }

    if (repeatBtn) {
        repeatBtn.addEventListener('click', () => {
            repeatMode = (repeatMode + 1) % 3;
            repeatBtn.classList.toggle('active', repeatMode > 0);
            repeatBtn.title = repeatMode === 0 ? 'Wiederholen: Aus' : repeatMode === 1 ? 'Wiederholen: Alle' : 'Wiederholen: Einzelsong';
        });
    }

    // Audio Element Callbacks
    audio.addEventListener('timeupdate', () => {
        if (!audio.duration) return;
        const progress = (audio.currentTime / audio.duration) * 100;
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
        if (totalDurationEl) totalDurationEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('loadedmetadata', () => {
        if (totalDurationEl) totalDurationEl.textContent = formatTime(audio.duration);
        if (currentTrackIndex >= 0 && tracks[currentTrackIndex] && !tracks[currentTrackIndex].duration) {
            tracks[currentTrackIndex].duration = audio.duration;
            renderPlaylist();
        }
    });

    audio.addEventListener('ended', () => {
        if (repeatMode === 2) {
            audio.currentTime = 0;
            playAudio();
        } else {
            nextTrack();
        }
    });

    // Scrubber click
    if (progressContainer) {
        progressContainer.addEventListener('click', (e) => {
            if (!audio.duration) return;
            const rect = progressContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            audio.currentTime = (clickX / width) * audio.duration;
        });
    }

    // Volume & Mute
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            audio.volume = parseFloat(e.target.value);
            lastVolume = audio.volume;
            if (muteBtn) muteBtn.textContent = audio.volume === 0 ? '🔇' : '🔊';
        });
    }

    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            if (audio.volume > 0) {
                lastVolume = audio.volume;
                audio.volume = 0;
                if (volumeSlider) volumeSlider.value = 0;
                muteBtn.textContent = '🔇';
            } else {
                audio.volume = lastVolume || 0.85;
                if (volumeSlider) volumeSlider.value = audio.volume;
                muteBtn.textContent = '🔊';
            }
        });
    }

    // ──────────────── File Import & Folder Import ────────────────
    function handleFileSelection(files) {
        if (!files || files.length === 0) return;
        const audioFiles = Array.from(files).filter(f => f.type.startsWith('audio/') || /\.(mp3|wav|flac|ogg|m4a|aac)$/i.test(f.name));
        if (audioFiles.length === 0) {
            alert('Keine gültigen Audiodateien gefunden (MP3, WAV, FLAC, M4A).');
            return;
        }

        const newTracks = audioFiles.map(f => {
            const cleanTitle = f.name.replace(/\.[^/.]+$/, '').replace(/^[0-9\s_-]+/, '');
            return {
                title: cleanTitle,
                artist: 'vir2ose sound',
                blob: f,
                url: URL.createObjectURL(f),
                duration: 0
            };
        });

        addTracks(newTracks, tracks.length === 0);
    }

    if (btnAddFiles && fileInput) {
        btnAddFiles.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
            handleFileSelection(e.target.files);
            fileInput.value = '';
        });
    }

    if (btnAddFolder && folderInput) {
        btnAddFolder.addEventListener('click', () => folderInput.click());
        folderInput.addEventListener('change', (e) => {
            handleFileSelection(e.target.files);
            folderInput.value = '';
        });
    }

    if (btnDemoTracks) {
        btnDemoTracks.addEventListener('click', () => {
            addTracks(DEMO_TRACKS, tracks.length === 0);
        });
    }

    if (btnClearPl) {
        btnClearPl.addEventListener('click', async () => {
            if (tracks.length === 0) return;
            if (confirm('Möchtest du die Playlist wirklich leeren?')) {
                tracks = [];
                await clearDB();
                removeTrack(0);
            }
        });
    }

    // Drag & Drop
    window.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (dropOverlay) dropOverlay.classList.add('is-active');
    });

    window.addEventListener('dragleave', (e) => {
        if (e.relatedTarget === null && dropOverlay) {
            dropOverlay.classList.remove('is-active');
        }
    });

    window.addEventListener('drop', (e) => {
        e.preventDefault();
        if (dropOverlay) dropOverlay.classList.remove('is-active');
        if (e.dataTransfer && e.dataTransfer.files) {
            handleFileSelection(e.dataTransfer.files);
        }
    });

    // ──────────────── Keyboard Shortcuts ────────────────
    window.addEventListener('keydown', (e) => {
        if (['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) return;
        if (e.code === 'Space') {
            e.preventDefault();
            togglePlay();
        } else if (e.code === 'ArrowRight') {
            audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5);
        } else if (e.code === 'ArrowLeft') {
            audio.currentTime = Math.max(0, audio.currentTime - 5);
        } else if (e.key.toLowerCase() === 'n') {
            nextTrack();
        } else if (e.key.toLowerCase() === 'p') {
            prevTrack();
        }
    });

    // ──────────────── Initialization on DOM Ready ────────────────
    window.addEventListener('DOMContentLoaded', async () => {
        setTimeout(resizeCanvas, 150);

        // Load saved tracks from IndexedDB
        const savedDBTracks = await loadTracksFromDB();
        if (savedDBTracks && savedDBTracks.length > 0) {
            const restored = savedDBTracks.map(t => {
                let streamUrl = '';
                if (t.blob) {
                    streamUrl = URL.createObjectURL(t.blob);
                }
                return {
                    id: t.id,
                    title: t.title,
                    artist: t.artist || 'vir2ose sound',
                    duration: t.duration || 0,
                    blob: t.blob,
                    url: streamUrl
                };
            });
            tracks = restored;
            renderPlaylist();
            loadTrack(0);
        } else {
            renderPlaylist();
        }

        // Global unlock AudioContext on click / touch
        const unlockAudio = () => {
            initAudioContext();
            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('touchstart', unlockAudio);
        };
        document.addEventListener('click', unlockAudio);
        document.addEventListener('touchstart', unlockAudio);
    });

})();
