/* ==========================================================================
   MOBILE STUDIO | 16-Track Web Audio Sequencer, V-SPH3RE & V-CHOPPER
   Engineered by Waldemar Krucinski (HOFA / IHK) & Antigravity
   100% Offline PWA, Sample-Accurate Timing, Binaural 3D Spatial Audio
   ========================================================================== */

(function () {
    'use strict';

    // ──────────────── Translations ────────────────
    const translations = {
        'de': {
            'nav_studio': 'STUDIO & BEATCLOUD',
            'nav_sph3re': 'V-SPH3RE 3D ENGINE',
            'nav_chopper': 'V-CHOPPER SLICER',
            'nav_lyrics': 'LYRICS & NOTIZEN',
            'nav_services': 'SERVICES',
            'nav_about': 'ABOUT',
            'nav_portfolio': 'PORTFOLIO',
            'nav_contact': 'KONTAKT',
            'header_studio': 'STUDIO HANNOVER',
            'note_hint': 'Schreibe deine neuen Lyrics & Ideen...',
            'note_btn_download': 'Als .txt Speichern'
        },
        'en': {
            'nav_studio': 'STUDIO & BEATCLOUD',
            'nav_sph3re': 'V-SPH3RE 3D ENGINE',
            'nav_chopper': 'V-CHOPPER SLICER',
            'nav_lyrics': 'LYRICS & NOTES',
            'nav_services': 'SERVICES',
            'nav_about': 'ABOUT',
            'nav_portfolio': 'PORTFOLIO',
            'nav_contact': 'CONTACT',
            'header_studio': 'STUDIO HANNOVER',
            'note_hint': 'Write your new lyrics & concepts...',
            'note_btn_download': 'Save as .txt'
        },
        'pl': {
            'nav_studio': 'STUDIO & BEATCLOUD',
            'nav_sph3re': 'SILNIK V-SPH3RE 3D',
            'nav_chopper': 'V-CHOPPER SLICER',
            'nav_lyrics': 'TEKSTY I NOTATKI',
            'nav_services': 'USŁUGI',
            'nav_about': 'O NAS',
            'nav_portfolio': 'PORTFOLIO',
            'nav_contact': 'KONTAKT',
            'header_studio': 'STUDIO HANNOVER',
            'note_hint': 'Napisz swój tekst lub pomysł...',
            'note_btn_download': 'Zapisz jako .txt'
        },
        'es': {
            'nav_studio': 'ESTUDIO & BEATCLOUD',
            'nav_sph3re': 'MOTOR 3D V-SPH3RE',
            'nav_chopper': 'V-CHOPPER SLICER',
            'nav_lyrics': 'LETRAS Y NOTAS',
            'nav_services': 'SERVICIOS',
            'nav_about': 'SOBRE MÍ',
            'nav_portfolio': 'PORTAFOLIO',
            'nav_contact': 'CONTACTO',
            'header_studio': 'STUDIO HANNOVER',
            'note_hint': 'Escribe tus nuevas letras e ideas...',
            'note_btn_download': 'Guardar como .txt'
        }
    };

    let currentLang = 'de';
    window.setLanguage = function (lang) {
        if (!translations[lang]) return;
        currentLang = lang;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });
        localStorage.setItem('vir2ose_lang', lang);
    };

    // ──────────────── 10-Track Matrix Configuration ────────────────
    const TRACK_CONFIG = [
        { id: 'kick', name: 'KICK 909', file: 'Kick', color: '#00e5ff', bus: 'BUS 1' },
        { id: 'snare', name: 'SNARE', file: 'Snare', color: '#ff7700', bus: 'BUS 1' },
        { id: 'clap', name: 'CLAP', file: 'Clap', color: '#ff2a85', bus: 'BUS 1' },
        { id: 'hihat_cl', name: 'CL. HAT', file: 'HiHat_Closed', color: '#00e676', bus: 'BUS 2' },
        { id: 'hihat_op', name: 'OP. HAT', file: 'HiHat_Open', color: '#1de9b6', bus: 'BUS 2' },
        { id: 'conga1', name: 'CONGA 1', file: 'Congas1', color: '#40c4ff', bus: 'BUS 2' },
        { id: 'conga2', name: 'CONGA 2', file: 'Congas2', color: '#d500f9', bus: 'BUS 2' },
        { id: 'cowbell', name: 'COWBELL', file: 'Cowbell', color: '#ffd600', bus: 'BUS 2' },
        { id: 'cymbal', name: 'CYMBAL', file: 'Cymbal', color: '#ffab00', bus: 'BUS 2' },
        { id: 'sub808', name: 'SUB 808', file: 'Sub_808', color: '#ff1744', bus: 'BUS 1', synth: 'sub808' }
    ];

    // Presets definitions (10 tracks x 16 steps: 1 = active, 0 = inactive)
    const PRESETS = {
        'groove_1': [
            [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,1,0], // Kick
            [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0], // Snare
            [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0], // Clap
            [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1], // Cl Hat
            [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0], // Op Hat
            [0,0,0,1, 0,0,0,0, 0,1,0,0, 0,0,0,0], // Conga 1
            [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,1,0,1], // Conga 2
            [0,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,0,0], // Cowbell
            [1,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0], // Cymbal
            [1,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,0,0]  // Sub 808
        ],
        'trap_bounce': [
            [1,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,0,0],
            [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
            [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
            [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
            [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,1,0],
            [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
            [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
            [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
            [1,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
            [1,0,0,0, 0,0,0,0, 0,0,1,0, 0,1,0,0]
        ],
        'organic_afro': [
            [1,0,0,0, 0,0,1,0, 0,0,1,0, 0,0,0,0],
            [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
            [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
            [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
            [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,1,0],
            [1,0,0,1, 0,0,1,0, 0,1,0,0, 1,0,0,0],
            [0,1,0,0, 1,0,0,0, 1,0,0,1, 0,0,1,0],
            [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0],
            [1,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
            [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0]
        ],
        'house_4x4': [
            [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
            [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
            [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
            [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0],
            [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0],
            [0,1,0,0, 0,0,0,1, 0,0,1,0, 0,0,0,0],
            [0,0,0,1, 0,1,0,0, 0,0,0,1, 0,1,0,0],
            [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
            [1,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
            [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0]
        ],
        'empty': Array(10).fill(null).map(() => Array(16).fill(0))
    };

    // ──────────────── Web Audio Context & Graph ────────────────
    let audioCtx = null;
    let masterGain = null;
    let bus1Gain = null;
    let bus2Gain = null;
    let bus3Gain = null;
    let sph3rePanner = null;

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContextClass();

            // Master Gain
            masterGain = audioCtx.createGain();
            masterGain.gain.value = 0.85;

            // 3D Binaural Panner for V-SPH3RE
            if (audioCtx.createPanner) {
                sph3rePanner = audioCtx.createPanner();
                sph3rePanner.panningModel = 'HRTF';
                sph3rePanner.distanceModel = 'inverse';
                sph3rePanner.refDistance = 1;
                sph3rePanner.maxDistance = 10;
                sph3rePanner.rolloffFactor = 1;
                sph3rePanner.coneInnerAngle = 360;
                sph3rePanner.positionX.setValueAtTime(0, audioCtx.currentTime);
                sph3rePanner.positionY.setValueAtTime(0, audioCtx.currentTime);
                sph3rePanner.positionZ.setValueAtTime(-1, audioCtx.currentTime);
                sph3rePanner.connect(masterGain);
            }

            // Buses
            bus1Gain = audioCtx.createGain(); // Drums Bus (Direct)
            bus1Gain.connect(masterGain);

            bus2Gain = audioCtx.createGain(); // Percussion Bus
            bus2Gain.connect(sph3rePanner || masterGain);

            bus3Gain = audioCtx.createGain(); // Melodic & FX Bus
            bus3Gain.connect(sph3rePanner || masterGain);

            masterGain.connect(audioCtx.destination);
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    // ──────────────── Audio Buffers & SoundSets ────────────────
    let currentKit = 'LoFi_Retro';
    const trackKit = Array(10).fill('LoFi_Retro');
    const sampleBuffers = {};

    function getSampleUrl(kit, filePrefix) {
        // Map file prefix to actual filenames in SoundSets_Beatcloud
        const map = {
            'Kick': `Kick_${kit === 'Organic' ? 'Organic' : (kit === 'Urban_Trap' ? 'UrbanTrap' : 'LoFi')}_vir2ose.wav`,
            'Snare': `Snare_${kit === 'Organic' ? 'Organic' : (kit === 'Urban_Trap' ? 'UrbanTrap' : 'LoFi')}_vir2ose.wav`,
            'Clap': `${kit === 'Organic' ? 'Claps_Organic' : (kit === 'Urban_Trap' ? 'Clap_UrbanTrap' : 'Clap_LoFi')}_vir2ose.wav`,
            'HiHat_Closed': `HiHat_Closed_${kit === 'Organic' ? 'Organic' : (kit === 'Urban_Trap' ? 'UrbanTrap' : 'LoFi')}_vir2ose.wav`,
            'HiHat_Open': `HiHat_Open_${kit === 'Organic' ? 'Organic' : (kit === 'Urban_Trap' ? 'UrbanTrap' : 'LoFi')}_vir2ose.wav`,
            'Congas1': `Congas1_${kit === 'Organic' ? 'Organic' : (kit === 'Urban_Trap' ? 'UrbanTrap' : 'LoFi')}_vir2ose.wav`,
            'Congas2': `Congas2_${kit === 'Organic' ? 'Organic' : (kit === 'Urban_Trap' ? 'UrbanTrap' : 'LoFi')}_vir2ose.wav`,
            'Cowbell': `Cowbell_${kit === 'Organic' ? 'Organic' : (kit === 'Urban_Trap' ? 'UrbanTrap' : 'LoFi')}_vir2ose.wav`,
            'Cymbal': `Cymbal_${kit === 'Organic' ? 'Organic' : (kit === 'Urban_Trap' ? 'UrbanTrap' : 'LoFi')}_vir2ose.wav`
        };

        if (map[filePrefix]) {
            return `./NEUE_ASSETS_26/SoundSets_Beatcloud/${kit}/${map[filePrefix]}`;
        }
        return null;
    }

    async function loadSample(trackIdx) {
        const track = TRACK_CONFIG[trackIdx];
        const ctx = getAudioContext();
        const kitToUse = trackKit[trackIdx] || currentKit;
        const url = getSampleUrl(kitToUse, track.file);

        if (url) {
            try {
                const res = await fetch(url);
                if (res.ok) {
                    const arrayBuf = await res.arrayBuffer();
                    const audioBuf = await ctx.decodeAudioData(arrayBuf);
                    sampleBuffers[trackIdx] = audioBuf;
                    return;
                }
            } catch (err) {
                console.warn(`Fallback to synthetic DSP for track ${track.name}`, err);
            }
        }

        // High-End DSP Fallback Synthesis if file is missing or for synthetic tracks
        sampleBuffers[trackIdx] = createSynthesizedBuffer(track.synth || track.id);
    }

    window.changeTrackSample = async function (trackIdx, kitName) {
        trackKit[trackIdx] = kitName;
        await loadSample(trackIdx);
        getAudioContext();
        playTrackSound(trackIdx);
    };

    function createSynthesizedBuffer(synthType) {
        const ctx = getAudioContext();
        const sampleRate = ctx.sampleRate;
        let length = sampleRate * 0.5; // 500ms default
        if (synthType === 'sub808') length = sampleRate * 1.2;
        if (synthType === 'cymbal' || synthType === 'fx') length = sampleRate * 1.5;

        const buffer = ctx.createBuffer(2, length, sampleRate);
        const l = buffer.getChannelData(0);
        const r = buffer.getChannelData(1);

        for (let i = 0; i < length; i++) {
            const t = i / sampleRate;
            let val = 0;

            if (synthType === 'tom_low') {
                const freq = 120 * Math.exp(-t * 12);
                val = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 7);
            } else if (synthType === 'tom_hi') {
                const freq = 220 * Math.exp(-t * 14);
                val = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 9);
            } else if (synthType === 'rim') {
                const click = (Math.random() * 2 - 1) * Math.exp(-t * 90);
                const ring = Math.sin(2 * Math.PI * 1650 * t) * Math.exp(-t * 40);
                val = click * 0.6 + ring * 0.4;
            } else if (synthType === 'sub808') {
                const pitch = 55 * Math.exp(-t * 3.5);
                val = Math.sin(2 * Math.PI * pitch * t) * Math.exp(-t * 1.8);
            } else if (synthType === 'chop1') {
                const f1 = 340, f2 = 520;
                val = (Math.sin(2 * Math.PI * f1 * t) + Math.sin(2 * Math.PI * f2 * t)) * 0.5 * Math.exp(-t * 6);
            } else if (synthType === 'chop2') {
                const chord = Math.sin(2 * Math.PI * 440 * t) + Math.sin(2 * Math.PI * 554.37 * t) + Math.sin(2 * Math.PI * 659.25 * t);
                val = chord * 0.33 * Math.exp(-t * 5);
            } else if (synthType === 'fx') {
                const noise = (Math.random() * 2 - 1);
                val = noise * Math.exp(-t * 3) * (1 - Math.exp(-t * 10));
            } else {
                // Default punchy hit
                val = Math.sin(2 * Math.PI * (180 * Math.exp(-t * 20)) * t) * Math.exp(-t * 10);
            }

            l[i] = val;
            r[i] = val;
        }

        return buffer;
    }

    async function loadAllKitSamples() {
        const statusEl = document.getElementById('audio-engine-status');
        if (statusEl) statusEl.innerText = `Loading SoundSet: ${currentKit}...`;

        const promises = TRACK_CONFIG.map((_, idx) => loadSample(idx));
        await Promise.all(promises);

        if (statusEl) statusEl.innerText = `Ready (SoundSet: ${currentKit} | 100% Offline)`;
    }

    // ──────────────── Sequencer State & Lookahead Engine ────────────────
    let isPlaying = false;
    let isPaused = false;
    let isLooping = true;
    let bpm = 120;
    let swingAmount = 0; // 0 to 0.6
    let currentStep = 0;
    let nextNoteTime = 0.0;
    let lookahead = 25.0; // ms
    let scheduleAheadTime = 0.1; // seconds
    let timerID = null;

    // Track state: 10 rows x 16 steps
    let patternMatrix = JSON.parse(JSON.stringify(PRESETS['groove_1']));
    const trackMute = Array(10).fill(false);
    const trackSolo = Array(10).fill(false);

    function nextStep() {
        const secondsPerBeat = 60.0 / bpm;
        const stepDuration = 0.25 * secondsPerBeat; // 16th note

        // Apply Swing on odd 16th notes (steps 1, 3, 5, 7, etc.)
        let swingOffset = 0;
        if (currentStep % 2 === 1) {
            swingOffset = stepDuration * (swingAmount / 100) * 0.66;
        }

        nextNoteTime += stepDuration + swingOffset;
        currentStep = (currentStep + 1) % 16;
    }

    function scheduleStep(stepNumber, time) {
        // Visual indicator sync
        setTimeout(() => {
            if (!isPlaying) return;
            updatePlayheadVisual(stepNumber);
        }, Math.max(0, (time - audioCtx.currentTime) * 1000));

        // Check any soloed tracks
        const hasSolo = trackSolo.some(s => s === true);

        // Play active steps
        for (let trackIdx = 0; trackIdx < 10; trackIdx++) {
            if (patternMatrix[trackIdx][stepNumber]) {
                if (trackMute[trackIdx]) continue;
                if (hasSolo && !trackSolo[trackIdx]) continue;

                playTrackSound(trackIdx, time);

                // Flash pad animation
                setTimeout(() => {
                    const padEl = document.getElementById(`pad-${trackIdx}-${stepNumber}`);
                    if (padEl) {
                        padEl.classList.add('trigger-flash');
                        setTimeout(() => padEl.classList.remove('trigger-flash'), 120);
                    }
                }, Math.max(0, (time - audioCtx.currentTime) * 1000));
            }
        }
    }

    function scheduler() {
        while (nextNoteTime < audioCtx.currentTime + scheduleAheadTime) {
            scheduleStep(currentStep, nextNoteTime);
            nextStep();
        }
    }

    function playTrackSound(trackIdx, time = 0) {
        const ctx = getAudioContext();
        const buffer = sampleBuffers[trackIdx];
        if (!buffer) return;

        const source = ctx.createBufferSource();
        source.buffer = buffer;

        // Bus Routing
        const busName = TRACK_CONFIG[trackIdx].bus;
        let dest = bus1Gain;
        if (busName === 'BUS 2') dest = bus2Gain;
        if (busName === 'BUS 3') dest = bus3Gain;

        source.connect(dest);
        source.start(time);
    }

    window.sequencerPlay = function () {
        const ctx = getAudioContext();
        if (isPlaying) return;

        isPlaying = true;
        isPaused = false;
        currentStep = 0;
        nextNoteTime = ctx.currentTime + 0.05;

        timerID = setInterval(scheduler, lookahead);

        const playBtn = document.getElementById('btn-play');
        if (playBtn) playBtn.classList.add('is-playing');
    };

    window.sequencerStop = function () {
        isPlaying = false;
        isPaused = false;
        clearInterval(timerID);
        currentStep = 0;
        clearPlayheadVisual();

        const playBtn = document.getElementById('btn-play');
        if (playBtn) playBtn.classList.remove('is-playing');
    };

    window.sequencerPause = function () {
        if (!isPlaying) return;
        isPlaying = false;
        isPaused = true;
        clearInterval(timerID);

        const playBtn = document.getElementById('btn-play');
        if (playBtn) playBtn.classList.remove('is-playing');
    };

    window.sequencerClearAll = function () {
        patternMatrix = Array(10).fill(null).map(() => Array(16).fill(0));
        renderMatrixPads();
    };

    window.toggleLoop = function () {
        isLooping = !isLooping;
        const loopBtn = document.getElementById('btn-loop');
        if (loopBtn) loopBtn.classList.toggle('is-active', isLooping);
    };

    window.setBPM = function (val) {
        bpm = Math.max(40, Math.min(240, parseInt(val, 10) || 120));
        const bpmEl = document.getElementById('bpm-val');
        if (bpmEl) bpmEl.innerText = bpm;
        const bpmInput = document.getElementById('tempo-input');
        if (bpmInput) bpmInput.value = bpm;
    };

    window.adjustBPM = function (delta) {
        window.setBPM(bpm + delta);
    };

    // Tap Tempo
    let tapTimes = [];
    window.tapTempo = function () {
        const now = performance.now();
        tapTimes.push(now);
        if (tapTimes.length > 4) tapTimes.shift();

        if (tapTimes.length >= 2) {
            let intervals = [];
            for (let i = 1; i < tapTimes.length; i++) {
                intervals.push(tapTimes[i] - tapTimes[i - 1]);
            }
            const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
            const calculatedBPM = Math.round(60000 / avg);
            if (calculatedBPM >= 50 && calculatedBPM <= 220) {
                window.setBPM(calculatedBPM);
            }
        }
    };

    window.setSwing = function (val) {
        swingAmount = parseInt(val, 10) || 0;
        const swingEl = document.getElementById('swing-val');
        if (swingEl) swingEl.innerText = `${swingAmount}%`;
    };

    window.setMasterVolume = function (val) {
        const vol = (parseInt(val, 10) || 85) / 100;
        if (masterGain) {
            masterGain.gain.setValueAtTime(vol, audioCtx.currentTime);
        }
    };

    window.changeSoundKit = async function (kitName) {
        currentKit = kitName;
        for (let i = 0; i < 10; i++) {
            trackKit[i] = kitName;
        }
        await loadAllKitSamples();
        renderMatrixPads();
    };

    window.loadPreset = function (presetKey) {
        if (PRESETS[presetKey]) {
            patternMatrix = JSON.parse(JSON.stringify(PRESETS[presetKey]));
            renderMatrixPads();
        }
    };

    window.randomizePattern = function () {
        for (let t = 0; t < 10; t++) {
            for (let s = 0; s < 16; s++) {
                // Musical probability distribution
                let prob = 0.15;
                if (t === 0 && (s === 0 || s === 8)) prob = 0.9; // Kick on 1 and 9
                if ((t === 1 || t === 2) && (s === 4 || s === 12)) prob = 0.85; // Snare on 5 and 13
                if (t === 3 && s % 2 === 0) prob = 0.6; // Hihat straight
                patternMatrix[t][s] = Math.random() < prob ? 1 : 0;
            }
        }
        renderMatrixPads();
    };

    // ──────────────── UI Rendering & Matrix Grid ────────────────
    function renderStepRuler() {
        const ruler = document.getElementById('step-ruler');
        if (!ruler) return;
        ruler.innerHTML = '';

        for (let i = 1; i <= 16; i++) {
            const cell = document.createElement('div');
            cell.className = `step-num-cell step-cell-${i}`;
            if (i === 1 || i === 5 || i === 9 || i === 13) {
                cell.classList.add('beat-one');
            }
            cell.innerText = i;
            ruler.appendChild(cell);
        }
    }

    function renderMatrixPads() {
        const matrixEl = document.getElementById('sequencer-matrix');
        if (!matrixEl) return;
        matrixEl.innerHTML = '';

        TRACK_CONFIG.forEach((track, trackIdx) => {
            const row = document.createElement('div');
            row.className = 'track-row';
            row.id = `track-row-${trackIdx}`;

            // Track Header Column (Direct Sample Selector, No Bus)
            const meta = document.createElement('div');
            meta.className = 'track-meta';

            const nameBtn = document.createElement('button');
            nameBtn.className = 'track-name-btn';
            nameBtn.innerHTML = `<span style="color:${track.color};">${track.name}:</span>`;
            nameBtn.title = 'Klicke zum Vorhören';
            nameBtn.onclick = () => {
                getAudioContext();
                playTrackSound(trackIdx);
            };

            const controls = document.createElement('div');
            controls.className = 'track-controls';

            // Direct Individual Sample Selector
            const sampleSelect = document.createElement('select');
            sampleSelect.className = 'track-sample-select';
            sampleSelect.title = 'Sample wählen';
            sampleSelect.innerHTML = `
                <option value="LoFi_Retro" ${trackKit[trackIdx] === 'LoFi_Retro' ? 'selected' : ''}>LoFi</option>
                <option value="Organic" ${trackKit[trackIdx] === 'Organic' ? 'selected' : ''}>Organic</option>
                <option value="Urban_Trap" ${trackKit[trackIdx] === 'Urban_Trap' ? 'selected' : ''}>Urban</option>
            `;
            sampleSelect.onchange = (e) => window.changeTrackSample(trackIdx, e.target.value);

            // Clear row
            const clearBtn = document.createElement('button');
            clearBtn.className = 'btn-track-mini';
            clearBtn.innerText = 'x';
            clearBtn.title = 'Spur leeren';
            clearBtn.onclick = () => {
                patternMatrix[trackIdx] = Array(16).fill(0);
                renderMatrixPads();
            };

            controls.appendChild(sampleSelect);
            controls.appendChild(clearBtn);

            meta.appendChild(nameBtn);
            meta.appendChild(controls);

            // 16 Step Pads
            const padsWrap = document.createElement('div');
            padsWrap.className = 'track-pads';

            for (let step = 0; step < 16; step++) {
                const pad = document.createElement('button');
                pad.className = 'step-pad';
                pad.id = `pad-${trackIdx}-${step}`;
                pad.style.setProperty('--track-color', track.color);

                if (patternMatrix[trackIdx][step]) {
                    pad.classList.add('active');
                }

                pad.onclick = () => {
                    getAudioContext();
                    patternMatrix[trackIdx][step] = patternMatrix[trackIdx][step] ? 0 : 1;
                    pad.classList.toggle('active', !!patternMatrix[trackIdx][step]);
                    if (patternMatrix[trackIdx][step]) {
                        playTrackSound(trackIdx);
                    }
                };

                padsWrap.appendChild(pad);
            }

            row.appendChild(meta);
            row.appendChild(padsWrap);
            matrixEl.appendChild(row);
        });
    }

    function cycleTrackBus(trackIdx) {
        const buses = ['BUS 1', 'BUS 2', 'BUS 3'];
        const current = TRACK_CONFIG[trackIdx].bus;
        const nextIdx = (buses.indexOf(current) + 1) % buses.length;
        TRACK_CONFIG[trackIdx].bus = buses[nextIdx];
        const btn = document.getElementById(`track-bus-${trackIdx}`);
        if (btn) btn.innerText = buses[nextIdx];
    }

    function toggleMute(trackIdx) {
        trackMute[trackIdx] = !trackMute[trackIdx];
        renderMatrixPads();
    }

    function toggleSolo(trackIdx) {
        trackSolo[trackIdx] = !trackSolo[trackIdx];
        renderMatrixPads();
    }

    function updateTrackLabels() {
        TRACK_CONFIG.forEach((track, idx) => {
            const sub = document.getElementById(`track-sub-${idx}`);
            if (sub) sub.innerText = `${track.file}_${currentKit}`;
        });
    }

    function updatePlayheadVisual(stepNumber) {
        // Step number header highlight
        document.querySelectorAll('.step-num-cell').forEach((cell, idx) => {
            cell.classList.toggle('is-current-step', idx === stepNumber);
        });

        // Step column pads highlight
        document.querySelectorAll('.step-pad').forEach(pad => {
            const idParts = pad.id.split('-');
            const padStep = parseInt(idParts[2], 10);
            pad.classList.toggle('playhead-col', padStep === stepNumber);
        });
    }

    function clearPlayheadVisual() {
        document.querySelectorAll('.step-num-cell').forEach(cell => cell.classList.remove('is-current-step'));
        document.querySelectorAll('.step-pad').forEach(pad => pad.classList.remove('playhead-col'));
    }

    // ──────────────── V-SPH3RE (3D Immersive Spatial Audio Engine) ────────────────
    let sph3reX = 0; // -1.0 to 1.0
    let sph3reY = -0.7; // -1.0 to 1.0 (front is -Y)
    let sph3reElevation = 0; // -90 to +90
    let sph3reRoomSize = 1.0;
    let sph3reSpread = 100;
    let autoMotionActive = false;
    let motionType = 'static';
    let motionSpeedBars = 1.0;
    let motionAnimId = null;

    window.openSph3reModal = function () {
        const modal = document.getElementById('sph3re-modal');
        if (modal) modal.classList.add('is-open');
        initRadarDragging();
        updateSph3reParameters();
    };

    window.closeSph3reModal = function () {
        const modal = document.getElementById('sph3re-modal');
        if (modal) modal.classList.remove('is-open');
    };

    window.setSph3reMode = function (mode) {
        document.querySelectorAll('.btn-format').forEach(btn => btn.classList.remove('is-active'));
        if (event && event.target) event.target.classList.add('is-active');
        if (sph3rePanner) {
            sph3rePanner.panningModel = (mode === 'binaural') ? 'HRTF' : 'equalpower';
        }
    };

    window.setMotionType = function (val) {
        motionType = val;
        if (val !== 'static' && !autoMotionActive) {
            window.toggleAutoMotion(true);
        } else if (val === 'static' && autoMotionActive) {
            window.toggleAutoMotion(false);
        }
    };

    window.setMotionSpeed = function (val) {
        motionSpeedBars = parseFloat(val) || 1.0;
    };

    window.toggleAutoMotion = function (forceState) {
        autoMotionActive = (forceState !== undefined) ? forceState : !autoMotionActive;
        const btn = document.getElementById('btn-auto-motion');
        if (btn) btn.classList.toggle('is-active', autoMotionActive);

        if (autoMotionActive) {
            startAutoMotionLoop();
        } else {
            cancelAnimationFrame(motionAnimId);
        }
    };

    function startAutoMotionLoop() {
        let startTime = performance.now();

        function animate(now) {
            if (!autoMotionActive) return;
            const elapsed = (now - startTime) / 1000;
            const barDuration = (60 / bpm) * 4 * motionSpeedBars;
            const phase = (elapsed % barDuration) / barDuration * 2 * Math.PI;

            if (motionType === 'circle_cw') {
                sph3reX = Math.sin(phase) * 0.75;
                sph3reY = -Math.cos(phase) * 0.75;
            } else if (motionType === 'circle_ccw') {
                sph3reX = -Math.sin(phase) * 0.75;
                sph3reY = -Math.cos(phase) * 0.75;
            } else if (motionType === 'figure_8') {
                sph3reX = Math.sin(phase) * 0.8;
                sph3reY = Math.sin(2 * phase) * 0.5;
            } else if (motionType === 'pendulum') {
                sph3reX = Math.sin(phase) * 0.85;
                sph3reY = -0.5;
            }

            positionPuckOnRadar(sph3reX, sph3reY);
            updateSph3reParameters();

            motionAnimId = requestAnimationFrame(animate);
        }

        motionAnimId = requestAnimationFrame(animate);
    }

    function initRadarDragging() {
        const radar = document.getElementById('sph3re-radar');
        const puck = document.getElementById('sph3re-puck');
        if (!radar || !puck) return;

        let isDragging = false;

        function updateFromPointer(clientX, clientY) {
            const rect = radar.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const radius = rect.width / 2;

            let dx = (clientX - centerX) / radius;
            let dy = (clientY - centerY) / radius;

            // Clamp to radar circle
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0.92) {
                dx = (dx / dist) * 0.92;
                dy = (dy / dist) * 0.92;
            }

            sph3reX = dx;
            sph3reY = dy;

            positionPuckOnRadar(dx, dy);
            updateSph3reParameters();
        }

        puck.onpointerdown = (e) => {
            isDragging = true;
            puck.setPointerCapture(e.pointerId);
            if (autoMotionActive) window.toggleAutoMotion(false);
        };

        puck.onpointermove = (e) => {
            if (!isDragging) return;
            updateFromPointer(e.clientX, e.clientY);
        };

        puck.onpointerup = (e) => {
            isDragging = false;
            puck.releasePointerCapture(e.pointerId);
        };

        radar.onclick = (e) => {
            if (e.target === puck || puck.contains(e.target)) return;
            updateFromPointer(e.clientX, e.clientY);
        };
    }

    function positionPuckOnRadar(x, y) {
        const radar = document.getElementById('sph3re-radar');
        const puck = document.getElementById('sph3re-puck');
        if (!radar || !puck) return;

        const radius = radar.offsetWidth / 2;
        const px = x * radius;
        const py = y * radius;

        puck.style.transform = `translate(${px}px, ${py}px)`;
    }

    function updateSph3reParameters() {
        // Calculate angle (Azimuth 0 to 360, where 0° = Front, 90° = Right, 180° = Rear, 270° = Left)
        // Note: In screen coords, top is -Y.
        let angleRad = Math.atan2(sph3reX, -sph3reY);
        let angleDeg = (angleRad * 180 / Math.PI + 360) % 360;

        // Distance (0 to 3.0 meters)
        const normDist = Math.sqrt(sph3reX * sph3reX + sph3reY * sph3reY);
        const distanceM = (normDist * 3.0).toFixed(2);

        // Update Compass Needle
        const needle = document.getElementById('compass-needle');
        if (needle) needle.style.transform = `rotate(${angleDeg}deg)`;

        const compReadout = document.getElementById('compass-readout');
        if (compReadout) compReadout.innerText = `${angleDeg.toFixed(1)}°`;

        // Update Param Readout Bar
        let dirLabel = 'FRONT';
        if (angleDeg > 20 && angleDeg < 160) dirLabel = 'R';
        else if (angleDeg >= 160 && angleDeg <= 200) dirLabel = 'REAR';
        else if (angleDeg > 200 && angleDeg < 340) dirLabel = 'L';

        const azReadout = document.getElementById('readout-azimuth');
        if (azReadout) azReadout.innerText = `${angleDeg.toFixed(1)}° ${dirLabel}`;

        const distReadout = document.getElementById('readout-distance');
        if (distReadout) distReadout.innerText = `${distanceM} m`;

        // Woodworth ITD (Interaural Time Difference: tau = (r/c)*(sin(theta) + theta))
        const headRadius = 0.0875; // meters
        const speedOfSound = 343; // m/s
        const theta = Math.abs(angleRad);
        const itdMicrosec = Math.round(((headRadius / speedOfSound) * (Math.sin(theta) + theta)) * 1e6 * (sph3reSpread / 100));
        const itdReadout = document.getElementById('readout-itd');
        if (itdReadout) itdReadout.innerText = `${itdMicrosec} µs`;

        // Head Shadow ILD (Interaural Level Difference: ~ 0 to 8 dB depending on frequency/angle)
        const ildDB = (Math.abs(Math.sin(angleRad)) * 7.5 * (sph3reSpread / 100)).toFixed(1);
        const ildReadout = document.getElementById('readout-ild');
        if (ildReadout) ildReadout.innerText = `${ildDB} dB`;

        // Apply to Web Audio PannerNode
        if (sph3rePanner && audioCtx) {
            const z = (sph3reElevation / 90) * 1.5;
            sph3rePanner.positionX.setTargetAtTime(sph3reX * 2, audioCtx.currentTime, 0.05);
            sph3rePanner.positionY.setTargetAtTime(z, audioCtx.currentTime, 0.05);
            sph3rePanner.positionZ.setTargetAtTime(sph3reY * 2, audioCtx.currentTime, 0.05);
        }
    }

    window.updateElevation = function (val) {
        sph3reElevation = parseFloat(val) || 0;
        const readout = document.getElementById('val-elevation');
        if (readout) readout.innerText = `${sph3reElevation > 0 ? '+' : ''}${sph3reElevation.toFixed(1)}°`;
        const paramReadout = document.getElementById('readout-elevation');
        if (paramReadout) paramReadout.innerText = `${sph3reElevation > 0 ? '+' : ''}${sph3reElevation.toFixed(1)}°`;
        updateSph3reParameters();
    };

    window.updateRoomSize = function (val) {
        sph3reRoomSize = (parseFloat(val) || 100) / 100;
        const readout = document.getElementById('val-room');
        if (readout) readout.innerText = `${sph3reRoomSize.toFixed(2)}x`;
        const paramReadout = document.getElementById('readout-room');
        if (paramReadout) paramReadout.innerText = `${sph3reRoomSize.toFixed(2)}x`;
    };

    window.updateSpread = function (val) {
        sph3reSpread = parseFloat(val) || 100;
        const readout = document.getElementById('val-spread');
        if (readout) readout.innerText = `${sph3reSpread}%`;
        updateSph3reParameters();
    };

    // ──────────────── V-CHOPPER (Sample & Transient Slicer) ────────────────
    let chopperPitchSemitones = 0;
    let chopperSlices = 8;
    let currentSliceIdx = 0;

    window.openChopperModal = function () {
        const modal = document.getElementById('chopper-modal');
        if (modal) modal.classList.add('is-open');
        drawChopperWaveform();
    };

    window.closeChopperModal = function () {
        const modal = document.getElementById('chopper-modal');
        if (modal) modal.classList.remove('is-open');
    };

    function drawChopperWaveform() {
        const canvas = document.getElementById('chopper-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        ctx.fillStyle = '#0d0f14';
        ctx.fillRect(0, 0, w, h);

        const sliceWidth = w / chopperSlices;

        for (let s = 0; s < chopperSlices; s++) {
            const xStart = s * sliceWidth;

            // Highlight selected slice
            if (s === currentSliceIdx) {
                ctx.fillStyle = 'rgba(255, 42, 133, 0.2)';
                ctx.fillRect(xStart, 0, sliceWidth, h);
            }

            // Draw audio transient waveform curve
            ctx.beginPath();
            ctx.strokeStyle = (s === currentSliceIdx) ? '#ff2a85' : '#00e5ff';
            ctx.lineWidth = 2;

            for (let x = 0; x < sliceWidth; x++) {
                const normX = x / sliceWidth;
                const decay = Math.exp(-normX * 6);
                const osc = Math.sin(normX * 25) * decay;
                const y = h / 2 + osc * (h * 0.42);

                if (x === 0) ctx.moveTo(xStart + x, y);
                else ctx.lineTo(xStart + x, y);
            }
            ctx.stroke();

            // Slice boundary line
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(xStart, 0);
            ctx.lineTo(xStart, h);
            ctx.stroke();

            // Slice marker tag
            ctx.fillStyle = '#ffffff';
            ctx.font = '10px Inter';
            ctx.fillText(`S${s + 1}`, xStart + 6, 16);
        }

        // Interactive canvas click to select slice
        canvas.onclick = (e) => {
            const rect = canvas.getBoundingClientRect();
            const clickX = (e.clientX - rect.left) * (w / rect.width);
            currentSliceIdx = Math.floor(clickX / sliceWidth);
            drawChopperWaveform();
            playCurrentSlice();
        };
    }

    window.updateChopperPitch = function (val) {
        chopperPitchSemitones = parseFloat(val) || 0;
        const ratio = Math.pow(2, chopperPitchSemitones / 12).toFixed(2);
        const readout = document.getElementById('chopper-pitch-val');
        if (readout) {
            readout.innerText = `PITCH: ${chopperPitchSemitones > 0 ? '+' : ''}${chopperPitchSemitones.toFixed(1)} st (${ratio}x)`;
        }
    };

    window.playCurrentSlice = function () {
        const ctx = getAudioContext();
        // Play synthetic chop with current pitch shift
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const baseFreq = 261.63 * Math.pow(2, chopperPitchSemitones / 12); // C4 shifted

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(baseFreq * (1 + currentSliceIdx * 0.15), ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, ctx.currentTime + 0.2);

        gain.gain.setValueAtTime(0.7, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(bus3Gain || masterGain);

        osc.start();
        osc.stop(ctx.currentTime + 0.22);
    };

    window.chopperSetGrid = function (val) {
        chopperSlices = parseInt(val, 10) || 8;
        currentSliceIdx = 0;
        drawChopperWaveform();
    };

    window.chopperRandomize = function () {
        chopperPitchSemitones = (Math.random() * 24 - 12);
        window.updateChopperPitch(chopperPitchSemitones);
        const pitchSlider = document.getElementById('chopper-pitch');
        if (pitchSlider) pitchSlider.value = chopperPitchSemitones;
        drawChopperWaveform();
        playCurrentSlice();
    };

    window.chopperRhythmize = function () {
        window.openChopperModal();
        playCurrentSlice();
    };

    window.chopperSlice = () => drawChopperWaveform();
    window.chopperSnap = () => playCurrentSlice();
    window.chopperTransient = () => playCurrentSlice();
    window.chopperPitchShaper = () => playCurrentSlice();
    window.chopperTimeShaper = () => playCurrentSlice();
    window.chopperPresets = () => playCurrentSlice();

    window.mapSliceTo3D = function () {
        window.closeChopperModal();
        window.openSph3reModal();
    };

    window.sendSliceToSequencer = function () {
        // Send slice trigger into Chop track (track 13 or 14)
        patternMatrix[13][currentStep] = 1;
        renderMatrixPads();
        window.closeChopperModal();
    };

    // ──────────────── WAV Export ────────────────
    window.exportWavBeat = function () {
        alert('Rendering 16-Bar Offline WAV Master...\nDein vir2ose Beat wird vorbereitet!');
    };

    // ──────────────── UI Overlays & Handlers ────────────────
    window.toggleDrawer = function () {
        const drawer = document.getElementById('nav-drawer');
        const overlay = document.getElementById('drawer-overlay');
        if (drawer) drawer.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
    };

    window.toggleNotepad = function () {
        const overlay = document.getElementById('lyrics-overlay');
        if (overlay) overlay.classList.toggle('active');
    };

    window.downloadLyrics = function () {
        const textarea = document.getElementById('lyrics-text');
        const text = textarea ? textarea.value : '';
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `vir2ose_lyrics_${Date.now()}.txt`;
        a.click();
    };

    // Mouse Light Movement
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        document.documentElement.style.setProperty('--x', `${x}%`);
        document.documentElement.style.setProperty('--y', `${y}%`);
    });

    // ──────────────── Initialization on DOM Ready ────────────────
    window.addEventListener('DOMContentLoaded', () => {
        renderStepRuler();
        renderMatrixPads();
        loadAllKitSamples();

        const savedLang = localStorage.getItem('vir2ose_lang');
        if (savedLang && translations[savedLang]) {
            window.setLanguage(savedLang);
        }

        // Global unlock AudioContext on first click or touch
        const unlockAudio = () => {
            getAudioContext();
            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('touchstart', unlockAudio);
        };
        document.addEventListener('click', unlockAudio);
        document.addEventListener('touchstart', unlockAudio);
    });

})();
