const xlsx = require('xlsx');
const wb = xlsx.readFile('../volfram-bot/Volfram_Calculator.xlsx', { cellFormula: true });

const ws = wb.Sheets['Steam Pipe Size'];
console.log('\n=== Steam Pipe Size FORMULAS ===');
for (const [addr, cell] of Object.entries(ws)) {
  if (addr.startsWith('!')) continue;
  if (cell.f) console.log(addr, '=', cell.f, '  [value:', cell.v, ']');
  else if (cell.v !== undefined && cell.v !== '') console.log(addr, '=', cell.v);
}
