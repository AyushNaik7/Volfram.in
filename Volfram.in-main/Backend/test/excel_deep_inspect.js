const xlsx = require('xlsx');
const wb = xlsx.readFile('../volfram-bot/Volfram_Calculator.xlsx');

// Print ALL sheet names
console.log('\n=== ALL SHEET NAMES ===');
wb.SheetNames.forEach((n,i) => console.log(i, n));

// Sheets we need deeply
const targets = [
  '12 Safety Valve',
  'Sheet2',       // condensate
  'Sheet5',       // boiler efficiency
  'Sheet6',       // blowdown
  'Sheet3',       // air cooling
  'Sheet12',      // liquid pipe
  'Sheet10',      // tank
  'Sheet11',      // heating cooling
  '13 Weight Calculator',
  '16 PRS Steam Saving',
  '18 PIPE THICKNESS P11 P22',
  'Sheet17 Superheated Steam Cal',
  'Sheet13',      // PRDS maybe
  'Sheet14',
  'Sheet15',
  'Sheet16',
  'Sheet18',
  'Sheet19',
  'Sheet20',
];

for (const name of targets) {
  const ws = wb.Sheets[name];
  if (!ws) { console.log('\n=== SHEET:', name, '=== NOT FOUND'); continue; }
  const rows = xlsx.utils.sheet_to_json(ws, { header:1, raw:false, defval:'' });
  console.log('\n=== SHEET:', name, '===');
  for (let i = 0; i < rows.length; i++) {
    const vals = rows[i].slice(0,14).map(v => String(v));
    if (vals.some(v => v.trim() !== '')) console.log((i+1)+':', vals.join(' | '));
  }
}
