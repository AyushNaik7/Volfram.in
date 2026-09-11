const fs = require("node:fs");
const path = require("node:path");
const XLSX = require("xlsx");

const workbookPath = path.resolve(
  __dirname,
  "../../../volfram-bot/Volfram_Calculator.xlsx"
);

function loadSheet(name) {
  if (!fs.existsSync(workbookPath)) return [];
  const workbook = XLSX.readFile(workbookPath, { cellFormula: false });
  const sheet = workbook.Sheets[name];
  return sheet ? XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null }) : [];
}

const materialRows = loadSheet("Material_Stress");
const pipeRows = loadSheet("Pipe_Data");

const materialStress = {};
const materialY = {};
let stressHeader = -1;
for (let index = 0; index < materialRows.length; index += 1) {
  if (materialRows[index]?.[0] === "Temperature") {
    stressHeader = index;
    break;
  }
}

if (stressHeader >= 0) {
  const stressMaterials = materialRows[stressHeader].slice(1, 7);
  const yMaterials = materialRows[stressHeader].slice(9, 15);
  for (const row of materialRows.slice(stressHeader + 1)) {
    const temperature = Number(row[0]);
    if (!Number.isFinite(temperature)) continue;
    stressMaterials.forEach((material, index) => {
      const stress = Number(row[index + 1]);
      if (material && Number.isFinite(stress)) {
        materialStress[material] ??= [];
        materialStress[material].push({ temperature, stress });
      }
    });
    yMaterials.forEach((material, index) => {
      const coefficient = Number(row[index + 9]);
      if (material && Number.isFinite(coefficient)) {
        materialY[material] ??= [];
        materialY[material].push({ temperature, coefficient });
      }
    });
  }
}

const pipeData = {};
let pipeHeader = pipeRows.findIndex((row) => row[1] === "NPS");
if (pipeHeader >= 0) {
  for (const row of pipeRows.slice(pipeHeader + 1)) {
    const nps = row[1];
    const dn = row[2];
    const outsideDiameter = Number(row[3]);
    if (nps === null || !Number.isFinite(outsideDiameter)) continue;
    const schedules = {};
    for (let index = 4; index < row.length; index += 1) {
      const schedule = pipeRows[pipeHeader][index];
      const thickness = Number(row[index]);
      if (schedule && Number.isFinite(thickness)) schedules[String(schedule)] = thickness;
    }
    pipeData[String(nps)] = { outsideDiameter, schedules };
    if (dn !== null && dn !== undefined) {
      pipeData[String(dn)] = pipeData[String(nps)];
    }
  }
}

function nearestReference(rows, temperature) {
  if (!rows?.length) return null;
  return rows.reduce((selected, row) =>
    row.temperature <= temperature && row.temperature >= selected.temperature ? row : selected
  );
}

function getGeneralPipeData(material, temperature, nominalSize, schedule) {
  const pipe = pipeData[String(nominalSize)];
  const stress = nearestReference(materialStress[material], temperature);
  const y = nearestReference(materialY[material], temperature);
  if (!pipe || !stress || !y) return null;
  const actualWallThickness = pipe.schedules[String(schedule)];
  if (!Number.isFinite(actualWallThickness)) return null;
  return {
    outsideDiameter: pipe.outsideDiameter,
    actualWallThickness,
    allowableStress: stress.stress,
    coefficientY: y.coefficient,
  };
}

module.exports = { getGeneralPipeData };