const xlsx = require('xlsx');
const wb = xlsx.readFile('../volfram-bot/Volfram_Calculator.xlsx');
const targetSheets = ['Steam Pipe Size','Sheet17 Superheated Steam Cal','14 Pipe Thk. Calculator','15 F&A Calculator','16 PRS Steam Saving','18 PIPE THICKNESS P11 P22','Material_Stress','Pipe_Data','Sheet4','Sheet5','Sheet6','Sheet7','Sheet8','Sheet9','Sheet10','Sheet11','12 Safety Valve','13 Weight Calculator'];
for (const name of targetSheets) {
  if (!wb.Sheets[name]) continue;
  const ws = wb.Sheets[name];
  const rows = xlsx.utils.sheet_to_json(ws,{header:1,raw:false,defval:''});
  console.log('\n=== SHEET:', name, '===');
  for (let i=0;i<Math.min(rows.length,20);i++) {
    const row = rows[i];
    const vals = row.slice(0,12).map(v => v == null ? '' : String(v));
    if (vals.some(v => v.trim() !== '')) console.log((i+1)+':', vals.join(' | '));
  }
}
