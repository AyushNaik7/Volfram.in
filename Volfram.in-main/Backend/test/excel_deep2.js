const xlsx = require('xlsx');
const wb = xlsx.readFile('../volfram-bot/Volfram_Calculator.xlsx');

const targets = [
  'Sheet1',
  'Sheet60',
  'Sheet58',
  'Sheet46',
  'Sheet30',
  'Sheet54',
  'Sheet55',
  'Copy of Sheet2',
  'Copy of Sheet3',
  'AIR PIPE',
  'Class',
  'Sheet 17 Superheated Steam Cal',
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
