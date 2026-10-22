// ==========================================
// PIPE DIMENSIONS AND MATERIAL REFERENCE DATA
// Pipe Wall Thickness Calculator
// ==========================================


// ==========================================
// PIPE OUTSIDE DIAMETERS
// Unit: mm
// ==========================================

const pipeDimensions = {
  "1/2": {
    outsideDiameter: 21.3,
  },

  "3/4": {
    outsideDiameter: 26.7,
  },

  "1": {
    outsideDiameter: 33.4,
  },

  "1.25": {
    outsideDiameter: 42.2,
  },

  "1.5": {
    outsideDiameter: 48.3,
  },

  "2": {
    outsideDiameter: 60.3,
  },

  "2.5": {
    outsideDiameter: 73.0,
  },

  "3": {
    outsideDiameter: 88.9,
  },

  "4": {
    outsideDiameter: 114.3,
  },

  "5": {
    outsideDiameter: 141.3,
  },

  "6": {
    outsideDiameter: 168.3,
  },

  "8": {
    outsideDiameter: 219.1,
  },

  "10": {
    outsideDiameter: 273.0,
  },

  "12": {
    outsideDiameter: 323.9,
  },
};


// ==========================================
// PIPE SCHEDULE WALL THICKNESS
// Unit: mm
// ==========================================

const pipeSchedules = {

  "1/2": {
    "SCH 40": 2.77,
    "SCH 80": 3.73,
    "SCH 160": 4.78,
  },

  "3/4": {
    "SCH 40": 2.87,
    "SCH 80": 3.91,
    "SCH 160": 5.54,
  },

  "1": {
    "SCH 40": 3.38,
    "SCH 80": 4.55,
    "SCH 160": 6.35,
  },

  "1.25": {
    "SCH 40": 3.56,
    "SCH 80": 4.85,
    "SCH 160": 6.35,
  },

  "1.5": {
    "SCH 40": 3.68,
    "SCH 80": 5.08,
    "SCH 160": 7.14,
  },

  "2": {
    "SCH 40": 3.91,
    "SCH 80": 5.54,
    "SCH 160": 8.74,
  },

  "2.5": {
    "SCH 40": 5.16,
    "SCH 80": 7.01,
    "SCH 160": 9.53,
  },

  "3": {
    "SCH 40": 5.49,
    "SCH 80": 7.62,
    "SCH 160": 11.13,
  },

  "4": {
    "SCH 40": 6.02,
    "SCH 80": 8.56,
    "SCH 160": 13.49,
  },

  "5": {
    "SCH 40": 6.55,
    "SCH 80": 9.53,
    "SCH 160": 15.88,
  },

  "6": {
    "SCH 40": 7.11,
    "SCH 80": 10.97,
    "SCH 160": 18.26,
  },

  "8": {
    "SCH 40": 8.18,
    "SCH 80": 12.70,
    "SCH 160": 23.01,
  },

  "10": {
    "SCH 40": 9.27,
    "SCH 80": 15.09,
    "SCH 160": 28.58,
  },

  "12": {
    "SCH 40": 10.31,
    "SCH 80": 17.48,
    "SCH 160": 33.32,
  },

};


// ==========================================
// A335 P11 ALLOWABLE STRESS
// Unit: MPa
//
// Source: ASME B31.3-2016 Table A-1M
// as tabulated in Volfram_Calculator.xlsx
// Sheet "18 PIPE THICKNESS P11 P22"
// ==========================================

const p11AllowableStress = {
  40: 138,
  65: 131,
  100: 126,
  125: 124,
  150: 121,
  175: 119,
  200: 116,
  225: 115,
  250: 113,
  275: 111,
  300: 109,
  325: 107,
  350: 106,
  375: 104,
  400: 102,
  425: 99.6,
  450: 97.2,
  475: 94.5,
  500: 73.5,
  525: 52,
  550: 36.3,
  575: 25.2,
  600: 17.6,
  625: 12.3,
  650: 8.27,
};


// ==========================================
// A335 P22 ALLOWABLE STRESS
// Unit: MPa
//
// Source: ASME B31.3-2016 Table A-1M
// as tabulated in Volfram_Calculator.xlsx
// Sheet "18 PIPE THICKNESS P11 P22"
// ==========================================

const p22AllowableStress = {
  40: 138,
  65: 132,
  100: 128,
  125: 126,
  150: 125,
  175: 124,
  200: 124,
  225: 124,
  250: 124,
  275: 124,
  300: 124,
  325: 124,
  350: 124,
  375: 124,
  400: 123,
  425: 122,
  450: 121,
  475: 99.6,
  500: 80.9,
  525: 63.3,
  550: 47.5,
  575: 34.2,
  600: 23.5,
  625: 15.3,
  650: 9.65,
};


// ==========================================
// MATERIAL DATA
// ==========================================

const materialData = {

  "A335 P11": {

    allowableStress: p11AllowableStress,

    // Coefficient used in ASME calculation
    Y: 0.4,

    // Strength Reduction Factor
    W: 1,

  },


  "A335 P22": {

    allowableStress: p22AllowableStress,

    Y: 0.4,

    W: 1,

  },

};


// ==========================================
// EXPORT
// ==========================================

module.exports = {

  pipeDimensions,

  pipeSchedules,

  materialData,

};