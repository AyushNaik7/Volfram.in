
const {
  pipeDimensions,
  pipeSchedules,
  materialData,
} = require("../data/p11p22PipeData");
const getAllowableStress = (stressTable, temperature) => {
  const temperatures = Object.keys(stressTable)
    .map(Number)
    .sort((a, b) => a - b);

  // Temperature outside available range
  if (
    temperature < temperatures[0] ||
    temperature > temperatures[temperatures.length - 1]
  ) {
    return null;
  }

  // Find the nearest lower temperature
  let selectedTemperature = temperatures[0];

  for (const temp of temperatures) {
    if (temp <= temperature) {
      selectedTemperature = temp;
    } else {
      break;
    }
  }

  return {
    temperature: selectedTemperature,
    stress: stressTable[selectedTemperature],
  };
};
const saturatedSteamTable = require("../data/saturatedSteamTable");
const findSteamData = (pressure) => {
  return saturatedSteamTable.find(
    (item) => item.pressure === Number(pressure)
  );
};

const calculateSteamPipeDiameter = async (req, res) => {
  try {
    const {
      steamFlowRate,
      steamPressure,
      velocity,
    } = req.body;

    // Validation
    if (
      !steamFlowRate ||
      !steamPressure ||
      !velocity
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Steam flow rate, steam pressure and velocity are required",
      });
    }

    const flowRate = Number(steamFlowRate);
    const pressure = Number(steamPressure);
    const steamVelocity = Number(velocity);

    if (
      flowRate <= 0 ||
      pressure < 0 ||
      steamVelocity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter valid positive values",
      });
    }

    // Find steam properties
    const steamData = findSteamData(pressure);

    if (!steamData) {
      return res.status(404).json({
        success: false,
        message: `Steam data not found for ${pressure} bar(g)`,
      });
    }

    const specificVolume =
      steamData.specificVolume;

    // Step 1: Volumetric Flow in m³/hr
    const volumetricFlowPerHour =
      flowRate * specificVolume;

    // Step 2: Convert to m³/s
    const volumetricFlowPerSecond =
      volumetricFlowPerHour / 3600;

    // Step 3: Calculate Pipe Diameter in meters
    const pipeDiameterMeter = Math.sqrt(
      (volumetricFlowPerSecond * 4) /
      (Math.PI * steamVelocity)
    );

    // Step 4: Convert to mm
    const pipeDiameterMm =
      pipeDiameterMeter * 1000;

    return res.status(200).json({
      success: true,
      message:
        "Steam pipe diameter calculated successfully",

      data: {
        inputs: {
          steamFlowRate: flowRate,
          steamPressure: pressure,
          velocity: steamVelocity,
        },

        steamProperties: {
          specificVolume,
          unit: "m³/kg",
        },

        calculationSteps: {
          volumetricFlowPerHour: {
            value: Number(
              volumetricFlowPerHour.toFixed(4)
            ),
            unit: "m³/hr",
          },

          volumetricFlowPerSecond: {
            value: Number(
              volumetricFlowPerSecond.toFixed(6)
            ),
            unit: "m³/s",
          },

          pipeDiameterMeter: {
            value: Number(
              pipeDiameterMeter.toFixed(6)
            ),
            unit: "m",
          },
        },

        result: {
          pipeDiameterMm: {
            value: Number(
              pipeDiameterMm.toFixed(2)
            ),
            unit: "mm",
          },
        },
      },
    });
  } catch (error) {
    console.error(
      "Steam Pipe Diameter Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const calculateSteamPipeCapacity = async (req, res) => {
  try {
    const {
      steamPressure,
      pipeDiameter,
      velocity,
    } = req.body;

    // Validation
    if (
      !steamPressure ||
      !pipeDiameter ||
      !velocity
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Steam pressure, pipe diameter and velocity are required",
      });
    }

    const pressure = Number(steamPressure);
    const diameterMm = Number(pipeDiameter);
    const steamVelocity = Number(velocity);

    if (
      pressure < 0 ||
      diameterMm <= 0 ||
      steamVelocity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter valid positive values",
      });
    }

    // Find steam properties
    const steamData = findSteamData(pressure);

    if (!steamData) {
      return res.status(404).json({
        success: false,
        message: `Steam data not found for ${pressure} bar(g)`,
      });
    }

    const specificVolume =
      steamData.specificVolume;

    // Step 1: Convert mm to meters
    const diameterMeter =
      diameterMm / 1000;

    // Step 2: Calculate volumetric capacity
    const volumetricFlowCapacity =
      (
        Math.PI *
        Math.pow(diameterMeter, 2) *
        steamVelocity *
        3600
      ) / 4;

    // Step 3: Calculate mass flow capacity
    const massFlowCapacity =
      volumetricFlowCapacity / specificVolume;

    return res.status(200).json({
      success: true,
      message:
        "Steam pipe flow capacity calculated successfully",

      data: {
        inputs: {
          steamPressure: pressure,
          pipeDiameter: diameterMm,
          velocity: steamVelocity,
        },

        steamProperties: {
          specificVolume,
          unit: "m³/kg",
        },

        calculationSteps: {
          pipeDiameterMeter: {
            value: Number(
              diameterMeter.toFixed(6)
            ),
            unit: "m",
          },

          volumetricFlowCapacity: {
            value: Number(
              volumetricFlowCapacity.toFixed(4)
            ),
            unit: "m³/hr",
          },
        },

        result: {
          massFlowCapacity: {
            value: Number(
              massFlowCapacity.toFixed(2)
            ),
            unit: "kg/hr",
          },

          volumetricFlowCapacity: {
            value: Number(
              volumetricFlowCapacity.toFixed(2)
            ),
            unit: "m³/hr",
          },
        },
      },
    });
  } catch (error) {
    console.error(
      "Steam Pipe Capacity Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const calculateSafetyValveOrifice = async (req, res) => {
  try {
    const {
      setPressure,
      reliefCapacity,
      superheatFactor = 1,
    } = req.body;

    // Validation
    if (
      setPressure === undefined ||
      reliefCapacity === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Set pressure and required relief capacity are required",
      });
    }

    const pressure = Number(setPressure);
    const capacity = Number(reliefCapacity);
    const correctionFactor = Number(superheatFactor);

    // Check valid numbers
    if (
      Number.isNaN(pressure) ||
      Number.isNaN(capacity) ||
      Number.isNaN(correctionFactor)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid numeric values",
      });
    }

    // Check positive values
    if (
      pressure < 0 ||
      capacity <= 0 ||
      correctionFactor <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Pressure must be zero or positive, and capacity and correction factor must be greater than zero",
      });
    }

    // Constants from the calculator formula
    const steamConstant = 0.38;
    const atmosphericPressure = 1.013;

    // Step 1: Convert bar(g) to bar(a)
    const absolutePressure =
      pressure + atmosphericPressure;

    // Step 2: Calculate required orifice area
    //
    // A = [E ÷ (C × (P + 1.013))] × F
    //
    const orificeArea =
      (capacity /
        (steamConstant * absolutePressure)) *
      correctionFactor;

    // Step 3: Calculate orifice diameter
    //
    // D = √(A × 4 / π)
    //
    const orificeDiameter = Math.sqrt(
      (orificeArea * 4) / Math.PI
    );

    return res.status(200).json({
      success: true,
      message:
        "Safety valve orifice calculated successfully",

      data: {
        inputs: {
          setPressure: pressure,
          reliefCapacity: capacity,
          superheatFactor: correctionFactor,
        },

        constants: {
          steamConstant: {
            value: steamConstant,
            unit: "dimensionless",
          },

          atmosphericPressure: {
            value: atmosphericPressure,
            unit: "bar",
          },
        },

        calculationSteps: {
          absolutePressure: {
            value: Number(
              absolutePressure.toFixed(3)
            ),
            unit: "bar(a)",
          },

          orificeArea: {
            value: Number(
              orificeArea.toFixed(2)
            ),
            unit: "mm²",
          },
        },

        result: {
          orificeDiameter: {
            value: Number(
              orificeDiameter.toFixed(2)
            ),
            unit: "mm",
          },
        },
      },
    });

  } catch (error) {
    console.error(
      "Safety Valve Orifice Calculation Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const calculateCondensateFlashSteamSaving = async (req, res) => {
  try {
    const {
      fuelGCV,
      fuelPrice,
      boilerEfficiency,
      operationalHoursPerDay,
      operationalDaysPerYear,
      condensateQuantity,
      condensatePressure,
      flashSteamPressure,
    } = req.body;

    // Validation

    if (
      fuelGCV === undefined ||
      fuelPrice === undefined ||
      boilerEfficiency === undefined ||
      operationalHoursPerDay === undefined ||
      operationalDaysPerYear === undefined ||
      condensateQuantity === undefined ||
      condensatePressure === undefined ||
      flashSteamPressure === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All input fields are required",
      });
    }


    // Convert inputs to numbers

    const gcv = Number(fuelGCV);
    const price = Number(fuelPrice);
    const efficiencyPercent = Number(boilerEfficiency);

    const hoursPerDay = Number(
      operationalHoursPerDay
    );

    const daysPerYear = Number(
      operationalDaysPerYear
    );

    const condensateQty = Number(
      condensateQuantity
    );

    const condensatePressureValue = Number(
      condensatePressure
    );

    const flashPressureValue = Number(
      flashSteamPressure
    );


    // Validate numbers

    const values = [
      gcv,
      price,
      efficiencyPercent,
      hoursPerDay,
      daysPerYear,
      condensateQty,
      condensatePressureValue,
      flashPressureValue,
    ];

    if (values.some((value) => Number.isNaN(value))) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid numeric values",
      });
    }


    // Validate positive values

    if (
      gcv <= 0 ||
      price < 0 ||
      efficiencyPercent <= 0 ||
      efficiencyPercent > 100 ||
      hoursPerDay <= 0 ||
      daysPerYear <= 0 ||
      condensateQty <= 0 ||
      condensatePressureValue < 0 ||
      flashPressureValue < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid input values",
      });
    }


    // Flash pressure must be lower than condensate pressure

    if (
      flashPressureValue >= condensatePressureValue
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Flash steam pressure must be lower than condensate pressure",
      });
    }


    // Find condensate pressure data

    const condensateSteamData =
      findSteamData(condensatePressureValue);


    if (!condensateSteamData) {
      return res.status(404).json({
        success: false,
        message: `Steam data not found for condensate pressure ${condensatePressureValue} bar(g)`,
      });
    }


    // Find flash pressure data

    const flashSteamData =
      findSteamData(flashPressureValue);


    if (!flashSteamData) {
      return res.status(404).json({
        success: false,
        message: `Steam data not found for flash steam pressure ${flashPressureValue} bar(g)`,
      });
    }


    // Steam table values

    const condensateTemperature =
      condensateSteamData.temperature;

    const flashSteamTemperature =
      flashSteamData.temperature;

    const latentHeat =
      flashSteamData.latentHeat;

    const totalHeat =
      flashSteamData.totalHeat;


    // Convert efficiency percentage to decimal

    const efficiency =
      efficiencyPercent / 100;


    // STEP 1
    // Differential Temperature

    const differentialTemperature =
      condensateTemperature -
      flashSteamTemperature;


    // STEP 2
    // Percentage of Flash Steam
    //
    // Formula from reference:
    // Flash Steam Fraction =
    // Differential Temperature / Latent Heat

    const flashSteamFraction =
      differentialTemperature / latentHeat;


    const flashSteamPercentage =
      flashSteamFraction * 100;


    // STEP 3
    // Flash Steam Quantity

    const flashSteamQuantity =
      flashSteamFraction * condensateQty;


    // STEP 4
    // Heat in Flash Steam

    const heatInFlashSteam =
      totalHeat * flashSteamQuantity;


    // STEP 5
    // Balance Condensate

    const balanceCondensate =
      condensateQty -
      flashSteamQuantity;


    // STEP 6
    // Fuel Saving from Flash Steam

    const fuelSavingFlash =
      heatInFlashSteam /
      (gcv * efficiency);


    // STEP 7
    // Hourly Saving from Flash Steam

    const hourlySavingFlash =
      fuelSavingFlash * price;


    // STEP 8
    // Annual Saving from Flash Steam

    const annualSavingFlash =
      hourlySavingFlash *
      hoursPerDay *
      daysPerYear;


    // STEP 9
    // Heat Recovered in Condensate
    //
    // Formula from reference:
    // Balance Condensate × 100

    const heatRecoveredCondensate =
      balanceCondensate * 100;


    // STEP 10
    // Fuel Saving from Condensate

    const fuelSavingCondensate =
      heatRecoveredCondensate /
      (gcv * efficiency);


    // STEP 11
    // Hourly Saving from Condensate

    const hourlySavingCondensate =
      fuelSavingCondensate * price;


    // STEP 12
    // Annual Saving from Condensate

    const annualSavingCondensate =
      hourlySavingCondensate *
      hoursPerDay *
      daysPerYear;


    // STEP 13
    // Total Annual Saving

    const totalAnnualSaving =
      annualSavingFlash +
      annualSavingCondensate;


    return res.status(200).json({

      success: true,

      message:
        "Condensate and flash steam saving calculated successfully",


      data: {

        inputs: {

          fuelGCV: gcv,

          fuelPrice: price,

          boilerEfficiency:
            efficiencyPercent,

          operationalHoursPerDay:
            hoursPerDay,

          operationalDaysPerYear:
            daysPerYear,

          condensateQuantity:
            condensateQty,

          condensatePressure:
            condensatePressureValue,

          flashSteamPressure:
            flashPressureValue,
        },


        steamProperties: {

          condensateTemperature: {
            value: Number(
              condensateTemperature.toFixed(2)
            ),
            unit: "°C",
          },

          flashSteamTemperature: {
            value: Number(
              flashSteamTemperature.toFixed(2)
            ),
            unit: "°C",
          },

          latentHeatAtFlashPressure: {
            value: Number(
              latentHeat.toFixed(2)
            ),
            unit: "Kcal/kg",
          },

          totalHeatAtFlashPressure: {
            value: Number(
              totalHeat.toFixed(2)
            ),
            unit: "Kcal/kg",
          },
        },


        calculationSteps: {

          differentialTemperature: {
            value: Number(
              differentialTemperature.toFixed(2)
            ),
            unit: "°C",
          },

          flashSteamPercentage: {
            value: Number(
              flashSteamPercentage.toFixed(2)
            ),
            unit: "%",
          },

          flashSteamQuantity: {
            value: Number(
              flashSteamQuantity.toFixed(2)
            ),
            unit: "kg/hr",
          },

          heatInFlashSteam: {
            value: Number(
              heatInFlashSteam.toFixed(2)
            ),
            unit: "Kcal/hr",
          },

          balanceCondensate: {
            value: Number(
              balanceCondensate.toFixed(2)
            ),
            unit: "kg/hr",
          },

          heatRecoveredCondensate: {
            value: Number(
              heatRecoveredCondensate.toFixed(2)
            ),
            unit: "Kcal/hr",
          },
        },


        savings: {

          annualSavingFlash: {
            value: Number(
              annualSavingFlash.toFixed(2)
            ),
            unit: "Rs/year",
          },

          annualSavingCondensate: {
            value: Number(
              annualSavingCondensate.toFixed(2)
            ),
            unit: "Rs/year",
          },
        },


        result: {

          flashSteamQuantity: {
            value: Number(
              flashSteamQuantity.toFixed(2)
            ),
            unit: "kg/hr",
          },

          totalAnnualSaving: {
            value: Number(
              totalAnnualSaving.toFixed(2)
            ),
            unit: "Rs/year",
          },
        },

      },

    });

  } catch (error) {

    console.error(
      "Condensate Flash Steam Saving Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  }
};

const calculateBoilerDirectEfficiency = async (req, res) => {
  try {
    const {
      steamGeneration,
      boilerPressure,
      fuelGCV,
      fuelPrice,
      fuelConsumption,
      feedWaterTemperature,
    } = req.body;


    // Validation

    if (
      steamGeneration === undefined ||
      boilerPressure === undefined ||
      fuelGCV === undefined ||
      fuelPrice === undefined ||
      fuelConsumption === undefined ||
      feedWaterTemperature === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All input fields are required",
      });
    }


    // Convert values

    const steamGenerationValue =
      Number(steamGeneration);

    const boilerPressureValue =
      Number(boilerPressure);

    const fuelGCVValue =
      Number(fuelGCV);

    const fuelPriceValue =
      Number(fuelPrice);

    const fuelConsumptionValue =
      Number(fuelConsumption);

    const feedWaterTemperatureValue =
      Number(feedWaterTemperature);


    // Check valid numbers

    const values = [
      steamGenerationValue,
      boilerPressureValue,
      fuelGCVValue,
      fuelPriceValue,
      fuelConsumptionValue,
      feedWaterTemperatureValue,
    ];

    if (values.some((value) => Number.isNaN(value))) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid numeric values",
      });
    }


    // Positive validation

    if (
      steamGenerationValue <= 0 ||
      boilerPressureValue < 0 ||
      fuelGCVValue <= 0 ||
      fuelPriceValue < 0 ||
      fuelConsumptionValue <= 0 ||
      feedWaterTemperatureValue < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid positive values",
      });
    }


    // Find steam data

    const steamData =
      findSteamData(boilerPressureValue);


    if (!steamData) {
      return res.status(404).json({
        success: false,
        message:
          `Steam data not found for ${boilerPressureValue} bar(g)`,
      });
    }


    // Steam table value

    const totalHeat =
      steamData.totalHeat;


    // STEP 1
    // Heat Added per kg of Steam

    const heatAddedPerKg =
      totalHeat -
      feedWaterTemperatureValue;


    // STEP 2
    // Total Heat Added

    const totalHeatAdded =
      heatAddedPerKg *
      steamGenerationValue;


    // STEP 3
    // Heat Input from Fuel

    const heatInputFromFuel =
      fuelConsumptionValue *
      fuelGCVValue;


    // STEP 4
    // Boiler Direct Efficiency

    const boilerEfficiency =
      (totalHeatAdded / heatInputFromFuel) *
      100;


    // STEP 5
    // Steam Cost

    const steamCost =
      (fuelConsumptionValue *
        fuelPriceValue) /
      steamGenerationValue;


    return res.status(200).json({

      success: true,

      message:
        "Boiler direct efficiency calculated successfully",

      data: {

        inputs: {

          steamGeneration:
            steamGenerationValue,

          boilerPressure:
            boilerPressureValue,

          fuelGCV:
            fuelGCVValue,

          fuelPrice:
            fuelPriceValue,

          fuelConsumption:
            fuelConsumptionValue,

          feedWaterTemperature:
            feedWaterTemperatureValue,

        },


        steamProperties: {

          totalHeat: {

            value: Number(
              totalHeat.toFixed(2)
            ),

            unit: "Kcal/kg",

          },

        },


        calculationSteps: {

          heatAddedPerKg: {

            value: Number(
              heatAddedPerKg.toFixed(2)
            ),

            unit: "Kcal/kg",

          },


          totalHeatAdded: {

            value: Number(
              totalHeatAdded.toFixed(2)
            ),

            unit: "Kcal/hr",

          },


          heatInputFromFuel: {

            value: Number(
              heatInputFromFuel.toFixed(2)
            ),

            unit: "Kcal/hr",

          },

        },


        result: {

          boilerEfficiency: {

            value: Number(
              boilerEfficiency.toFixed(2)
            ),

            unit: "%",

          },


          steamCost: {

            value: Number(
              steamCost.toFixed(2)
            ),

            unit: "Rs/kg",

          },

        },

      },

    });

  } catch (error) {

    console.error(
      "Boiler Direct Efficiency Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message: "Internal server error",

    });

  }
};
const calculateBlowDownSaving = async (req, res) => {
  try {
    const {
      steamGeneration,
      fuelPrice,
      fuelGCV,
      boilerEfficiency,
      feedWaterTDS,
      boilerAllowableTDS,
      blowDownDuration,
      blowDownsPerDay,
      valveFlowRate,
      heatContent,
      operationalDaysPerMonth,
      operationalMonthsPerYear,
    } = req.body;


    // Check required fields

    if (
      steamGeneration === undefined ||
      fuelPrice === undefined ||
      fuelGCV === undefined ||
      boilerEfficiency === undefined ||
      feedWaterTDS === undefined ||
      boilerAllowableTDS === undefined ||
      blowDownDuration === undefined ||
      blowDownsPerDay === undefined ||
      valveFlowRate === undefined ||
      heatContent === undefined ||
      operationalDaysPerMonth === undefined ||
      operationalMonthsPerYear === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All input fields are required",
      });
    }


    // Convert values to numbers

    const steamGenerationValue =
      Number(steamGeneration);

    const fuelPriceValue =
      Number(fuelPrice);

    const fuelGCVValue =
      Number(fuelGCV);

    const boilerEfficiencyValue =
      Number(boilerEfficiency);

    const feedWaterTDSValue =
      Number(feedWaterTDS);

    const boilerAllowableTDSValue =
      Number(boilerAllowableTDS);

    const blowDownDurationValue =
      Number(blowDownDuration);

    const blowDownsPerDayValue =
      Number(blowDownsPerDay);

    const valveFlowRateValue =
      Number(valveFlowRate);

    const heatContentValue =
      Number(heatContent);

    const operationalDaysValue =
      Number(operationalDaysPerMonth);

    const operationalMonthsValue =
      Number(operationalMonthsPerYear);


    // Validate numbers

    const values = [
      steamGenerationValue,
      fuelPriceValue,
      fuelGCVValue,
      boilerEfficiencyValue,
      feedWaterTDSValue,
      boilerAllowableTDSValue,
      blowDownDurationValue,
      blowDownsPerDayValue,
      valveFlowRateValue,
      heatContentValue,
      operationalDaysValue,
      operationalMonthsValue,
    ];


    if (values.some((value) => Number.isNaN(value))) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid numeric values",
      });
    }


    // Validate positive values

    if (
      steamGenerationValue <= 0 ||
      fuelPriceValue < 0 ||
      fuelGCVValue <= 0 ||
      boilerEfficiencyValue <= 0 ||
      boilerEfficiencyValue > 100 ||
      feedWaterTDSValue <= 0 ||
      boilerAllowableTDSValue <= 0 ||
      blowDownDurationValue <= 0 ||
      blowDownsPerDayValue <= 0 ||
      valveFlowRateValue <= 0 ||
      heatContentValue <= 0 ||
      operationalDaysValue <= 0 ||
      operationalMonthsValue <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid positive values",
      });
    }


    // Boiler allowable TDS must be higher

    if (
      boilerAllowableTDSValue <= feedWaterTDSValue
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Boiler allowable TDS must be greater than Feed Water TDS",
      });
    }


    // Convert boiler efficiency to decimal

    const efficiency =
      boilerEfficiencyValue / 100;


    // STEP 1
    // Required Blow Down

    const requiredBlowDown =
      (
        steamGenerationValue *
        feedWaterTDSValue *
        24
      ) /
      (
        boilerAllowableTDSValue -
        feedWaterTDSValue
      );


    // STEP 2
    // Present Manual Blow Down

    const presentManualBlowDown =
      valveFlowRateValue *
      blowDownDurationValue *
      blowDownsPerDayValue;


    // STEP 3
    // Excess Blow Down

    const excessBlowDown =
      presentManualBlowDown -
      requiredBlowDown;


    // STEP 4
    // Daily Saving

    const dailySaving =
      (
        excessBlowDown *
        heatContentValue *
        fuelPriceValue
      ) /
      (
        fuelGCVValue *
        efficiency
      );


    // STEP 5
    // Monthly Saving

    const monthlySaving =
      dailySaving *
      operationalDaysValue;


    // STEP 6
    // Annual Saving

    const annualSaving =
      monthlySaving *
      operationalMonthsValue;


    return res.status(200).json({

      success: true,

      message:
        "Blow down saving calculated successfully",

      data: {

        inputs: {

          steamGeneration:
            steamGenerationValue,

          fuelPrice:
            fuelPriceValue,

          fuelGCV:
            fuelGCVValue,

          boilerEfficiency:
            boilerEfficiencyValue,

          feedWaterTDS:
            feedWaterTDSValue,

          boilerAllowableTDS:
            boilerAllowableTDSValue,

          blowDownDuration:
            blowDownDurationValue,

          blowDownsPerDay:
            blowDownsPerDayValue,

          valveFlowRate:
            valveFlowRateValue,

          heatContent:
            heatContentValue,

          operationalDaysPerMonth:
            operationalDaysValue,

          operationalMonthsPerYear:
            operationalMonthsValue,

        },


        calculationSteps: {

          requiredBlowDown: {

            value: Number(
              requiredBlowDown.toFixed(2)
            ),

            unit: "kg/day",

          },


          presentManualBlowDown: {

            value: Number(
              presentManualBlowDown.toFixed(2)
            ),

            unit: "kg/day",

          },


          excessBlowDown: {

            value: Number(
              excessBlowDown.toFixed(2)
            ),

            unit: "kg/day",

          },

        },


        savings: {

          dailySaving: {

            value: Number(
              dailySaving.toFixed(2)
            ),

            unit: "Rs/day",

          },


          monthlySaving: {

            value: Number(
              monthlySaving.toFixed(2)
            ),

            unit: "Rs/month",

          },

        },


        result: {

          annualSaving: {

            value: Number(
              annualSaving.toFixed(2)
            ),

            unit: "Rs/year",

          },

        },

      },

    });

  } catch (error) {

    console.error(
      "Blow Down Saving Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message: "Internal server error",

    });

  }
};

