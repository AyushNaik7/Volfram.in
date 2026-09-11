const xlsx = require('xlsx');
const wb = xlsx.readFile('../volfram-bot/Volfram_Calculator.xlsx', { cellFormula: true });

const ws10 = wb.Sheets['Sheet10'];
console.log('\n=== Sheet10 ALL FORMULAS ===');
for (const [addr, cell] of Object.entries(ws10)) {
  if (addr.startsWith('!')) continue;
  if (cell.f) console.log(addr, '=', cell.f, '  [value:', cell.v, ']');
  else if (cell.v !== undefined && cell.v !== '' && !addr.startsWith('!')) console.log(addr, '=', cell.v);
}
