const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, '../welcome.json');

if (!fs.existsSync(path.dirname(dbPath))) fs.mkdirSync(path.dirname(dbPath), { recursive: true });
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}, null, 2));

function load() { try { return JSON.parse(fs.readFileSync(dbPath, 'utf8')); } catch { return {}; } }
function save(d) { fs.writeFileSync(dbPath, JSON.stringify(d, null, 2)); }

function getWelcomeConfig(groupId) {
    const db = load();
    if (!db[groupId]) {
        db[groupId] = {
            enabled: false,
            caption: "👋 Bem-vindo(a) @user ao #group! 🎉",
            leaveCaption: "👋 @user saiu do #group 😢"
        };
        save(db);
    }
    return db[groupId];
}
function setWelcomeStatus(groupId, status) {
    const db = load();
    const cfg = getWelcomeConfig(groupId);
    cfg.enabled = status;
    db[groupId] = cfg;
    save(db);
}
function setWelcomeCaption(groupId, text) {
    const db = load();
    const cfg = getWelcomeConfig(groupId);
    cfg.caption = text;
    db[groupId] = cfg;
    save(db);
}
function setLeaveCaption(groupId, text) {
    const db = load();
    const cfg = getWelcomeConfig(groupId);
    cfg.leaveCaption = text;
    db[groupId] = cfg;
    save(db);
}

module.exports = { getWelcomeConfig, setWelcomeStatus, setWelcomeCaption, setLeaveCaption };
