const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, '../brincadeiras.json');
if (!fs.existsSync(path.dirname(dbPath))) fs.mkdirSync(path.dirname(dbPath), { recursive: true });
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}, null, 2));

function load(){ try{return JSON.parse(fs.readFileSync(dbPath,'utf8'))}catch{return{}} }
function save(d){ fs.writeFileSync(dbPath, JSON.stringify(d,null,2)) }

module.exports = {
    estaAtivo: (id) => { const db=load(); return db[id]!== false; }, // padrão ON
    ativar: (id) => { const db=load(); db[id]=true; save(db); },
    desativar: (id) => { const db=load(); db[id]=false; save(db); }
}
