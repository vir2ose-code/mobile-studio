// ──────────────── VIR2OSE REC-BUFFER & STORAGE VAULT ────────────────
// 250 MB Persistent Client-Side Storage for Audio Loops & PDF Lyrics
// 100% Offline PWA - High-Performance IndexedDB Storage System

(function () {
    'use strict';

    const DB_NAME = 'vir2ose_rec_vault_db';
    const DB_VERSION = 1;
    const STORE_REC = 'recordings';
    const STORE_VPLAYER = 'tracks';
    const MAX_BUFFER_BYTES = 250 * 1024 * 1024; // 250 Megabytes Limit

    function openVaultDB() {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(DB_NAME, DB_VERSION);
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_REC)) {
                    db.createObjectStore(STORE_REC, { keyPath: 'id', autoIncrement: true });
                }
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    // Calculate total buffer usage in bytes & percentage of 250 MB
    window.getRecBufferUsage = async function () {
        try {
            const db = await openVaultDB();
            const tx = db.transaction(STORE_REC, 'readonly');
            const store = tx.objectStore(STORE_REC);
            return new Promise((resolve) => {
                const req = store.getAll();
                req.onsuccess = () => {
                    const items = req.result || [];
                    let totalBytes = 0;
                    items.forEach(item => {
                        totalBytes += (item.size || (item.blob ? item.blob.size : 0));
                    });
                    const usedMB = (totalBytes / (1024 * 1024)).toFixed(1);
                    const maxMB = 250;
                    const percent = Math.min(100, ((totalBytes / MAX_BUFFER_BYTES) * 100)).toFixed(1);
                    resolve({
                        totalBytes,
                        maxBytes: MAX_BUFFER_BYTES,
                        usedMB,
                        maxMB,
                        percent,
                        count: items.length,
                        items
                    });
                };
                req.onerror = () => resolve({ totalBytes: 0, maxBytes: MAX_BUFFER_BYTES, usedMB: '0.0', maxMB: 250, percent: '0.0', count: 0, items: [] });
            });
        } catch (e) {
            console.warn('Vault DB usage notice:', e);
            return { totalBytes: 0, maxBytes: MAX_BUFFER_BYTES, usedMB: '0.0', maxMB: 250, percent: '0.0', count: 0, items: [] };
        }
    };

    // Save an audio loop or PDF into the 250 MB buffer & sync to V-Player
    window.saveToRecBuffer = async function (item) {
        try {
            const usage = await window.getRecBufferUsage();
            const itemSize = item.size || (item.blob ? item.blob.size : 0);

            if (usage.totalBytes + itemSize > MAX_BUFFER_BYTES) {
                alert(`REC-Puffer voll (${usage.usedMB} MB / 250 MB belegt). Bitte lösche ältere Aufnahmen, um Platz zu schaffen.`);
                return null;
            }

            const db = await openVaultDB();
            const tx = db.transaction(STORE_REC, 'readwrite');
            const store = tx.objectStore(STORE_REC);

            const record = {
                title: item.title || `Beatcloud_Loop_${Date.now()}`,
                artist: item.artist || 'vir2ose sound (Recorded)',
                type: item.type || 'audio',
                format: item.format || 'wav',
                size: itemSize,
                duration: item.duration || 0,
                blob: item.blob,
                createdAt: Date.now()
            };

            const recId = await new Promise((resolve, reject) => {
                const req = store.add(record);
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            });
            record.id = recId;

            // Also sync to V-Player IndexedDB (`vir2ose_vplayer_db`) if it's an audio recording
            if (item.type !== 'pdf') {
                await syncRecordToVPlayer(record);
            }

            // Update UI indicators
            await window.updateRecBufferUI();
            window.dispatchEvent(new CustomEvent('rec-vault-updated', { detail: record }));
            return record;
        } catch (e) {
            console.error('Failed to save to REC buffer:', e);
            return null;
        }
    };

    // Sync to V-Player IndexedDB
    async function syncRecordToVPlayer(record) {
        try {
            const req = indexedDB.open('vir2ose_vplayer_db', 1);
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_VPLAYER)) {
                    db.createObjectStore(STORE_VPLAYER, { keyPath: 'id', autoIncrement: true });
                }
            };
            req.onsuccess = () => {
                const db = req.result;
                const tx = db.transaction(STORE_VPLAYER, 'readwrite');
                const store = tx.objectStore(STORE_VPLAYER);
                store.add({
                    title: record.title,
                    artist: record.artist,
                    duration: record.duration,
                    blob: record.blob
                });
            };
        } catch (e) {
            console.warn('V-Player sync notice:', e);
        }
    }

    // Delete item from REC Buffer
    window.deleteFromRecBuffer = async function (id) {
        try {
            const db = await openVaultDB();
            const tx = db.transaction(STORE_REC, 'readwrite');
            const store = tx.objectStore(STORE_REC);
            store.delete(id);
            await window.updateRecBufferUI();
        } catch (e) {
            console.warn('Vault DB delete notice:', e);
        }
    };

    // Update UI buffer indicators across DOM
    window.updateRecBufferUI = async function () {
        const usage = await window.getRecBufferUsage();
        document.querySelectorAll('.rec-buffer-pill').forEach(el => {
            el.textContent = `REC: ${usage.usedMB} / 250 MB`;
            el.title = `${usage.count} Dateien im Puffer (${usage.percent}% belegt)`;
        });

        const bufText = document.getElementById('rec-buffer-text');
        if (bufText) bufText.textContent = `REC: ${usage.usedMB} / 250 MB (${usage.percent}%)`;

        const bufFill = document.getElementById('rec-buffer-bar-fill');
        if (bufFill) bufFill.style.width = `${Math.min(100, Math.max(0, usage.percent))}%`;
    };

    window.addEventListener('DOMContentLoaded', () => {
        window.updateRecBufferUI();
    });

})();
