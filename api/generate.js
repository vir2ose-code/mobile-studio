// Decommissioned - Mobile Studio has transitioned to 100% offline client-side Web Audio Sequencer & Spatial Engine
export default function handler(req, res) {
    res.status(200).json({
        status: "offline_sequencer_mode",
        message: "External AI generators have been retired. Mobile Studio now runs 100% offline via client-side Web Audio API."
    });
}
