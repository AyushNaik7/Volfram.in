const xlsx = require('xlsx');
const wb = xlsx.readFile('../volfram-bot/Volfram_Calculator.xlsx');

// Get Sheet5 (boiler efficiency) with raw=false to see formulas evaluated
const ws5 = wb.Sheets['Sheet5'];
const rows5 = xlsx.utils.sheet_to_json(ws5, { header:1, raw:false, defval:'' });
console.log('\n=== Sheet5 FULL (Boiler Efficiency) ===');
rows5.forEach((r,i) => {
  const v = r.slice(0,6).map(String);
  if(v.some(x=>x.trim()!='')) console.log((i+1)+':', v.join(' | '));
});

// Get Sheet6 (blowdown) full
const ws6 = wb.Sheets['Sheet6'];
const rows6 = xlsx.utils.sheet_to_json(ws6, { header:1, raw:false, defval:'' });
console.log('\n=== Sheet6 FULL (Blowdown) ===');
rows6.forEach((r,i) => {
  const v = r.slice(0,6).map(String);
  if(v.some(x=>x.trim()!='')) console.log((i+1)+':', v.join(' | '));
});

// Sheet2 (condensate) full
const ws2 = wb.Sheets['Sheet2'];
const rows2 = xlsx.utils.sheet_to_json(ws2, { header:1, raw:false, defval:'' });
console.log('\n=== Sheet2 FULL (Condensate) ===');
rows2.forEach((r,i) => {
  const v = r.slice(0,8).map(String);
  if(v.some(x=>x.trim()!='')) console.log((i+1)+':', v.join(' | '));
});

// Sheet5 with raw=true to get actual numbers
const ws5r = wb.Sheets['Sheet5'];
const rows5r = xlsx.utils.sheet_to_json(ws5r, { header:1, raw:true, defval:null });
console.log('\n=== Sheet5 RAW (Boiler Efficiency) ===');
rows5r.forEach((r,i) => {
  const v = r.slice(0,6).map(x => x === null ? '' : String(x));
  if(v.some(x=>x.trim()!='')) console.log((i+1)+':', v.join(' | '));
});

// Sheet10 full (tank)
const ws10 = wb.Sheets['Sheet10'];
const rows10 = xlsx.utils.sheet_to_json(ws10, { header:1, raw:false, defval:'' });
console.log('\n=== Sheet10 FULL (Tank) ===');
rows10.forEach((r,i) => {
  const v = r.slice(0,12).map(String);
  if(v.some(x=>x.trim()!='')) console.log((i+1)+':', v.join(' | '));
});

// Sheet11 full (heating/cooling) 
const ws11 = wb.Sheets['Sheet11'];
const rows11 = xlsx.utils.sheet_to_json(ws11, { header:1, raw:false, defval:'' });
console.log('\n=== Sheet11 FULL (Heating/Cooling) ===');
rows11.forEach((r,i) => {
  const v = r.slice(0,8).map(String);
  if(v.some(x=>x.trim()!='')) console.log((i+1)+':', v.join(' | '));
});

// 18 PIPE THICKNESS P11 P22 - get all stress table values
const ws18 = wb.Sheets['18 PIPE THICKNESS P11 P22'];
const rows18 = xlsx.utils.sheet_to_json(ws18, { header:1, raw:true, defval:null });
console.log('\n=== Sheet18 PIPE THICKNESS (stress table rows) ===');
rows18.forEach((r,i) => {
  const v = r.slice(0,14).map(x => x === null ? '' : String(x));
  if(v.some(x=>x.trim()!='')) console.log((i+1)+':', v.join(' | '));
});
