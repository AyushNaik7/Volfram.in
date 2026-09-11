const assert = require("node:assert/strict");
const calculators = require("../src/controllers/calculator.controllers");

function invoke(handler, body) {
  return new Promise((resolve) => {
    const response = {
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(value) {
        resolve({ statusCode: this.statusCode || 200, value });
      },
    };

    Promise.resolve(handler({ body }, response));
  });
}

async function run() {
  // =========================================================
  // #1 Saturated Steam Pipe Size (PASS baseline)
  // =========================================================
  const diameter = await invoke(calculators.calculateSteamPipeDiameter, {
    steamFlowRate: 1000,
    steamPressure: 6,
    velocity: 25,
  });
  assert.equal(diameter.statusCode, 200);
  assert.equal(diameter.value.success, true);
  assert.equal(diameter.value.data.steamProperties.specificVolume, 0.273);
  assert.ok(Number.isFinite(diameter.value.data.result.pipeDiameterMm.value));

  // #6 Steam Requirement for Process Heating (PASS baseline)
  const processHeating = await invoke(
    calculators.calculateSteamRequirementForProcessHeating,
    {
      processMediaFlowRate: 1000,
      initialTemperature: 30,
      finalTemperature: 80,
      specificHeat: 1,
      steamPressure: 3.5,
    }
  );
  assert.equal(processHeating.statusCode, 200);
  assert.equal(processHeating.value.data.steamProperties.latentHeat.value, 506.4);

  // #9 Steam Required for Evaporation (PASS baseline)
  const evaporation = await invoke(
    calculators.calculateSteamRequiredForEvaporation,
    {
      totalQuantity: 5000,
      evaporationQuantity: 300,
      evaporationPressure: 0.5,
      initialTemperature: 35,
      specificHeat: 1,
      steamPressure: 5,
    }
  );
  assert.equal(evaporation.statusCode, 200);
  assert.equal(
    evaporation.value.data.steamProperties.evaporationPressure.boilingTemperature.value,
    111.37
  );
  assert.ok(Number.isFinite(evaporation.value.data.result.steamRequired.value));

  // #10 Feed Water Tank Final Temperature (PASS baseline)
  const feedWater = await invoke(calculators.calculateFeedWaterTankTemperature, {
    condensateQuantity: 5000,
    condensateTemperature: 165,
    freshWaterQuantity: 1000,
    freshWaterTemperature: 30,
    flashSteamQuantity: 199,
    flashSteamPressure: 0.5,
  });
  assert.equal(feedWater.statusCode, 200);
  assert.equal(feedWater.value.data.steamProperties.flashSteamTotalHeat.value, 643.3);
  assert.ok(Number.isFinite(feedWater.value.data.result.finalTemperature.value));

  // #12 Heating & Cooling System (now includes Excel-exact pipe sizes)
  const cooling = await invoke(calculators.calculateHeatingCoolingSystem, {
    hotWaterFlowRate: 10,
    hotWaterInletTemp: 80,
    hotWaterOutletTemp: 90,
    steamPressure: 3.5,
    steamVelocity: 25,
    hotWaterVelocity: 1.5,
    coolingWaterFlowRate: 18,
    coolingWaterInletTemp: 35,
    coolingWaterOutletTemp: 30,
    chilledWaterInletTemp: 8,
    chilledWaterOutletTemp: 11,
    coolingWaterVelocity: 1.5,
    chilledWaterVelocity: 2,
  });
  assert.equal(cooling.statusCode, 200);
  assert.equal(cooling.value.success, true);

  // #16 Pipe Wall Thickness P11/P22 (PASS baseline)
  const thickness = await invoke(calculators.calculatePipeWallThickness, {
    pipeType: "Seamless",
    materialGrade: "A335 P22",
    designPressure: 110,
    operatingTemperature: 500,
    nominalPipeSize: "1.5",
    pipeSchedule: "SCH 80",
    mechanicalAllowance: 3,
  });
  assert.equal(thickness.statusCode, 200);
  assert.equal(thickness.value.success, true);
  assert.ok(Number.isFinite(thickness.value.data.calculationSteps.calculatedWallThickness.value));

  // #17 F&A Boiler Capacity (PASS baseline)
  const faCapacity = await invoke(calculators.calculateFAboilerCapacity, {
    boilerOperatingPressure: 17,
    boilerCapacity: 12000,
    feedWaterTemperature: 60,
  });
  assert.equal(faCapacity.statusCode, 200);
  assert.equal(
    faCapacity.value.data.result.netSteamDelivery.value.toFixed(5),
    "10499.33333"
  );

  // #20 General ASME Pipe Wall Thickness (PASS baseline)
  const generalThickness = await invoke(
    calculators.calculateGeneralPipeWallThickness,
    {
      pipeType: "Seamless",
      materialGrade: "A106 Gr. B",
      designPressure: 10,
      operatingTemperature: 200,
      nominalPipeSize: 150,
      pipeSchedule: 40,
    }
  );
  assert.equal(generalThickness.statusCode, 200);
  assert.equal(generalThickness.value.data.materialProperties.allowableStress, 118);
  assert.equal(generalThickness.value.data.materialProperties.coefficientY, 0.4);
  assert.equal(
    generalThickness.value.data.calculationSteps.calculatedThickness.toFixed(6),
    "0.710726"
  );

  // #18 PRDS / De-superheating (PASS baseline)
  const prds = await invoke(calculators.calculatePRDS, {
    steamFlowRate: 8000,
    inletPressure: 10,
    inletTemperature: 184.123,
    outletPressure: 6,
    requiredOutletTemperature: 165,
    waterTemperature: 105,
    waterPressure: 10,
    outletSuperheatedTemperature: 221,
    inletVelocity: 9.6,
    prsOutletVelocity: 19.23,
    desuperheaterOutletVelocity: 17.15,
    waterInjectionVelocity: 1.5,
  });
  assert.equal(prds.statusCode, 200);
  assert.equal(prds.value.success, true);
  assert.ok(Number.isFinite(prds.value.data.calculationSteps.requiredWaterQuantity.value));
  assert.ok(Number.isFinite(prds.value.data.pipeSizing.inletDiameter.value));

  // #15 Superheated Steam Pipe Size (PASS baseline)
  const superheated = await invoke(calculators.calculateSuperheatedSteamPipeSize, {
    pressure: 11,
    temperature: 320,
    steamFlowRate: 8500,
    velocity: 35,
  });
  assert.equal(superheated.statusCode, 200);
  assert.equal(superheated.value.data.steamProperties.absoluteTemperature.value, 593.14);
  assert.equal(superheated.value.data.steamProperties.reducedPressure.value, 0.04985);
  assert.equal(superheated.value.data.steamProperties.density.value, 4.117802);
  assert.equal(superheated.value.data.result.requiredPipeDiameter.value, 144.43);

  // #19 Saturated Steam Table (PASS baseline - direct data check)
  const steamTable = require("../src/data/saturatedSteamTable");
  const row6 = steamTable.find((r) => r.pressure === 6);
  assert.ok(row6, "Steam table entry for 6 bar(g) exists");
  assert.equal(row6.latentHeat, 493.39);

  // =========================================================
  // #2 Safety Valve Orifice
  // Excel Sheet "12 Safety Valve":
  //   A = E / (C * (P+1.013)) = 2600 / (0.38 * (4.1+1.013)) = 1338.18 mm²
  //   D = sqrt(A * 4 / 3.14) = 41.29 mm
  // =========================================================
  const safetyValve = await invoke(calculators.calculateSafetyValveOrifice, {
    setPressure: 4.1,
    reliefCapacity: 2600,
    superheatFactor: 1,
  });
  assert.equal(safetyValve.statusCode, 200);
  assert.equal(safetyValve.value.success, true);
  {
    const expectedArea = 2600 / (0.38 * (4.1 + 1.013));
    const expectedDiam = Math.sqrt(expectedArea * 4 / 3.14);
    assert.equal(
      safetyValve.value.data.calculationSteps.orificeArea.value,
      Number(expectedArea.toFixed(2))
    );
    assert.equal(
      safetyValve.value.data.result.orificeDiameter.value,
      Number(expectedDiam.toFixed(2))
    );
    // Excel shows area=1338.18, diam=41.29
    assert.equal(safetyValve.value.data.calculationSteps.orificeArea.value, 1338.18);
    assert.equal(safetyValve.value.data.result.orificeDiameter.value, 41.29);
  }

  // =========================================================
  // #3 Condensate & Flash Steam Saving
  // Excel Sheet2: gcv=9600, price=8, eff=90%, hours=24, days=250
  //   condensate=1000, condensatePressure=3.5 (T=148°C)
  //   flashPressure=1 (T=120.2°C, latent=525.79, total=646.57)
  //   totalAnnual = 716103.9 Rs/year
  // =========================================================
  const condensate = await invoke(
    calculators.calculateCondensateFlashSteamSaving,
    {
      fuelGCV: 9600,
      fuelPrice: 8,
      boilerEfficiency: 90,
      operationalHoursPerDay: 24,
      operationalDaysPerYear: 250,
      condensateQuantity: 1000,
      condensatePressure: 3.5,
      flashSteamPressure: 1,
    }
  );
  assert.equal(condensate.statusCode, 200);
  assert.equal(condensate.value.success, true);
  {
    // Flash steam = (148-120.2)/525.79 * 1000 = 52.87 kg/hr
    // Balance condensate = 947.13 kg/hr
    // Total annual = 716103.9 Rs/year
    const flashSteam = condensate.value.data.result.flashSteamQuantity.value;
    const totalSaving = condensate.value.data.result.totalAnnualSaving.value;
    assert.ok(flashSteam > 52 && flashSteam < 54, `flashSteam ${flashSteam} expected ~52.87`);
    assert.equal(totalSaving.toFixed(1), "716103.9");
  }

  // =========================================================
  // #4 Boiler Direct Efficiency
  // Excel Sheet5: steam=1600, pressure=7bar(g), gcv=4500, price=9.5, fuel=112, fw=65
  //   steamCost = (112 * 9.5) / 1600 = 0.665 Rs/kg  (Excel B16, formula-derived)
  //   efficiency = computed from standard formula
  // =========================================================
  const boiler = await invoke(calculators.calculateBoilerDirectEfficiency, {
    steamGeneration: 1600,
    boilerPressure: 7,
    fuelGCV: 4500,
    fuelPrice: 9.5,
    fuelConsumption: 112,
    feedWaterTemperature: 65,
  });
  assert.equal(boiler.statusCode, 200);
  assert.equal(boiler.value.success, true);
  {
    // Steam cost: Excel B16 = B11*B10/B6 = 112*9.5/1600 = 0.665
    assert.equal(boiler.value.data.result.steamCost.value.toFixed(3), "0.665");
    // totalHeat at 7bar(g) = 661.34 from steam table
    assert.equal(boiler.value.data.steamProperties.totalHeat.value, 661.34);
    // heatAddedPerKg = 661.34 - 65 = 596.34
    assert.equal(boiler.value.data.calculationSteps.heatAddedPerKg.value, 596.34);
  }

  // =========================================================
  // #5 Blow Down Saving
  // Excel Sheet6: steam=2000, price=8, gcv=5000, eff=70%, fdTDS=500, boilerTDS=1000
  //   duration=10s, blowdowns=3/day, valveFlow=6kg/s, heatContent=198.28
  //   opDays=30, opMonths=12
  //   Excel B22=48000, B24=180, B26=-47820, B28=-21672.57, B30=-7802125.38
  // =========================================================
  const blowdown = await invoke(calculators.calculateBlowDownSaving, {
    steamGeneration: 2000,
    fuelPrice: 8,
    fuelGCV: 5000,
    boilerEfficiency: 70,
    feedWaterTDS: 500,
    boilerAllowableTDS: 1000,
    blowDownDuration: 10,
    blowDownsPerDay: 3,
    valveFlowRate: 6,
    heatContent: 198.28,
    operationalDaysPerMonth: 30,
    operationalMonthsPerYear: 12,
  });
  assert.equal(blowdown.statusCode, 200);
  assert.equal(blowdown.value.success, true);
  {
    // Required BD = (2000*500*24)/(1000-500) = 48000 kg/day
    assert.equal(blowdown.value.data.calculationSteps.requiredBlowDown.value, 48000);
    // Present manual BD = 6*10*3 = 180 kg/day
    assert.equal(blowdown.value.data.calculationSteps.presentManualBlowDown.value, 180);
    // Excess = 180-48000 = -47820
    assert.equal(blowdown.value.data.calculationSteps.excessBlowDown.value, -47820);
    // Daily saving = (-47820*198.28*8)/(5000*0.70) = -21672.57
    assert.equal(
      blowdown.value.data.savings.dailySaving.value.toFixed(2),
      "-21672.57"
    );
    // Annual saving = daily*30*12 = -7802125.39
    assert.equal(
      blowdown.value.data.result.annualSaving.value.toFixed(2),
      "-7802125.39"
    );
  }

  // =========================================================
  // #7 Air Cooling Load
  // Excel AIR PIPE sheet:
  //   F = airFlow*60*density*cp*(inletTemp-outletTemp)
  //   = 167*60*1.22*0.2402*(40-20) = 58726.0176 Kcal/hr
  //   ChilledWaterFlow = F/(cwOutlet-cwInlet) = 58726.0176/5 = 11745.2 kg/hr
  // =========================================================
  const airCooling = await invoke(calculators.calculateAirCoolingLoad, {
    airFlow: 167,
    airDensity: 1.22,
    specificHeat: 0.2402,
    inletAirTemperature: 40,
    outletAirTemperature: 20,
    chilledWaterInletTemperature: 7,
    chilledWaterOutletTemperature: 12,
  });
  assert.equal(airCooling.statusCode, 200);
  assert.equal(airCooling.value.success, true);
  {
    // Excel: F = 167*60*1.22*0.2402*(40-20) = 58726.0176
    assert.equal(
      airCooling.value.data.result.coolingLoad.value.toFixed(4),
      "58726.0176"
    );
    // Chilled water flow = 58726.0176 / (12-7) = 11745.20352
    assert.equal(
      airCooling.value.data.result.chilledWaterFlowRate.value.toFixed(5),
      "11745.20352"
    );
  }

  // =========================================================
  // #8 Liquid Flow Pipe
  // Excel Sheet1:
  //   Diameter: flow=0.18 m³/hr, v=1.5 → D = SQRT((0.18/3600*4)/(3.14*1.5)) = 6.52 mm
  //   Capacity: D=100mm, v=1 → (3.14*0.1²*1*3600)/4 = 28.26 m³/hr
  // =========================================================
  const liquidDiam = await invoke(calculators.calculateLiquidPipeDiameter, {
    flowRate: 0.18,
    velocity: 1.5,
  });
  assert.equal(liquidDiam.statusCode, 200);
  assert.equal(liquidDiam.value.success, true);
  assert.equal(liquidDiam.value.data.result.pipeDiameterMm.value, 6.52);

  const liquidCap = await invoke(calculators.calculateLiquidPipeCapacity, {
    pipeDiameter: 100,
    velocity: 1,
  });
  assert.equal(liquidCap.statusCode, 200);
  assert.equal(liquidCap.value.success, true);
  assert.equal(liquidCap.value.data.result.flowCapacityPerHour.value, 28.26);

  // =========================================================
  // #11 Tank Dimensions & Weight
  // Excel Sheet10 (circular weight section):
  //   capacity=4.59m³, diameter=1.5m, thickness=0.006m, density=7850, endPlates=2
  //   circumference = 2*3.14*(1.5/2) = 4.71m
  //   shellWeight = circumference * length * thickness * density
  //   endPlateWeight = thickness * numPlates * density (Excel H33=H32*H31*H23, H32=thickness)
  //   Total = 576.79 + 94.20 = 670.99 kg
  // =========================================================
  const tank = await invoke(calculators.calculateTankDimensionsAndWeight, {
    tankType: "circular",
    capacity: 4.59225,      // = 3.14*(1.5/2)^2*2.60 → derives exactly 2.60m length (Excel H16)
    diameter: 1.5,
    thickness: 6,          // mm
    steelDensity: 7850,
    numberOfEndPlates: 2,
  });
  assert.equal(tank.statusCode, 200);
  assert.equal(tank.value.success, true);
  {
    const totalWeight = tank.value.data.result.totalTankWeight.value;
    // Excel total = 670.99 kg (shell=576.79, endPlates=94.20)
    assert.equal(totalWeight.toFixed(2), "670.99");
    assert.equal(
      tank.value.data.calculationSteps.shellWeight.value.toFixed(2),
      "576.79"
    );
    assert.equal(
      tank.value.data.calculationSteps.endPlateWeight.value.toFixed(2),
      "94.20"
    );
  }

  // =========================================================
  // #12 Heating & Cooling System (pipe sizes use 3.14)
  // Excel Sheet11:
  //   hotWaterFlow=25m³/hr, inlet=85, outlet=95, steamPressure=3.5, latent=506.4
  //   steam = (25*1000*1*10)/506.4 = 493.68 kg/hr
  //   steamPipe = SQRT((0.0565*4)/(3.14*25))*1000 = 53.66 mm
  //   hotWaterPipe = SQRT((25/3600*4)/(3.14*1.5))*1000 = 76.80 mm
  // =========================================================
  const heatCool = await invoke(calculators.calculateHeatingCoolingSystem, {
    hotWaterFlowRate: 25,
    hotWaterInletTemp: 85,
    hotWaterOutletTemp: 95,
    steamPressure: 3.5,
    steamVelocity: 25,
    hotWaterVelocity: 1.5,
    coolingWaterFlowRate: 18,
    coolingWaterInletTemp: 35,
    coolingWaterOutletTemp: 30,
    chilledWaterInletTemp: 8,
    chilledWaterOutletTemp: 11,
    coolingWaterVelocity: 1.5,
    chilledWaterVelocity: 2,
  });
  assert.equal(heatCool.statusCode, 200);
  assert.equal(heatCool.value.success, true);
  {
    // Steam required = (25*1000*1*10)/506.4 = 493.68 kg/hr
    assert.equal(
      heatCool.value.data.heatingSystem.steamRequired.value.toFixed(2),
      "493.68"
    );
    // Steam pipe size = 53.66 mm (Excel C23=53.66)
    assert.equal(
      heatCool.value.data.heatingSystem.steamLineSize.value.toFixed(2),
      "53.66"
    );
    // Hot water pipe = 76.80 mm (Excel C29=76.796)
    assert.equal(
      heatCool.value.data.heatingSystem.hotWaterLineSize.value.toFixed(2),
      "76.80"
    );
  }

  // =========================================================
  // #13 Material Weight
  // Excel Sheet "13 Weight Calculator" (pipe section):
  //   OD=2400mm=2.4m, thickness=14mm=0.014m, length=3.4m, density=7850
  //   innerDiameter = 2.4-2*0.014 = 2.372m
  //   area = (3.14*(2.4²-2.372²))/4 = 0.104889 m²
  //   volume = 0.104889 * 3.4 = 0.3566 m³
  //   weight = 0.3566 * 7850 = 2799.48 kg
  // =========================================================
  const pipeWeight = await invoke(calculators.calculateWeight, {
    shape: "pipe",
    outerDiameter: 2400,
    thickness: 14,
    length: 3.4,
    density: 7850,
  });
  assert.equal(pipeWeight.statusCode, 200);
  assert.equal(pipeWeight.value.success, true);
  {
    // Excel: weight = 2799.48 kg
    assert.equal(
      pipeWeight.value.data.result.weight.value.toFixed(2),
      "2799.48"
    );
    // Volume ≈ 0.3566 m³
    assert.ok(
      pipeWeight.value.data.result.volume.value > 0.356 &&
      pipeWeight.value.data.result.volume.value < 0.357,
      "pipe volume ~0.3566"
    );
  }

  // =========================================================
  // #14 Steam Saving in PRS
  // Excel Sheet "16 PRS Steam Saving":
  //   inletP=10bar(g), outletP=6bar(g), flow=2700 kg/hr
  //   latentHeat@10bar(g)=477.35, @6bar(g)=493.39
  //   energyWithoutPRS = 477.35*2700 = 1288845 kcal/hr
  //   steamFlowWithPRS = 1288845/493.39 = 2612.22 kg/hr
  //   steamSaving = 2700-2612.22 = 87.78 kg/hr
  // =========================================================
  const prsSaving = await invoke(calculators.calculatePRSSteamSaving, {
    inletPressure: 10,
    outletPressure: 6,
    flowRate: 2700,
  });
  assert.equal(prsSaving.statusCode, 200);
  assert.equal(prsSaving.value.success, true);
  {
    // inletLatentHeat = 477.35 (steam table at 10 bar(g))
    assert.equal(
      prsSaving.value.data.steamProperties.inletLatentHeat.value,
      477.35
    );
    // outletLatentHeat = 493.39 (steam table at 6 bar(g))
    assert.equal(
      prsSaving.value.data.steamProperties.outletLatentHeat.value,
      493.39
    );
    // steamFlowWithPRS = 1288845/493.39 = 2612.22
    assert.equal(
      prsSaving.value.data.result.steamFlowRequiredWithPRS.value.toFixed(2),
      "2612.22"
    );
    // steamSaving = 87.78
    assert.equal(
      prsSaving.value.data.result.totalSteamSaving.value.toFixed(2),
      "87.78"
    );
  }

  // =========================================================
  // #16 Pipe Wall Thickness P11/P22
  // Excel Sheet "18 PIPE THICKNESS P11 P22":
  //   material=A335 P22, temperature=500°C → allowableStress=80.9 MPa
  //   pressure=90bar=9MPa, D=73mm (2.5" NB), E=1, W=1, Y=0.4
  //   t = (9*73)/(2*(80.9*1*1+0.4*9)) = 657/(2*84.5) = 3.888 mm
  //   mechanicalAllowance=3mm → tm = 6.888mm
  //   actualWallThickness for 2.5" SCH160 = 9.53mm → SAFE
  // =========================================================
  const p22thickness = await invoke(calculators.calculatePipeWallThickness, {
    pipeType: "Seamless",
    materialGrade: "A335 P22",
    designPressure: 90,
    operatingTemperature: 500,
    nominalPipeSize: "2.5",
    pipeSchedule: "SCH 160",
    mechanicalAllowance: 3,
  });
  assert.equal(p22thickness.statusCode, 200);
  assert.equal(p22thickness.value.success, true);
  {
    // allowableStress at 500°C for A335 P22 = 80.9 MPa (Excel Sheet18 col P22)
    assert.equal(
      p22thickness.value.data.materialProperties.allowableStress.value,
      80.9
    );
    // calculatedThickness = 3.888mm (Excel shows 3.888)
    assert.equal(
      p22thickness.value.data.calculationSteps.calculatedWallThickness.value.toFixed(3),
      "3.888"
    );
    // requiredThickness = 6.888mm
    assert.equal(
      p22thickness.value.data.calculationSteps.requiredWallThickness.value.toFixed(3),
      "6.888"
    );
    // actualWallThickness for 2.5" SCH160 = 9.53mm
    assert.equal(
      p22thickness.value.data.pipeProperties.actualWallThickness.value,
      9.53
    );
    // SAFE
    assert.equal(
      p22thickness.value.data.result.safetyStatus.value,
      "SAFE"
    );
  }

  // =========================================================
  // #18 PRDS / De-superheating
  // Excel Sheet3 (main example, waterTemp=105):
  //   inletH = 662.9524759, outletH = 690.4034679, reqH = 658.3961391
  //   availableHeatPerKg = inletH - reqH = 4.5563
  //   availableHeatTotal = 4.5563 * 8000 = 36450.69
  //   heatGainByWater = reqH - waterTemp = 658.396 - 105 = 553.396
  //   waterQty = 36450.69 / 553.396 = 65.87 kg/hr
  //   inletDiam (3.14): SQRT(4*8000*0.1773518/(3.14*3600*9.6)) = 228.69mm
  // =========================================================
  const prdsResult = await invoke(calculators.calculatePRDS, {
    steamFlowRate: 8000,
    inletPressure: 10,
    inletTemperature: 184.123,
    outletPressure: 6,
    requiredOutletTemperature: 165,
    waterTemperature: 105,
    waterPressure: 10,
    outletSuperheatedTemperature: 221,
    inletVelocity: 9.6,
    prsOutletVelocity: 19.23,
    desuperheaterOutletVelocity: 17.15,
    waterInjectionVelocity: 1.5,
  });
  assert.equal(prdsResult.statusCode, 200);
  assert.equal(prdsResult.value.success, true);
  {
    const waterQty = prdsResult.value.data.calculationSteps.requiredWaterQuantity.value;
    // waterQty = availableHeatTotal / (reqH - waterTemp) = (inletH-reqH)*8000 / (reqH-105)
    // inletH = 662.9524759, reqH = 658.3961391 → waterQty ≈ 65.87 kg/hr
    assert.ok(waterQty > 65 && waterQty < 67, `waterQty ${waterQty} expected ~65.87`);
    // Inlet diameter uses 3.14: SQRT(4*8000*spVolInlet/(3.14*3600*9.6)) = 228.69mm
    const inletDiam = prdsResult.value.data.pipeSizing.inletDiameter.value;
    assert.ok(inletDiam > 227 && inletDiam < 230, `inletDiam ${inletDiam} expected ~228.69`);
    assert.ok(Number.isFinite(prdsResult.value.data.pipeSizing.waterInjectionDiameter.value));
    // Available heat per kg = inletH - reqH = 4.556
    assert.equal(
      prdsResult.value.data.calculationSteps.availableHeatPerKg.value.toFixed(4),
      "4.5563"
    );
  }

  console.log("calculator smoke tests passed");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});