const calculateSteamRequirementForProcessHeating = async (req, res) => {
  try {
    const {
      processMediaFlowRate,
      initialTemperature,
      finalTemperature,
      specificHeat,
      steamPressure,
    } = req.body;

    // Validation

    if (
      !processMediaFlowRate ||
      initialTemperature === undefined ||
      finalTemperature === undefined ||
      !specificHeat ||
      !steamPressure
    ) {
      return res.status(400).json({
        success: false,
        message: "All input values are required",
      });
    }

    const flowRate = Number(processMediaFlowRate);

    const initialTemp = Number(initialTemperature);

    const finalTemp = Number(finalTemperature);

    const cp = Number(specificHeat);

    const pressure = Number(steamPressure);


    // Positive value validation

    if (
      flowRate <= 0 ||
      cp <= 0 ||
      pressure < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid input values",
      });
    }


    // Final temperature should be greater

    if (finalTemp <= initialTemp) {
      return res.status(400).json({
        success: false,
        message:
          "Final temperature must be greater than initial temperature",
      });
    }


    // Find Steam Data

    const steamData = findSteamData(pressure);

    if (!steamData) {
      return res.status(404).json({
        success: false,
        message: `Steam data not found for ${pressure} bar(g)`,
      });
    }


    const latentHeat = steamData.latentHeat;


    // Step 1: Temperature Rise

    const temperatureRise =
      finalTemp - initialTemp;


    // Step 2: Heat Required

    const heatRequired =
      flowRate *
      cp *
      temperatureRise;


    // Step 3: Steam Required

    const steamRequired =
      heatRequired /
      latentHeat;


    return res.status(200).json({
      success: true,

      message:
        "Steam requirement calculated successfully",

      data: {

        inputs: {
          processMediaFlowRate: flowRate,
          initialTemperature: initialTemp,
          finalTemperature: finalTemp,
          specificHeat: cp,
          steamPressure: pressure,
        },


        steamProperties: {

          latentHeat: {
            value: Number(
              latentHeat.toFixed(2)
            ),

            unit: "Kcal/kg",
          },

        },


        calculationSteps: {

          temperatureRise: {

            value: Number(
              temperatureRise.toFixed(2)
            ),

            unit: "°C",

          },


          heatRequired: {

            value: Number(
              heatRequired.toFixed(2)
            ),

            unit: "Kcal/hr",

          },

        },


        result: {

          steamRequired: {

            value: Number(
              steamRequired.toFixed(2)
            ),

            unit: "kg/hr",

          },

        },

      },

    });

  } catch (error) {

    console.error(
      "Process Heating Steam Requirement Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Internal server error",

    });

  }
};
const calculateAirCoolingLoad = async (req, res) => {
  try {
    const {
      airFlow,
      airDensity,
      specificHeat,
      inletAirTemperature,
      outletAirTemperature,
      chilledWaterInletTemperature,
      chilledWaterOutletTemperature,
    } = req.body;

    // Validation

    if (
      !airFlow ||
      !airDensity ||
      !specificHeat ||
      inletAirTemperature === undefined ||
      outletAirTemperature === undefined ||
      chilledWaterInletTemperature === undefined ||
      chilledWaterOutletTemperature === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All input values are required",
      });
    }

    // Convert values to numbers

    const flow = Number(airFlow);
    const density = Number(airDensity);
    const cp = Number(specificHeat);

    const inletTemp = Number(inletAirTemperature);
    const outletTemp = Number(outletAirTemperature);

    const chilledWaterInletTemp = Number(
      chilledWaterInletTemperature
    );

    const chilledWaterOutletTemp = Number(
      chilledWaterOutletTemperature
    );

    // Basic validation

    if (
      flow <= 0 ||
      density <= 0 ||
      cp <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Air flow, air density and specific heat must be greater than zero",
      });
    }

    // Air temperature validation

    if (inletTemp <= outletTemp) {
      return res.status(400).json({
        success: false,
        message:
          "Inlet air temperature must be greater than outlet air temperature",
      });
    }

    // Chilled water temperature validation

    if (
      chilledWaterOutletTemp <=
      chilledWaterInletTemp
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Chilled water outlet temperature must be greater than inlet temperature",
      });
    }

    // STEP 1: Air Temperature Difference

    const airTemperatureDifference =
      inletTemp - outletTemp;

    // STEP 2: Cooling Load

    const coolingLoad =
      flow *
      60 *
      density *
      cp *
      airTemperatureDifference;

    // STEP 3: Chilled Water Temperature Difference

    const chilledWaterTemperatureDifference =
      chilledWaterOutletTemp -
      chilledWaterInletTemp;

    // STEP 4: Chilled Water Flow Rate

    const chilledWaterFlowRate =
      coolingLoad /
      chilledWaterTemperatureDifference;

    return res.status(200).json({
      success: true,

      message:
        "Air cooling load calculated successfully",

      data: {

        inputs: {
          airFlow: flow,
          airDensity: density,
          specificHeat: cp,

          inletAirTemperature: inletTemp,
          outletAirTemperature: outletTemp,

          chilledWaterInletTemperature:
            chilledWaterInletTemp,

          chilledWaterOutletTemperature:
            chilledWaterOutletTemp,
        },


        calculationSteps: {

          airTemperatureDifference: {
            value: Number(
              airTemperatureDifference.toFixed(2)
            ),
            unit: "°C",
          },


          coolingLoad: {
            value: Number(
              coolingLoad.toFixed(2)
            ),
            unit: "Kcal/hr",
          },


          chilledWaterTemperatureDifference: {
            value: Number(
              chilledWaterTemperatureDifference.toFixed(2)
            ),
            unit: "°C",
          },

        },


        result: {

          coolingLoad: {
            value: Number(
              coolingLoad.toFixed(2)
            ),
            unit: "Kcal/hr",
          },


          chilledWaterFlowRate: {
            value: Number(
              chilledWaterFlowRate.toFixed(2)
            ),
            unit: "kg/hr",
          },

        },

      },

    });

  } catch (error) {

    console.error(
      "Air Cooling Load Calculation Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  }
};

const calculateLiquidPipeDiameter = async (req, res) => {
  try {
    const { flowRate, velocity } = req.body;

    // Validation
    if (
      flowRate === undefined ||
      velocity === undefined ||
      flowRate === "" ||
      velocity === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Flow rate and velocity are required",
      });
    }

    const flow = Number(flowRate);
    const liquidVelocity = Number(velocity);

    if (
      isNaN(flow) ||
      isNaN(liquidVelocity) ||
      flow <= 0 ||
      liquidVelocity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid positive values",
      });
    }

    // Step 1: Convert flow rate from m³/hr to m³/s
    const flowRatePerSecond = flow / 3600;

    // Step 2: Calculate pipe diameter in meters
    const pipeDiameterMeter = Math.sqrt(
      (4 * flowRatePerSecond) /
      (Math.PI * liquidVelocity)
    );

    // Step 3: Convert meters to mm
    const pipeDiameterMm =
      pipeDiameterMeter * 1000;

    return res.status(200).json({
      success: true,
      message:
        "Liquid pipe diameter calculated successfully",

      data: {
        inputs: {
          flowRate: flow,
          velocity: liquidVelocity,
        },

        calculationSteps: {
          flowRatePerSecond: {
            value: Number(
              flowRatePerSecond.toFixed(6)
            ),
            unit: "m³/s",
          },

          pipeDiameterMeter: {
            value: Number(
              pipeDiameterMeter.toFixed(6)
            ),
            unit: "m",
          },
        },

        result: {
          pipeDiameterMm: {
            value: Number(
              pipeDiameterMm.toFixed(2)
            ),
            unit: "mm",
          },
        },
      },
    });

  } catch (error) {

    console.error(
      "Liquid Pipe Diameter Calculation Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const calculateLiquidPipeCapacity = async (req, res) => {
  try {
    const { pipeDiameter, velocity } = req.body;

    // Validation
    if (
      pipeDiameter === undefined ||
      velocity === undefined ||
      pipeDiameter === "" ||
      velocity === ""
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Pipe diameter and velocity are required",
      });
    }

    const diameterMm = Number(pipeDiameter);
    const liquidVelocity = Number(velocity);

    if (
      isNaN(diameterMm) ||
      isNaN(liquidVelocity) ||
      diameterMm <= 0 ||
      liquidVelocity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid positive values",
      });
    }

    // Step 1: Convert pipe diameter from mm to meters
    const diameterMeter =
      diameterMm / 1000;

    // Step 2: Calculate cross-sectional area
    const crossSectionalArea =
      (Math.PI *
        Math.pow(diameterMeter, 2)) / 4;

    // Step 3: Calculate flow capacity in m³/s
    const flowCapacityPerSecond =
      crossSectionalArea *
      liquidVelocity;

    // Step 4: Convert flow capacity to m³/hr
    const flowCapacityPerHour =
      flowCapacityPerSecond * 3600;

    return res.status(200).json({
      success: true,
      message:
        "Liquid pipe flow capacity calculated successfully",

      data: {
        inputs: {
          pipeDiameter: diameterMm,
          velocity: liquidVelocity,
        },

        calculationSteps: {
          pipeDiameterMeter: {
            value: Number(
              diameterMeter.toFixed(6)
            ),
            unit: "m",
          },

          crossSectionalArea: {
            value: Number(
              crossSectionalArea.toFixed(6)
            ),
            unit: "m²",
          },

          flowCapacityPerSecond: {
            value: Number(
              flowCapacityPerSecond.toFixed(6)
            ),
            unit: "m³/s",
          },
        },

        result: {
          flowCapacityPerHour: {
            value: Number(
              flowCapacityPerHour.toFixed(2)
            ),
            unit: "m³/hr",
          },

          flowCapacityPerSecond: {
            value: Number(
              flowCapacityPerSecond.toFixed(6)
            ),
            unit: "m³/s",
          },
        },
      },
    });

  } catch (error) {

    console.error(
      "Liquid Pipe Capacity Calculation Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const calculateSteamRequiredForEvaporation = async (req, res) => {
  try {
    const {
      totalQuantity,
      evaporationQuantity,
      evaporationPressure,
      initialTemperature,
      specificHeat,
      steamPressure,
    } = req.body;

    // Validation
    if (
      totalQuantity === undefined ||
      evaporationQuantity === undefined ||
      evaporationPressure === undefined ||
      initialTemperature === undefined ||
      specificHeat === undefined ||
      steamPressure === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All input fields are required",
      });
    }

    const totalQty = Number(totalQuantity);
    const evapQty = Number(evaporationQuantity);
    const evapPressure = Number(evaporationPressure);
    const initialTemp = Number(initialTemperature);
    const cp = Number(specificHeat);
    const supplySteamPressure = Number(steamPressure);

    // Validate numeric values
    if (
      totalQty <= 0 ||
      evapQty <= 0 ||
      evapQty > totalQty ||
      evapPressure < 0 ||
      cp <= 0 ||
      supplySteamPressure < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter valid values. Evaporation quantity cannot exceed total quantity.",
      });
    }

    // Steam table lookup
    const evaporationSteamData = findSteamData(evapPressure);
    const supplySteamData = findSteamData(supplySteamPressure);

    if (!evaporationSteamData) {
      return res.status(404).json({
        success: false,
        message: `Steam data not found for evaporation pressure ${evapPressure} bar(g)`,
      });
    }

    if (!supplySteamData) {
      return res.status(404).json({
        success: false,
        message: `Steam data not found for steam pressure ${supplySteamPressure} bar(g)`,
      });
    }

    // Steam properties
    const boilingTemperature =
      evaporationSteamData.temperature;

    const latentHeatEvaporation =
      evaporationSteamData.latentHeat;

    const latentHeatSteam =
      supplySteamData.latentHeat;

    // Q1 = Energy to reach boiling point
    const energyToBoilingPoint =
      totalQty *
      cp *
      (boilingTemperature - initialTemp);

    // Q2 = Energy required for evaporation
    const energyToEvaporate =
      evapQty *
      latentHeatEvaporation;

    // Total energy
    const totalEnergyRequired =
      energyToBoilingPoint +
      energyToEvaporate;

    // Steam required
    const steamRequired =
      totalEnergyRequired /
      latentHeatSteam;

    // Equivalent electrical load
    const equivalentElectricalLoad =
      totalEnergyRequired *
      0.001162;

    return res.status(200).json({
      success: true,

      message:
        "Steam requirement for evaporation calculated successfully",

      data: {
        inputs: {
          totalQuantity: totalQty,
          evaporationQuantity: evapQty,
          evaporationPressure: evapPressure,
          initialTemperature: initialTemp,
          specificHeat: cp,
          steamPressure: supplySteamPressure,
        },

        steamProperties: {
          evaporationPressure: {
            boilingTemperature: {
              value: Number(boilingTemperature.toFixed(2)),
              unit: "°C",
            },

            latentHeat: {
              value: Number(latentHeatEvaporation.toFixed(2)),
              unit: "Kcal/kg",
            },
          },

          steamPressure: {
            latentHeat: {
              value: Number(latentHeatSteam.toFixed(2)),
              unit: "Kcal/kg",
            },
          },
        },

        calculationSteps: {
          energyToBoilingPoint: {
            value: Number(
              energyToBoilingPoint.toFixed(2)
            ),
            unit: "Kcal",
          },

          energyToEvaporate: {
            value: Number(
              energyToEvaporate.toFixed(2)
            ),
            unit: "Kcal",
          },

          totalEnergyRequired: {
            value: Number(
              totalEnergyRequired.toFixed(2)
            ),
            unit: "Kcal",
          },
        },

        result: {
          steamRequired: {
            value: Number(
              steamRequired.toFixed(2)
            ),
            unit: "kg/hr",
          },

          equivalentElectricalLoad: {
            value: Number(
              equivalentElectricalLoad.toFixed(2)
            ),
            unit: "kW",
          },
        },
      },
    });

  } catch (error) {

    console.error(
      "Steam Required For Evaporation Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const calculateFeedWaterTankTemperature = async (req, res) => {
  try {
    const {
      condensateQuantity,
      condensateTemperature,
      freshWaterQuantity,
      freshWaterTemperature,
      flashSteamQuantity,
      flashSteamPressure,
    } = req.body;

    // Validation
    if (
      condensateQuantity === undefined ||
      condensateTemperature === undefined ||
      freshWaterQuantity === undefined ||
      freshWaterTemperature === undefined ||
      flashSteamQuantity === undefined ||
      flashSteamPressure === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All input fields are required",
      });
    }

    // Convert inputs to numbers
    const condensateQty = Number(condensateQuantity);
    const condensateTemp = Number(condensateTemperature);

    const freshWaterQty = Number(freshWaterQuantity);
    const freshWaterTemp = Number(freshWaterTemperature);

    const flashSteamQty = Number(flashSteamQuantity);
    const flashPressure = Number(flashSteamPressure);

    // Validate numbers
    if (
      isNaN(condensateQty) ||
      isNaN(condensateTemp) ||
      isNaN(freshWaterQty) ||
      isNaN(freshWaterTemp) ||
      isNaN(flashSteamQty) ||
      isNaN(flashPressure)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid numeric values",
      });
    }

    // Validate positive values
    if (
      condensateQty < 0 ||
      condensateTemp < 0 ||
      freshWaterQty < 0 ||
      freshWaterTemp < 0 ||
      flashSteamQty < 0 ||
      flashPressure < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Values cannot be negative",
      });
    }

    // At least one quantity should be greater than zero
    if (
      condensateQty === 0 &&
      freshWaterQty === 0 &&
      flashSteamQty === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one quantity must be greater than zero",
      });
    }

    // Find steam data from saturated steam table
    const steamData = findSteamData(flashPressure);

    if (!steamData) {
      return res.status(404).json({
        success: false,
        message: `Steam data not found for ${flashPressure} bar(g)`,
      });
    }

    // Get total heat of flash steam
    const flashSteamTotalHeat = steamData.totalHeat;

    // STEP 1: Calculate total quantity
    const totalQuantity =
      condensateQty +
      freshWaterQty +
      flashSteamQty;

    // STEP 2: Calculate heat from condensate
    const condensateHeat =
      condensateQty * condensateTemp;

    // STEP 3: Calculate heat from fresh water
    const freshWaterHeat =
      freshWaterQty * freshWaterTemp;

    // STEP 4: Calculate heat from flash steam
    const flashSteamHeat =
      flashSteamQty * flashSteamTotalHeat;

    // STEP 5: Calculate total heat
    const totalHeat =
      condensateHeat +
      freshWaterHeat +
      flashSteamHeat;

    // STEP 6: Calculate final temperature
    const finalTemperature =
      totalHeat / totalQuantity;

    return res.status(200).json({
      success: true,

      message:
        "Feed water tank final temperature calculated successfully",

      data: {

        inputs: {
          condensateQuantity: condensateQty,
          condensateTemperature: condensateTemp,

          freshWaterQuantity: freshWaterQty,
          freshWaterTemperature: freshWaterTemp,

          flashSteamQuantity: flashSteamQty,
          flashSteamPressure: flashPressure,
        },

        steamProperties: {
          flashSteamTotalHeat: {
            value: flashSteamTotalHeat,
            unit: "kcal/kg",
          },
        },

        calculationSteps: {

          totalQuantity: {
            value: Number(totalQuantity.toFixed(2)),
            unit: "kg",
          },

          condensateHeat: {
            value: Number(condensateHeat.toFixed(2)),
            unit: "kcal",
          },

          freshWaterHeat: {
            value: Number(freshWaterHeat.toFixed(2)),
            unit: "kcal",
          },

          flashSteamHeat: {
            value: Number(flashSteamHeat.toFixed(2)),
            unit: "kcal",
          },

          totalHeat: {
            value: Number(totalHeat.toFixed(2)),
            unit: "kcal",
          },

        },

        result: {

          finalTemperature: {
            value: Number(finalTemperature.toFixed(2)),
            unit: "°C",
          },

        },

      },
    });

  } catch (error) {

    console.error(
      "Feed Water Tank Temperature Calculation Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  }
};
const calculateTankDimensionsAndWeight = async (req, res) => {
  try {
    const {
      tankType,
      capacity,
      length,
      width,
      diameter,
      thickness,
      steelDensity,
      numberOfEndPlates,
    } = req.body;

    // Validate tank type
    if (
      !tankType ||
      !["rectangular", "circular"].includes(tankType)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Tank type must be rectangular or circular",
      });
    }

    // Common values
    const tankCapacity = Number(capacity);
    const shellThicknessMm = Number(thickness);

    // Default steel density = 7850 kg/m³
    const density =
      steelDensity !== undefined
        ? Number(steelDensity)
        : 7850;

    if (
      !Number.isFinite(tankCapacity) ||
      tankCapacity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Tank capacity must be greater than zero",
      });
    }

    if (
      !Number.isFinite(shellThicknessMm) ||
      shellThicknessMm <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Shell thickness must be greater than zero",
      });
    }

    if (
      !Number.isFinite(density) ||
      density <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Steel density must be greater than zero",
      });
    }

    // Convert thickness from mm to meters
    const thicknessMeter =
      shellThicknessMm / 1000;

    // =====================================================
    // RECTANGULAR TANK
    // =====================================================

    if (tankType === "rectangular") {

      const tankLength = Number(length);
      const tankWidth = Number(width);

      if (
        !Number.isFinite(tankLength) ||
        tankLength <= 0 ||
        !Number.isFinite(tankWidth) ||
        tankWidth <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Length and width must be greater than zero",
        });
      }

      // STEP 1: Tank Height
      const tankHeight =
        tankCapacity /
        (tankLength * tankWidth);

      // STEP 2: Volume Check
      const calculatedVolume =
        tankLength *
        tankWidth *
        tankHeight;

      /*
        STEP 3:
        Calculate weight of three pairs of sides.

        Pair 1:
        Length × Width × Thickness × Density × 2

        Pair 2:
        Length × Height × Thickness × Density × 2

        Pair 3:
        Width × Height × Thickness × Density × 2
      */

      const lengthWidthWeight =
        tankLength *
        tankWidth *
        thicknessMeter *
        density *
        2;

      const lengthHeightWeight =
        tankLength *
        tankHeight *
        thicknessMeter *
        density *
        2;

      const widthHeightWeight =
        tankWidth *
        tankHeight *
        thicknessMeter *
        density *
        2;

      // STEP 4: Total Weight
      const totalTankWeight =
        lengthWidthWeight +
        lengthHeightWeight +
        widthHeightWeight;

      return res.status(200).json({
        success: true,

        message:
          "Rectangular tank dimensions and weight calculated successfully",

        data: {

          tankType: "rectangular",

          inputs: {
            capacity: tankCapacity,
            length: tankLength,
            width: tankWidth,
            thickness: shellThicknessMm,
            steelDensity: density,
          },

          calculationSteps: {

            tankHeight: {
              value: Number(
                tankHeight.toFixed(4)
              ),
              unit: "m",
            },

            calculatedVolume: {
              value: Number(
                calculatedVolume.toFixed(4)
              ),
              unit: "m³",
            },

            lengthWidthPairWeight: {
              value: Number(
                lengthWidthWeight.toFixed(2)
              ),
              unit: "kg",
            },

            lengthHeightPairWeight: {
              value: Number(
                lengthHeightWeight.toFixed(2)
              ),
              unit: "kg",
            },

            widthHeightPairWeight: {
              value: Number(
                widthHeightWeight.toFixed(2)
              ),
              unit: "kg",
            },

          },

          result: {

            totalTankWeight: {
              value: Number(
                totalTankWeight.toFixed(2)
              ),
              unit: "kg",
            },

          },

        },
      });
    }

    // =====================================================
    // CIRCULAR TANK
    // =====================================================

    if (tankType === "circular") {

      const tankDiameter = Number(diameter);

      const endPlates =
        numberOfEndPlates !== undefined
          ? Number(numberOfEndPlates)
          : 2;

      if (
        !Number.isFinite(tankDiameter) ||
        tankDiameter <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Tank diameter must be greater than zero",
        });
      }

      if (
        !Number.isFinite(endPlates) ||
        endPlates <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Number of end plates must be greater than zero",
        });
      }

      // STEP 1: Circular Tank Length

      const radius =
        tankDiameter / 2;

      const crossSectionArea =
        Math.PI *
        Math.pow(radius, 2);

      const tankLength =
        tankCapacity /
        crossSectionArea;

      // STEP 2: Volume Check

      const calculatedVolume =
        Math.PI *
        tankLength *
        Math.pow(tankDiameter, 2) /
        4;

      // STEP 3: Circumference

      const circumference =
        Math.PI *
        tankDiameter;

      // STEP 4: Shell Sheet Volume

      const shellSheetVolume =
        circumference *
        tankLength *
        thicknessMeter;

      // STEP 5: Shell Weight

      const shellWeight =
        shellSheetVolume *
        density;

      // STEP 6: End Plate Area

      const endPlateArea =
        Math.PI *
        Math.pow(radius, 2);

      // STEP 7: End Plate Volume

      const endPlateVolume =
        endPlateArea *
        thicknessMeter *
        endPlates;

      // STEP 8: End Plate Weight

      const endPlateWeight =
        endPlateVolume *
        density;

      // STEP 9: Total Weight

      const totalTankWeight =
        shellWeight +
        endPlateWeight;

      // STEP 10: Surface Area

      const surfaceArea =
        Math.PI *
        tankDiameter *
        tankLength;

      return res.status(200).json({
        success: true,

        message:
          "Circular tank dimensions and weight calculated successfully",

        data: {

          tankType: "circular",

          inputs: {
            capacity: tankCapacity,
            diameter: tankDiameter,
            thickness: shellThicknessMm,
            steelDensity: density,
            numberOfEndPlates: endPlates,
          },

          calculationSteps: {

            tankLength: {
              value: Number(
                tankLength.toFixed(4)
              ),
              unit: "m",
            },

            calculatedVolume: {
              value: Number(
                calculatedVolume.toFixed(4)
              ),
              unit: "m³",
            },

            circumference: {
              value: Number(
                circumference.toFixed(4)
              ),
              unit: "m",
            },

            shellWeight: {
              value: Number(
                shellWeight.toFixed(2)
              ),
              unit: "kg",
            },

            endPlateWeight: {
              value: Number(
                endPlateWeight.toFixed(2)
              ),
              unit: "kg",
            },

            surfaceArea: {
              value: Number(
                surfaceArea.toFixed(4)
              ),
              unit: "m²",
            },

          },

          result: {

            totalTankWeight: {
              value: Number(
                totalTankWeight.toFixed(2)
              ),
              unit: "kg",
            },

          },

        },
      });
    }

  } catch (error) {

    console.error(
      "Tank Dimensions and Weight Calculation Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const calculateHeatingCoolingSystem = async (req, res) => {
  try {
    const {
      hotWaterFlowRate,
      hotWaterInletTemp,
      hotWaterOutletTemp,
      steamPressure,
      steamVelocity,
      hotWaterVelocity,

      coolingWaterFlowRate,
      coolingWaterInletTemp,
      coolingWaterOutletTemp,

      chilledWaterInletTemp,
      chilledWaterOutletTemp,
      coolingWaterVelocity,
      chilledWaterVelocity,
    } = req.body;

    // ==============================
    // VALIDATION
    // ==============================

    if (
      !hotWaterFlowRate ||
      hotWaterInletTemp === undefined ||
      hotWaterOutletTemp === undefined ||
      !steamPressure ||
      !steamVelocity ||
      !hotWaterVelocity ||
      !coolingWaterFlowRate ||
      coolingWaterInletTemp === undefined ||
      coolingWaterOutletTemp === undefined ||
      chilledWaterInletTemp === undefined ||
      chilledWaterOutletTemp === undefined ||
      !coolingWaterVelocity ||
      !chilledWaterVelocity
    ) {
      return res.status(400).json({
        success: false,
        message: "All input fields are required",
      });
    }

    // ==============================
    // CONVERT VALUES
    // ==============================

    const hotWaterFlow = Number(hotWaterFlowRate);

    const hotWaterInlet = Number(hotWaterInletTemp);

    const hotWaterOutlet = Number(hotWaterOutletTemp);

    const pressure = Number(steamPressure);

    const steamVel = Number(steamVelocity);

    const hotWaterVel = Number(hotWaterVelocity);

    const coolingWaterFlow = Number(coolingWaterFlowRate);

    const coolingWaterInlet = Number(coolingWaterInletTemp);

    const coolingWaterOutlet = Number(coolingWaterOutletTemp);

    const chilledWaterInlet = Number(chilledWaterInletTemp);

    const chilledWaterOutlet = Number(chilledWaterOutletTemp);

    const coolingWaterVel = Number(coolingWaterVelocity);

    const chilledWaterVel = Number(chilledWaterVelocity);

    // ==============================
    // BASIC VALUE VALIDATION
    // ==============================

    if (
      hotWaterFlow <= 0 ||
      pressure <= 0 ||
      steamVel <= 0 ||
      hotWaterVel <= 0 ||
      coolingWaterFlow <= 0 ||
      coolingWaterVel <= 0 ||
      chilledWaterVel <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid positive values",
      });
    }

    // ==============================
    // TEMPERATURE VALIDATION
    // ==============================

    if (hotWaterOutlet <= hotWaterInlet) {
      return res.status(400).json({
        success: false,
        message:
          "Hot water outlet temperature must be greater than inlet temperature",
      });
    }

    if (coolingWaterOutlet <= coolingWaterInlet) {
      return res.status(400).json({
        success: false,
        message:
          "Cooling water outlet temperature must be greater than inlet temperature",
      });
    }

    if (chilledWaterOutlet <= chilledWaterInlet) {
      return res.status(400).json({
        success: false,
        message:
          "Chilled water outlet temperature must be greater than inlet temperature",
      });
    }

    // ==============================
    // GET STEAM DATA
    // ==============================

    const steamData = findSteamData(pressure);

    if (!steamData) {
      return res.status(404).json({
        success: false,
        message: `Steam data not found for ${pressure} bar(g)`,
      });
    }

    const latentHeat = steamData.latentHeat;

    const specificVolume = steamData.specificVolume;

    // ======================================
    // HEATING SIDE CALCULATIONS
    // ======================================

    // Water density approximately = 1000 kg/m³

    const hotWaterMassFlow = hotWaterFlow * 1000;

    const hotWaterDeltaT =
      hotWaterOutlet - hotWaterInlet;

    // Cp of water = 1 kcal/kg°C

    const steamRequired =
      (hotWaterMassFlow * hotWaterDeltaT) /
      latentHeat;

    // ======================================
    // STEAM VOLUMETRIC FLOW
    // ======================================

    const steamVolumetricFlowPerHour =
      steamRequired * specificVolume;

    const steamVolumetricFlowPerSecond =
      steamVolumetricFlowPerHour / 3600;

    // ======================================
    // STEAM PIPE DIAMETER
    // ======================================

    const steamPipeDiameterMeter = Math.sqrt(
      (steamVolumetricFlowPerSecond * 4) /
        (Math.PI * steamVel)
    );

    const steamPipeDiameterMm =
      steamPipeDiameterMeter * 1000;

    // ======================================
    // HOT WATER PIPE DIAMETER
    // ======================================

    const hotWaterVolumetricFlowPerSecond =
      hotWaterFlow / 3600;

    const hotWaterPipeDiameterMeter =
      Math.sqrt(
        (hotWaterVolumetricFlowPerSecond * 4) /
          (Math.PI * hotWaterVel)
      );

    const hotWaterPipeDiameterMm =
      hotWaterPipeDiameterMeter * 1000;

    // ======================================
    // COOLING SIDE
    // ======================================

    const coolingDeltaT =
      coolingWaterOutlet - coolingWaterInlet;

    const chilledWaterDeltaT =
      chilledWaterOutlet - chilledWaterInlet;

    // Formula:
    // Chilled Water Flow =
    // Cooling Water Flow × ΔT Cooling / ΔT Chilled

    const chilledWaterFlowRate =
      (coolingWaterFlow * coolingDeltaT) /
      chilledWaterDeltaT;

    // ======================================
    // COOLING WATER PIPE DIAMETER
    // ======================================

    const coolingWaterFlowPerSecond =
      coolingWaterFlow / 3600;

    const coolingWaterPipeDiameterMeter =
      Math.sqrt(
        (coolingWaterFlowPerSecond * 4) /
          (Math.PI * coolingWaterVel)
      );

    const coolingWaterPipeDiameterMm =
      coolingWaterPipeDiameterMeter * 1000;

    // ======================================
    // CHILLED WATER PIPE DIAMETER
    // ======================================

    const chilledWaterFlowPerSecond =
      chilledWaterFlowRate / 3600;

    const chilledWaterPipeDiameterMeter =
      Math.sqrt(
        (chilledWaterFlowPerSecond * 4) /
          (Math.PI * chilledWaterVel)
      );

    const chilledWaterPipeDiameterMm =
      chilledWaterPipeDiameterMeter * 1000;

    // ======================================
    // RESPONSE
    // ======================================

    return res.status(200).json({
      success: true,

      message:
        "Heating and cooling system calculated successfully",

      data: {

        steamProperties: {
          pressure,
          latentHeat,
          specificVolume,
        },

        heatingSystem: {

          hotWaterFlowRate: {
            value: hotWaterFlow,
            unit: "m³/hr",
          },

          temperatureDifference: {
            value: Number(
              hotWaterDeltaT.toFixed(2)
            ),
            unit: "°C",
          },

          steamRequired: {
            value: Number(
              steamRequired.toFixed(2)
            ),
            unit: "kg/hr",
          },

          steamLineSize: {
            value: Number(
              steamPipeDiameterMm.toFixed(2)
            ),
            unit: "mm",
          },

          hotWaterLineSize: {
            value: Number(
              hotWaterPipeDiameterMm.toFixed(2)
            ),
            unit: "mm",
          },
        },

        coolingSystem: {

          coolingWaterFlowRate: {
            value: coolingWaterFlow,
            unit: "m³/hr",
          },

          chilledWaterFlowRate: {
            value: Number(
              chilledWaterFlowRate.toFixed(2)
            ),
            unit: "m³/hr",
          },

          coolingWaterLineSize: {
            value: Number(
              coolingWaterPipeDiameterMm.toFixed(2)
            ),
            unit: "mm",
          },

          chilledWaterLineSize: {
            value: Number(
              chilledWaterPipeDiameterMm.toFixed(2)
            ),
            unit: "mm",
          },
        },
      },
    });

  } catch (error) {

    console.error(
      "Heating Cooling System Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const calculateWeight = async (req, res) => {
  try {
    const {
      shape,
      density = 7850,

      // Common
      length,

      // Pipe / Round Bar
      outerDiameter,
      thickness,
      diameter,

      // Plate
      width,

      // Tube
      height,

      // Channel
      webHeight,
      flangeLength,

      // I Section
      flangeThickness,
      webThickness,

      // Equal Angle
      side,
    } = req.body;

    if (!shape) {
      return res.status(400).json({
        success: false,
        message: "Please select a shape",
      });
    }

    const materialDensity = Number(density);
    const lengthMeter = Number(length);

    if (materialDensity <= 0 || lengthMeter <= 0) {
      return res.status(400).json({
        success: false,
        message: "Density and length must be positive values",
      });
    }

    let volume;
    let weight;
    let calculationDetails = {};

    // ==========================================
    // 1. PIPE
    // ==========================================

    if (shape === "pipe") {
      const od = Number(outerDiameter) / 1000;
      const t = Number(thickness) / 1000;

      if (od <= 0 || t <= 0 || od <= 2 * t) {
        return res.status(400).json({
          success: false,
          message: "Please enter valid pipe dimensions",
        });
      }

      const innerDiameter = od - 2 * t;

      const crossSectionalArea =
        (Math.PI * (Math.pow(od, 2) - Math.pow(innerDiameter, 2))) / 4;

      volume = crossSectionalArea * lengthMeter;
      weight = volume * materialDensity;

      calculationDetails = {
        outerDiameter: {
          value: Number((od * 1000).toFixed(2)),
          unit: "mm",
        },

        innerDiameter: {
          value: Number((innerDiameter * 1000).toFixed(2)),
          unit: "mm",
        },

        crossSectionalArea: {
          value: Number(crossSectionalArea.toFixed(8)),
          unit: "m²",
        },
      };
    }

    // ==========================================
    // 2. ROUND BAR
    // ==========================================

    else if (shape === "roundBar") {
      const d = Number(diameter) / 1000;

      if (d <= 0) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid diameter",
        });
      }

      volume =
        (Math.PI / 4) *
        Math.pow(d, 2) *
        lengthMeter;

      weight = volume * materialDensity;

      calculationDetails = {
        diameter: {
          value: Number((d * 1000).toFixed(2)),
          unit: "mm",
        },
      };
    }

    // ==========================================
    // 3. PLATE
    // ==========================================

    else if (shape === "plate") {
      const plateWidth = Number(width) / 1000;
      const plateThickness = Number(thickness) / 1000;

      if (plateWidth <= 0 || plateThickness <= 0) {
        return res.status(400).json({
          success: false,
          message: "Please enter valid plate dimensions",
        });
      }

      volume =
        lengthMeter *
        plateWidth *
        plateThickness;

      weight = volume * materialDensity;

      calculationDetails = {
        width: {
          value: Number((plateWidth * 1000).toFixed(2)),
          unit: "mm",
        },

        thickness: {
          value: Number((plateThickness * 1000).toFixed(2)),
          unit: "mm",
        },
      };
    }

    // ==========================================
    // 4. RECTANGULAR / SQUARE TUBE
    // ==========================================

    else if (shape === "tube") {
      const tubeWidth = Number(width) / 1000;
      const tubeHeight = Number(height) / 1000;
      const tubeThickness = Number(thickness) / 1000;

      if (
        tubeWidth <= 0 ||
        tubeHeight <= 0 ||
        tubeThickness <= 0 ||
        tubeWidth <= 2 * tubeThickness ||
        tubeHeight <= 2 * tubeThickness
      ) {
        return res.status(400).json({
          success: false,
          message: "Please enter valid tube dimensions",
        });
      }

      // Outer Area - Inner Area
      const outerArea =
        tubeWidth * tubeHeight;

      const innerArea =
        (tubeWidth - 2 * tubeThickness) *
        (tubeHeight - 2 * tubeThickness);

      const crossSectionalArea =
        outerArea - innerArea;

      volume =
        crossSectionalArea *
        lengthMeter;

      weight =
        volume * materialDensity;

      calculationDetails = {
        crossSectionalArea: {
          value: Number(crossSectionalArea.toFixed(8)),
          unit: "m²",
        },
      };
    }

    // ==========================================
    // 5. CHANNEL SECTION
    // ==========================================

    else if (shape === "channel") {
      const web = Number(webHeight) / 1000;
      const flange = Number(flangeLength) / 1000;
      const t = Number(thickness) / 1000;

      if (
        web <= 0 ||
        flange <= 0 ||
        t <= 0 ||
        flange <= t
      ) {
        return res.status(400).json({
          success: false,
          message: "Please enter valid channel dimensions",
        });
      }

      const webVolume =
        web * t * lengthMeter;

      const flangeVolume =
        (flange - t) *
        t *
        lengthMeter *
        2;

      volume =
        webVolume + flangeVolume;

      weight =
        volume * materialDensity;

      calculationDetails = {
        webVolume: {
          value: Number(webVolume.toFixed(8)),
          unit: "m³",
        },

        flangeVolume: {
          value: Number(flangeVolume.toFixed(8)),
          unit: "m³",
        },
      };
    }

    // ==========================================
    // 6. I SECTION
    // ==========================================

    else if (shape === "iSection") {
      const sectionHeight = Number(height) / 1000;
      const sectionWidth = Number(width) / 1000;
      const flangeT = Number(flangeThickness) / 1000;
      const webT = Number(webThickness) / 1000;

      if (
        sectionHeight <= 0 ||
        sectionWidth <= 0 ||
        flangeT <= 0 ||
        webT <= 0 ||
        sectionHeight <= 2 * flangeT
      ) {
        return res.status(400).json({
          success: false,
          message: "Please enter valid I-section dimensions",
        });
      }

      const webVolume =
        (sectionHeight - 2 * flangeT) *
        webT *
        lengthMeter;

      const flangeVolume =
        sectionWidth *
        flangeT *
        lengthMeter *
        2;

      volume =
        webVolume + flangeVolume;

      weight =
        volume * materialDensity;

      calculationDetails = {
        webVolume: {
          value: Number(webVolume.toFixed(8)),
          unit: "m³",
        },

        flangeVolume: {
          value: Number(flangeVolume.toFixed(8)),
          unit: "m³",
        },
      };
    }

    // ==========================================
    // 7. EQUAL ANGLE
    // ==========================================

    else if (shape === "angle") {
      const angleSide = Number(side) / 1000;
      const angleThickness =
        Number(thickness) / 1000;

      if (
        angleSide <= 0 ||
        angleThickness <= 0 ||
        angleSide <= angleThickness
      ) {
        return res.status(400).json({
          success: false,
          message: "Please enter valid angle dimensions",
        });
      }

      const volume1 =
        angleSide *
        angleThickness *
        lengthMeter;

      const volume2 =
        (angleSide - angleThickness) *
        angleThickness *
        lengthMeter;

      volume =
        volume1 + volume2;

      weight =
        volume * materialDensity;

      calculationDetails = {
        volume1: {
          value: Number(volume1.toFixed(8)),
          unit: "m³",
        },

        volume2: {
          value: Number(volume2.toFixed(8)),
          unit: "m³",
        },
      };
    }

    // ==========================================
    // INVALID SHAPE
    // ==========================================

    else {
      return res.status(400).json({
        success: false,
        message: "Invalid shape selected",
      });
    }

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: `${shape} weight calculated successfully`,

      data: {
        shape,

        density: {
          value: materialDensity,
          unit: "kg/m³",
        },

        length: {
          value: lengthMeter,
          unit: "m",
        },

        calculationDetails,

        result: {
          volume: {
            value: Number(volume.toFixed(6)),
            unit: "m³",
          },

          weight: {
            value: Number(weight.toFixed(2)),
            unit: "kg",
          },

          weightPerMeter: {
            value: Number(
              (weight / lengthMeter).toFixed(2)
            ),
            unit: "kg/m",
          },
        },
      },
    });

  } catch (error) {
    console.error(
      "Weight Calculator Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const calculatePRSSteamSaving = async (req, res) => {
  try {
    const {
      inletPressure,
      outletPressure,
      flowRate,
    } = req.body;

    // =============================
    // VALIDATION
    // =============================

    if (
      inletPressure === undefined ||
      outletPressure === undefined ||
      flowRate === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Inlet pressure, outlet pressure and flow rate are required",
      });
    }

    const inletP = Number(inletPressure);
    const outletP = Number(outletPressure);
    const steamFlowRate = Number(flowRate);

    if (
      inletP <= 0 ||
      outletP <= 0 ||
      steamFlowRate <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter valid positive values",
      });
    }

    // =============================
    // PRESSURE VALIDATION
    // =============================

    if (inletP <= outletP) {
      return res.status(400).json({
        success: false,
        message:
          "Inlet pressure must be greater than outlet pressure",
      });
    }

    // =============================
    // FIND STEAM DATA
    // =============================

    const inletSteamData =
      findSteamData(inletP);

    const outletSteamData =
      findSteamData(outletP);

    if (!inletSteamData) {
      return res.status(404).json({
        success: false,
        message:
          `Steam data not found for inlet pressure ${inletP} bar`,
      });
    }

    if (!outletSteamData) {
      return res.status(404).json({
        success: false,
        message:
          `Steam data not found for outlet pressure ${outletP} bar`,
      });
    }

    // =============================
    // GET LATENT HEAT
    // =============================

    const inletLatentHeat =
      inletSteamData.latentHeat;

    const outletLatentHeat =
      outletSteamData.latentHeat;

    // =============================
    // STEP 1
    // ENERGY REQUIRED WITHOUT PRS
    //
    // = Latent Heat at Inlet
    // × Flow Rate
    // =============================

    const energyWithoutPRS =
      inletLatentHeat *
      steamFlowRate;

    // =============================
    // STEP 2
    // ENERGY GENERATED WITH PRS
    //
    // = Latent Heat at Outlet
    // × Flow Rate
    // =============================

    const energyWithPRS =
      outletLatentHeat *
      steamFlowRate;

    // =============================
    // STEP 3
    // STEAM FLOW REQUIRED WITH PRS
    //
    // Energy Required without PRS
    // ÷ Latent Heat at Outlet
    // =============================

    const steamFlowRequiredWithPRS =
      energyWithoutPRS /
      outletLatentHeat;

    // =============================
    // STEP 4
    // TOTAL STEAM SAVING
    //
    // Flow Without PRS
    // − Flow Required With PRS
    // =============================

    const totalSteamSaving =
      steamFlowRate -
      steamFlowRequiredWithPRS;

    // =============================
    // RESPONSE
    // =============================

    return res.status(200).json({
      success: true,

      message:
        "PRS steam saving calculated successfully",

      data: {

        inputs: {

          inletPressure: {
            value: inletP,
            unit: "bar",
          },

          outletPressure: {
            value: outletP,
            unit: "bar",
          },

          flowRateWithoutPRS: {
            value: steamFlowRate,
            unit: "kg/hr",
          },

        },

        steamProperties: {

          inletLatentHeat: {
            value: inletLatentHeat,
            unit: "kcal/kg",
          },

          outletLatentHeat: {
            value: outletLatentHeat,
            unit: "kcal/kg",
          },

        },

        calculationSteps: {

          energyRequiredWithoutPRS: {
            value: Number(
              energyWithoutPRS.toFixed(2)
            ),
            unit: "kcal/hr",
          },

          energyGeneratedWithPRS: {
            value: Number(
              energyWithPRS.toFixed(2)
            ),
            unit: "kcal/hr",
          },

        },

        result: {

          steamFlowRequiredWithPRS: {
            value: Number(
              steamFlowRequiredWithPRS.toFixed(2)
            ),
            unit: "kg/hr",
          },

          totalSteamSaving: {
            value: Number(
              totalSteamSaving.toFixed(2)
            ),
            unit: "kg/hr",
          },

        },

      },
    });

  } catch (error) {

    console.error(
      "PRS Steam Saving Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  }
};

const calculateSuperheatedSteamPipeSize = async (req, res) => {
  try {
    const {
      pressure,
      temperature,
      steamFlowRate,
      velocity,
    } = req.body;

    // ============================
    // VALIDATION
    // ============================

    if (
      pressure === undefined ||
      temperature === undefined ||
      steamFlowRate === undefined ||
      velocity === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Pressure, temperature, steam flow rate and velocity are required",
      });
    }

    const P = Number(pressure);
    const temperatureC = Number(temperature);
    const flowRate = Number(steamFlowRate);
    const steamVelocity = Number(velocity);

    if (
      P <= 0 ||
      temperatureC <= 0 ||
      flowRate <= 0 ||
      steamVelocity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "All values must be greater than zero",
      });
    }

    // ============================
    // CONSTANTS
    // ============================

    // Critical Temperature of Water
    const Tc = 647.3; // Kelvin

    // Critical Pressure of Water
    const Pc = 220.64; // bar

    // Molecular Weight of Water
    const MW = 18.015;

    // Universal Gas Constant
    const R = 8314;

    // ============================
    // STEP 1
    // ABSOLUTE TEMPERATURE
    // ============================

    const temperatureK =
      temperatureC + 273.14;

    // ============================
    // STEP 2
    // REDUCED TEMPERATURE
    // ============================

    const reducedTemperature =
      temperatureK / Tc;

    // ============================
    // STEP 3
    // REDUCED PRESSURE
    // ============================

    const reducedPressure =
      P / Pc;

    // ============================
    // STEP 4
    // COMPRESSIBILITY FACTOR
    // ============================

    const denominator =
      Math.pow(reducedTemperature, 4.111);

    const correction =
      (0.3411 * reducedPressure) /
      denominator;

    const compressibilityFactor =
      1 -
      correction /
        (1 - correction);

    // ============================
    // VALIDATE COMPRESSIBILITY
    // ============================

    if (
      !isFinite(compressibilityFactor) ||
      compressibilityFactor <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid compressibility factor. Please check input values.",
      });
    }

    // ============================
    // STEP 5
    // STEAM DENSITY
    //
    // Density =
    // (P × 100 × MW) /
    // (Z × R × T)
    // ============================

    const density =
      (P * 100 * MW) /
      (
        compressibilityFactor *
        R *
        temperatureK
      );

    // ============================
    // VALIDATE DENSITY
    // ============================

    if (!isFinite(density) || density <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "Unable to calculate valid steam density",
      });
    }

    // ============================
    // STEP 6
    // SPECIFIC VOLUME
    // ============================

    const specificVolume =
      1 / density;

    // ============================
    // STEP 7
    // PIPE DIAMETER
    //
    // D =
    // √(
    // (4 × Mass Flow × Specific Volume)
    // /
    // (π × 3600 × Velocity)
    // )
    // ============================

    const pipeDiameterMeter =
      Math.sqrt(
        (4 *
          flowRate *
          specificVolume) /
          (
            Math.PI *
            3600 *
            steamVelocity
          )
      );

    // Convert Meter → mm
    const pipeDiameterMM =
      pipeDiameterMeter * 1000;

    // ============================
    // RESPONSE
    // ============================

    return res.status(200).json({
      success: true,
      message:
        "Superheated steam pipe size calculated successfully",

      data: {
        inputs: {
          pressure: {
            value: P,
            unit: "bar",
          },

          temperature: {
            value: temperatureC,
            unit: "°C",
          },

          steamFlowRate: {
            value: flowRate,
            unit: "kg/hr",
          },

          velocity: {
            value: steamVelocity,
            unit: "m/s",
          },
        },

        steamProperties: {
          absoluteTemperature: {
            value: Number(
              temperatureK.toFixed(2)
            ),
            unit: "K",
          },

          reducedTemperature: {
            value: Number(
              reducedTemperature.toFixed(5)
            ),
            unit: "",
          },

          reducedPressure: {
            value: Number(
              reducedPressure.toFixed(5)
            ),
            unit: "",
          },

          compressibilityFactor: {
            value: Number(
              compressibilityFactor.toFixed(5)
            ),
            unit: "",
          },

          density: {
            value: Number(
              density.toFixed(6)
            ),
            unit: "kg/m³",
          },

          specificVolume: {
            value: Number(
              specificVolume.toFixed(6)
            ),
            unit: "m³/kg",
          },
        },

        result: {
          pipeDiameterMeter: {
            value: Number(
              pipeDiameterMeter.toFixed(4)
            ),
            unit: "m",
          },

          requiredPipeDiameter: {
            value: Number(
              pipeDiameterMM.toFixed(2)
            ),
            unit: "mm",
          },
        },
      },
    });

  } catch (error) {
    console.error(
      "Superheated Steam Pipe Calculator Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const calculatePipeWallThickness = async (req, res) => {
  try {
    const {
      pipeType,
      materialGrade,
      designPressure,
      operatingTemperature,
      nominalPipeSize,
      pipeSchedule,
      mechanicalAllowance,
    } = req.body;

    // =====================================
    // VALIDATION
    // =====================================

    if (
      !pipeType ||
      !materialGrade ||
      designPressure === undefined ||
      operatingTemperature === undefined ||
      !nominalPipeSize ||
      !pipeSchedule ||
      mechanicalAllowance === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const pressureBar = Number(designPressure);
    const temperature = Number(operatingTemperature);
    const allowance = Number(mechanicalAllowance);

    if (
      pressureBar <= 0 ||
      temperature <= 0 ||
      allowance < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid input values",
      });
    }

    // =====================================
    // GET PIPE DIMENSIONS
    // =====================================

    const pipeData =
      pipeDimensions[nominalPipeSize];

    if (!pipeData) {
      return res.status(400).json({
        success: false,
        message: "Invalid nominal pipe size",
      });
    }

    const outsideDiameter =
      pipeData.outsideDiameter;

    // =====================================
    // GET PIPE WALL THICKNESS
    // =====================================

    const scheduleData =
      pipeSchedules[nominalPipeSize];

    if (!scheduleData) {
      return res.status(400).json({
        success: false,
        message:
          "Pipe schedule data not found",
      });
    }

    const actualWallThickness =
      scheduleData[pipeSchedule];

    if (!actualWallThickness) {
      return res.status(400).json({
        success: false,
        message:
          "Selected pipe schedule is not available for this pipe size",
      });
    }

    // =====================================
    // GET MATERIAL DATA
    // =====================================

    const selectedMaterial =
      materialData[materialGrade];

    if (!selectedMaterial) {
      return res.status(400).json({
        success: false,
        message: "Invalid material grade",
      });
    }

    // =====================================
    // GET ALLOWABLE STRESS
    // =====================================

    const stressData =
      getAllowableStress(
        selectedMaterial.allowableStress,
        temperature
      );

    if (!stressData) {
      return res.status(400).json({
        success: false,
        message:
          "Operating temperature is outside the supported material data range",
      });
    }

    const allowableStress =
      stressData.stress;

    // =====================================
    // QUALITY FACTOR
    // =====================================

    let E = 1;

    if (pipeType === "Welded") {
      E = 0.85;
    }

    // =====================================
    // MATERIAL FACTORS
    // =====================================

    const W = selectedMaterial.W;
    const Y = selectedMaterial.Y;

    // =====================================
    // CONVERT PRESSURE
    //
    // bar → MPa
    // =====================================

    const P =
      pressureBar / 10;

    const D =
      outsideDiameter;

    const S =
      allowableStress;

    // =====================================
    // ASME B31.3 FORMULA
    //
    // t =
    //
    // (P × D)
    // ----------------------
    // 2 × (S × E × W + Y × P)
    //
    // =====================================

    const calculatedThickness =
      (P * D) /
      (
        2 *
        (
          S * E * W +
          Y * P
        )
      );

    // =====================================
    // REQUIRED THICKNESS
    //
    // tm = t + Mechanical Allowance
    // =====================================

    const requiredThickness =
      calculatedThickness +
      allowance;

    // =====================================
    // SAFETY CHECK
    // =====================================

    const isSafe =
      requiredThickness <
      actualWallThickness;

    const safetyStatus =
      isSafe
        ? "SAFE"
        : "NOT SAFE";

    // =====================================
    // SAFETY MARGIN
    // =====================================

    const safetyMargin =
      actualWallThickness -
      requiredThickness;

    // =====================================
    // RESPONSE
    // =====================================

    return res.status(200).json({
      success: true,

      message:
        "Pipe wall thickness calculated successfully",

      data: {

        inputs: {

          pipeType: {
            value: pipeType,
            unit: "",
          },

          materialGrade: {
            value: materialGrade,
            unit: "",
          },

          designPressure: {
            value: pressureBar,
            unit: "bar",
          },

          operatingTemperature: {
            value: temperature,
            unit: "°C",
          },

          nominalPipeSize: {
            value: nominalPipeSize,
            unit: "inch",
          },

          pipeSchedule: {
            value: pipeSchedule,
            unit: "",
          },

          mechanicalAllowance: {
            value: allowance,
            unit: "mm",
          },

        },


        materialProperties: {

          allowableStress: {
            value: allowableStress,
            unit: "MPa",
          },

          stressTemperatureUsed: {
            value: stressData.temperature,
            unit: "°C",
          },

          qualityFactor: {
            value: E,
            unit: "",
          },

          strengthReductionFactor: {
            value: W,
            unit: "",
          },

          coefficientY: {
            value: Y,
            unit: "",
          },

        },


        pipeProperties: {

          outsideDiameter: {
            value: outsideDiameter,
            unit: "mm",
          },

          actualWallThickness: {
            value: actualWallThickness,
            unit: "mm",
          },

        },


        calculationSteps: {

          pressureMPa: {
            value: Number(P.toFixed(4)),
            unit: "MPa",
          },

          calculatedWallThickness: {
            value: Number(
              calculatedThickness.toFixed(4)
            ),
            unit: "mm",
          },

          requiredWallThickness: {
            value: Number(
              requiredThickness.toFixed(4)
            ),
            unit: "mm",
          },

          safetyMargin: {
            value: Number(
              safetyMargin.toFixed(4)
            ),
            unit: "mm",
          },

        },


        result: {

          safetyStatus: {
            value: safetyStatus,
            unit: "",
          },

          designStatus: {
            value: isSafe
              ? "Selected pipe schedule is suitable"
              : "Selected pipe schedule is NOT suitable",
            unit: "",
          },

        },

      },
    });

  } catch (error) {

    console.error(
      "Pipe Wall Thickness Calculator Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
module.exports = {
  calculateSteamPipeDiameter,
  calculateSteamPipeCapacity,
  calculateSafetyValveOrifice,
  calculateCondensateFlashSteamSaving,
  calculateBoilerDirectEfficiency,
  calculateBlowDownSaving,
  calculateSteamRequirementForProcessHeating,
  calculateAirCoolingLoad,
   calculateLiquidPipeDiameter,
  calculateLiquidPipeCapacity,
  calculateSteamRequiredForEvaporation,
  calculateFeedWaterTankTemperature,
  calculateTankDimensionsAndWeight,
  calculateHeatingCoolingSystem,
  calculateWeight,
  calculatePRSSteamSaving,
  calculateSuperheatedSteamPipeSize,
  calculatePipeWallThickness,
  
};