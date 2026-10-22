const fs = require("node:fs");
const path = require("node:path");
const XLSX = require("xlsx");

const fallbackSteamTable = [
  {
    pressure: 0,
    temperature: 99.63,
    specificVolume: 1.694,
    density: 0.59,
    sensibleHeat: 99.72,
    latentHeat: 539.3,
    totalHeat: 639.02,
  },
  {
    pressure: 0.1,
    temperature: 102.32,
    specificVolume: 1.549,
    density: 0.645,
    sensibleHeat: 102.43,
    latentHeat: 537.59,
    totalHeat: 640.01,
  },
  {
    pressure: 0.2,
    temperature: 104.81,
    specificVolume: 1.428,
    density: 0.7,
    sensibleHeat: 104.94,
    latentHeat: 535.99,
    totalHeat: 640.93,
  },
  {
    pressure: 0.3,
    temperature: 107.13,
    specificVolume: 1.325,
    density: 0.755,
    sensibleHeat: 107.29,
    latentHeat: 534.49,
    totalHeat: 641.77,
  },
  {
    pressure: 0.4,
    temperature: 109.32,
    specificVolume: 1.236,
    density: 0.809,
    sensibleHeat: 109.49,
    latentHeat: 533.07,
    totalHeat: 642.56,
  },
  {
    pressure: 0.5,
    temperature: 111.37,
    specificVolume: 1.159,
    density: 0.863,
    sensibleHeat: 111.57,
    latentHeat: 531.73,
    totalHeat: 643.3,
  },
  {
    pressure: 0.6,
    temperature: 113.32,
    specificVolume: 1.091,
    density: 0.916,
    sensibleHeat: 113.54,
    latentHeat: 530.45,
    totalHeat: 643.99,
  },
  {
    pressure: 0.7,
    temperature: 115.17,
    specificVolume: 1.031,
    density: 0.97,
    sensibleHeat: 115.42,
    latentHeat: 529.22,
    totalHeat: 644.64,
  },
  {
    pressure: 0.8,
    temperature: 116.93,
    specificVolume: 0.977,
    density: 1.023,
    sensibleHeat: 117.2,
    latentHeat: 528.05,
    totalHeat: 645.25,
  },
  {
    pressure: 0.9,
    temperature: 118.62,
    specificVolume: 0.929,
    density: 1.076,
    sensibleHeat: 118.91,
    latentHeat: 526.92,
    totalHeat: 645.83,
  },
  {
    pressure: 1.0,
    temperature: 120.2,
    specificVolume: 0.885,
    density: 1.13,
    sensibleHeat: 120.77,
    latentHeat: 525.79,
    totalHeat: 646.57,
  },
  {
    pressure: 1.1,
    temperature: 121.8,
    specificVolume: 0.846,
    density: 1.182,
    sensibleHeat: 122.34,
    latentHeat: 524.75,
    totalHeat: 647.1,
  },
  {
    pressure: 1.5,
    temperature: 127.4,
    specificVolume: 0.718,
    density: 1.393,
    sensibleHeat: 128.08,
    latentHeat: 520.93,
    totalHeat: 649.0,
  },
  {
    pressure: 2,
    temperature: 133.5,
    specificVolume: 0.606,
    density: 1.65,
    sensibleHeat: 134.2,
    latentHeat: 516.72,
    totalHeat: 651.0,
  },
  {
    pressure: 3,
    temperature: 143.6,
    specificVolume: 0.462,
    density: 2.164502165,
    sensibleHeat: 144.58,
    latentHeat: 509.54,
    totalHeat: 654.13,
  },
  {
    pressure: 3.5,
    temperature: 148.0,
    specificVolume: 0.412,
    density: 2.427184466,
    sensibleHeat: 148.99,
    latentHeat: 506.4,
    totalHeat: 655.403,
  },
  {
    pressure: 4,
    temperature: 151.8,
    specificVolume: 0.375,
    density: 2.666666667,
    sensibleHeat: 153.03,
    latentHeat: 503.43,
    totalHeat: 656.52,
  },
  {
    pressure: 5,
    temperature: 158.8,
    specificVolume: 0.315,
    density: 3.174603175,
    sensibleHeat: 160.26,
    latentHeat: 498.17,
    totalHeat: 658.44,
  },
  {
    pressure: 6,
    temperature: 165.0,
    specificVolume: 0.273,
    density: 3.663003663,
    sensibleHeat: 166.6,
    latentHeat: 493.39,
    totalHeat: 660.01,
  },
  {
    pressure: 7,
    temperature: 170.4,
    specificVolume: 0.24,
    density: 4.166666667,
    sensibleHeat: 172.31,
    latentHeat: 489.02,
    totalHeat: 661.34,
  },
  {
    pressure: 8,
    temperature: 175.4,
    specificVolume: 0.215,
    density: 4.651162791,
    sensibleHeat: 177.49,
    latentHeat: 484.97,
    totalHeat: 662.46,
  },
  {
    pressure: 9,
    temperature: 179.88,
    specificVolume: 0.194,
    density: 5.154639175,
    sensibleHeat: 182.14,
    latentHeat: 481.18,
    totalHeat: 663.44,
  },
];

const loadReferenceSteamTable = () => {
  const workbookPath = path.resolve(
    __dirname,
    "../../../volfram-bot/Volfram_Calculator.xlsx"
  );

  if (!fs.existsSync(workbookPath)) return fallbackSteamTable;

  const workbook = XLSX.readFile(workbookPath, { cellFormula: false });
  const sheet = workbook.Sheets.Sheet4;
  if (!sheet) return fallbackSteamTable;

  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: null,
    raw: true,
  });
  const headerIndex = rows.findIndex((row) => row[0] === "Gauge Pressure");
  if (headerIndex < 0) return fallbackSteamTable;

  const referenceRows = rows
    .slice(headerIndex + 2)
    .filter(
      (row) =>
        row.slice(0, 7).every((value) => value !== null && value !== "")
    )
    .map((row) => ({
      pressure: Number(row[0]),
      temperature: Number(row[1]),
      specificVolume: Number(row[2]),
      density: Number(row[3]),
      sensibleHeat: Number(row[4]),
      latentHeat: Number(row[5]),
      totalHeat: Number(row[6]),
    }))
    .filter((row) =>
      Object.values(row).every((value) => Number.isFinite(value))
    );

  return referenceRows.length ? referenceRows : fallbackSteamTable;
};

module.exports = loadReferenceSteamTable();