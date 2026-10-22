const xlsx = require('xlsx');
const wb = xlsx.readFile('../volfram-bot/Volfram_Calculator.xlsx', { cellFormula: true });

// Get Sheet5 cell formulas
const ws5 = wb.Sheets['Sheet5'];
console.log('\n=== Sheet5 CELL FORMULAS ===');
for (const [addr, cell] of Object.entries(ws5)) {
  if (addr.startsWith('!')) continue;
  if (cell.f) console.log(addr, '=', cell.f, '  [value:', cell.v, ']');
  else if (cell.v !== undefined && cell.v !== '') console.log(addr, '=', cell.v);
}

// Sheet2 formulas (condensate)
const ws2 = wb.Sheets['Sheet2'];
console.log('\n=== Sheet2 CELL FORMULAS ===');
for (const [addr, cell] of Object.entries(ws2)) {
  if (addr.startsWith('!')) continue;
  if (cell.f) console.log(addr, '=', cell.f, '  [value:', cell.v, ']');
}

// Sheet6 formulas (blowdown)
const ws6 = wb.Sheets['Sheet6'];
console.log('\n=== Sheet6 CELL FORMULAS ===');
for (const [addr, cell] of Object.entries(ws6)) {
  if (addr.startsWith('!')) continue;
  if (cell.f) console.log(addr, '=', cell.f, '  [value:', cell.v, ']');
}

// Sheet11 (heating/cooling)
const ws11 = wb.Sheets['Sheet11'];
console.log('\n=== Sheet11 CELL FORMULAS ===');
for (const [addr, cell] of Object.entries(ws11)) {
  if (addr.startsWith('!')) continue;
  if (cell.f) console.log(addr, '=', cell.f, '  [value:', cell.v, ']');
}

// Sheet10 (tank)
const ws10 = wb.Sheets['Sheet10'];
console.log('\n=== Sheet10 CELL FORMULAS ===');
for (const [addr, cell] of Object.entries(ws10)) {
  if (addr.startsWith('!')) continue;
  if (cell.f) console.log(addr, '=', cell.f, '  [value:', cell.v, ']');
}

// 12 Safety Valve
const ws12 = wb.Sheets['12 Safety Valve'];
console.log('\n=== 12 Safety Valve FORMULAS ===');
for (const [addr, cell] of Object.entries(ws12)) {
  if (addr.startsWith('!')) continue;
  if (cell.f) console.log(addr, '=', cell.f, '  [value:', cell.v, ']');
}

// AIR PIPE
const wsair = wb.Sheets['AIR PIPE'];
console.log('\n=== AIR PIPE FORMULAS ===');
for (const [addr, cell] of Object.entries(wsair)) {
  if (addr.startsWith('!')) continue;
  if (cell.f) console.log(addr, '=', cell.f, '  [value:', cell.v, ']');
}

// Sheet1 (liquid pipe)
const ws1 = wb.Sheets['Sheet1'];
console.log('\n=== Sheet1 LIQUID PIPE FORMULAS ===');
for (const [addr, cell] of Object.entries(ws1)) {
  if (addr.startsWith('!')) continue;
  if (cell.f) console.log(addr, '=', cell.f, '  [value:', cell.v, ']');
  else if (cell.v !== undefined && cell.v !== '') console.log(addr, '=', cell.v);
}

// Sheet3 (PRDS)
const ws3 = wb.Sheets['Sheet3'];
console.log('\n=== Sheet3 PRDS FORMULAS (key cells) ===');
for (const [addr, cell] of Object.entries(ws3)) {
  if (addr.startsWith('!')) continue;
  if (cell.f) console.log(addr, '=', cell.f, '  [value:', cell.v, ']');
}
