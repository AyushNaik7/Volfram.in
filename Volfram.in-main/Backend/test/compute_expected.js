// Compute exact expected values from Excel formulas
// so we can write precise test assertions

// ==================== #2 SAFETY VALVE ====================
// Excel: D8 = D5/(D3*(D4+1.013)) = 2600/(0.38*(4.1+1.013)) = 2600/(0.38*5.113) = 2600/1.94294
const safetyArea = 2600 / (0.38 * (4.1 + 1.013));
// D11 = (D9*4/3.14)^0.5
const safetyDiam = Math.sqrt(safetyArea * 4 / 3.14);
console.log('Safety Valve: area=', safetyArea.toFixed(2), 'diam=', safetyDiam.toFixed(2));
// Excel shows 1338.2, 41 mm

// ==================== #3 CONDENSATE & FLASH ====================
// Sheet2: gas, gcv=9600, price=8, efficiency=90%, hours=24, days=250, condensate=1000
// condensatePressure=3.5 (temp=148), flashPressure=1 (temp=120.2, latent=525.79, total=646.57)
const cond_temp = 148, flash_temp = 120.2, latent = 525.79, total = 646.57;
const flashFrac = (cond_temp - flash_temp) / latent; // 27.8/525.79
const flashSteam = flashFrac * 1000;
const flashHeat = total * flashSteam;
const balanceCond = 1000 - flashSteam;
const heatCond = balanceCond * 100; // Excel B28 = B22*100
const fuelSavingFlash = flashHeat / (9600 * 0.90);
const hourlySavingFlash = fuelSavingFlash * 8;
const annualFlash = hourlySavingFlash * 24 * 250;
const fuelSavingCond = heatCond / (9600 * 0.90);
const hourlySavingCond = fuelSavingCond * 8;
const annualCond = hourlySavingCond * 24 * 250;
const totalAnnual = annualFlash + annualCond;
console.log('\nCondensate: flashFrac=', flashFrac.toFixed(5), 'flashSteam=', flashSteam.toFixed(2));
console.log('flashHeat=', flashHeat.toFixed(1), 'balance=', balanceCond.toFixed(2));
console.log('annualFlash=', annualFlash.toFixed(1), 'annualCond=', annualCond.toFixed(1));
console.log('totalAnnual=', totalAnnual.toFixed(1));
// Excel: flashSteam=52.9, flashHeat=34186, balance=947.1, totalAnnual=716103.9

// ==================== #4 BOILER DIRECT EFFICIENCY ====================
// Steam generation=1600, pressure=7bar(g) totalHeat=661.34, gcv=4500, fuelPrice=9.5, fuel=112, fw=65
const boilerTotalHeat = 661.34;
const boilerHeatPerKg = boilerTotalHeat - 65;
const boilerTotalHeatAdded = boilerHeatPerKg * 1600;
const boilerHeatInput = 112 * 4500;
const boilerEfficiency = (boilerTotalHeatAdded / boilerHeatInput) * 100;
const steamCost = (112 * 9.5) / 1600;
console.log('\nBoiler: heatPerKg=', boilerHeatPerKg, 'totalHeatAdded=', boilerTotalHeatAdded);
console.log('efficiency=', boilerEfficiency.toFixed(2), 'steamCost=', steamCost.toFixed(3));
// Excel: steamCost=0.665. Efficiency=78 is HARDCODED, not formula

// ==================== #5 BLOWDOWN ====================
// steamGen=2000, price=8, gcv=5000, eff=70%, fdTDS=500, boilerTDS=1000, dur=10, num=3
// valveFlow=6 kg/s, heatContent=198.28, opDays=30, opMonths=12
// B22 = (2000*500*24)/(1000-500) = 48000
const reqBD = (2000 * 500 * 24) / (1000 - 500);
// B24 = 6*10*3 = 180
const manualBD = 6 * 10 * 3;
// B26 = 180-48000
const excessBD = manualBD - reqBD;
// B28 = (B26*B18*B9)/(B10*B12%) = (excessBD * 198.28 * 8) / (5000 * 0.70)
const dailySaving = (excessBD * 198.28 * 8) / (5000 * 0.70);
const monthlySaving = dailySaving * 30;
const annualSaving = monthlySaving * 12;
console.log('\nBlowdown: reqBD=', reqBD, 'manualBD=', manualBD, 'excess=', excessBD);
console.log('dailySaving=', dailySaving.toFixed(2), 'annual=', annualSaving.toFixed(2));
// Excel: -21672.57, -7802125.38

// ==================== #7 AIR COOLING ====================
// Excel: F = A*60*B*C*(D-E) = 167*60*1.22*0.2402*(40-20)
const coolingLoad = 167 * 60 * 1.22 * 0.2402 * (40-20);
// P = F/(H-G) = F/(12-7)
const chilledWaterFlow = coolingLoad / (12 - 7);
// Chilled pipe: SQRT((P/3600*4)/(3.14*v)) where v=1.5 (from Excel)
// But our API doesn't need this for basic test
console.log('\nAir Cooling: load=', coolingLoad.toFixed(4), 'chilledFlow=', chilledWaterFlow.toFixed(2));

// ==================== #8 LIQUID PIPE ====================
// Excel Sheet1: flow=0.18 m3/hr, v=1.5 → diameter = SQRT((0.18/3600*4)/(3.14*1.5))
const liqFlowPerSec = 0.18 / 3600;
const liqDiam = Math.sqrt((4 * liqFlowPerSec) / (3.14 * 1.5));
const liqDiamMm = liqDiam * 1000;
// Capacity: diameter=100mm, v=1 → (3.14*0.1^2*1)/4*3600
const capFlow = (3.14 * 0.01 * 1) / 4 * 3600;
console.log('\nLiquid Pipe Diam: diam=', liqDiamMm.toFixed(2), 'mm');
console.log('Liquid Pipe Cap: flow=', capFlow.toFixed(2), 'm3/hr');
// Excel: 6.52 mm, 28.26 m3/hr

// ==================== #11 TANK ====================
// Circular: capacity=2m3, diameter=1m, thickness=6mm=0.006m, density=7850, endPlates=2
// Sheet10: H9 = 2/(3.14*(1/2)^2) = 2/(3.14*0.25) = 2/0.785 = 2.5478
const tankCap=2, tankDiam=1, tankThick=0.006, tankDensity=7850;
const tankR = tankDiam/2;
const tankArea = 3.14 * tankR * tankR;
const tankLen = tankCap / tankArea;
// H26 = 2*3.14*(D/2) = 3.14*D = circumference
const circ = 2 * 3.14 * tankR;
// H27 = circ * len * thickness
const shellVol = circ * tankLen * tankThick;
const shellWeight = shellVol * tankDensity;
// H32 = endPlateArea*thickness*2 (2 end plates)
const endPlateArea = 3.14 * tankR * tankR;
const endPlateVol = endPlateArea * tankThick * 2;
const endPlateWeight = endPlateVol * tankDensity;
const totalWeight = shellWeight + endPlateWeight;
console.log('\nTank (circular cap=2,d=1,t=6mm): length=', tankLen.toFixed(4));
console.log('shellWeight=', shellWeight.toFixed(2), 'endPlateWeight=', endPlateWeight.toFixed(2));
console.log('totalWeight=', totalWeight.toFixed(2));
// Excel: length=2.5478, shellWeight=576.79, endPlateWeight=94.2, total=670.99

// ==================== #12 HEATING/COOLING SYSTEM ====================
// Sheet11: hotWaterFlow=25 m3/hr, inlet=85, outlet=95, cp=1, steamPressure=3.5, latentHeat=506.4
// C13 = (25*1000*1*(95-85))/506.4 = 493.68
const hwSteam = (25 * 1000 * 1 * (95-85)) / 506.4;
// C17 = 493.68 * 0.412 = 203.4
const steamFlow_m3hr = hwSteam * 0.412;
// C18 = C17/3600
const steamFlow_m3s = steamFlow_m3hr / 3600;
// C22 = SQRT(C18*4/(3.14*25)) -- steam pipe diam
const steamPipeDiam = Math.sqrt(steamFlow_m3s * 4 / (3.14 * 25)) * 1000;
// C25 = 25/3600, C28 = SQRT(C25*4/(3.14*1.5)) -- hot water pipe diam
const hwFlow_m3s = 25 / 3600;
const hwPipeDiam = Math.sqrt(hwFlow_m3s * 4 / (3.14 * 1.5)) * 1000;
console.log('\nHeating: steam=', hwSteam.toFixed(2), 'steamPipe=', steamPipeDiam.toFixed(2), 'hwPipe=', hwPipeDiam.toFixed(2));
// Excel: steam=493.68, steamPipe=53.66, hwPipe=76.80

// ==================== #13 MATERIAL WEIGHT (Pipe) ====================
// Excel: OD=2400mm=2.4m, t=14mm=0.014m, length=3.4m, density=7850
// Inner = 2.4-2*0.014 = 2.372m
// Area = (3.14*(2.4^2 - 2.372^2))/4
const od=2.4, id=2.4-2*0.014, len=3.4, dens=7850;
const area = (3.14*(od*od - id*id))/4;
const vol = area * len;
const wt = vol * dens;
console.log('\nPipe weight: area=', area.toFixed(6), 'vol=', vol.toFixed(4), 'weight=', wt.toFixed(2));
// Excel: area=0.104889, vol=0.3566, weight=2799.48

// ==================== #14 STEAM SAVING IN PRS ====================
// Sheet16: inletP=10, outletP=6, flow=2700
// latentHeat @10bar(g)=477.35, @6bar(g)=493.39
// energyWithoutPRS = 477.35*2700
// energyWithPRS = 493.39*2700
// steamFlowWithPRS = energyWithoutPRS/493.39
// steamSaving = 2700 - steamFlowWithPRS
const inletLatent=477.35, outletLatent=493.39, steamFlow=2700;
const energyOut = inletLatent * steamFlow;
const steamWithPRS = energyOut / outletLatent;
const saving = steamFlow - steamWithPRS;
console.log('\nPRS Saving: energyOut=', energyOut, 'steamWithPRS=', steamWithPRS.toFixed(2), 'saving=', saving.toFixed(2));
// Excel: 2612.22, 87.78

// ==================== #16 P11/P22 PIPE THICKNESS ====================
// Excel: P=90bar=9MPa, D=73mm, S=80.9 (P22@500°C), E=1, W=1, Y=0.4
// t = (P*D)/(2*(S*E*W + Y*P)) = (9*73)/(2*(80.9*1*1+0.4*9))
const P=9, D=73, S=80.9, E=1, W=1, Y=0.4;
const t = (P*D)/(2*(S*E*W + Y*P));
console.log('\nP22@500: t=', t.toFixed(3));
// Excel: 3.888

// ==================== #18 PRDS ====================
// Excel Sheet3: from formulas
// heatGainByWater = B16-B11 = required.enthalpyKcalKg - waterTemp
// With waterTemp=105: 658.3961391 - 105 = 553.3961391
// availableHeatPerKg = B14-B16 = inlet.enthalpyKcalKg - required.enthalpyKcalKg
// = 662.9524759 - 658.3961391 = 4.5563368
// availableHeatTotal = B21*B6 = 4.5563368*8000 = 36450.694
// waterQty = B22/B23 = 36450.694/553.3961391 = 65.87
const inletH = 662.9524759, reqH = 658.3961391, waterT = 105, flowPRDS = 8000;
const availHeatPerKg = inletH - reqH;
const availHeatTotal = availHeatPerKg * flowPRDS;
const heatGain = reqH - waterT;
const waterQty = availHeatTotal / heatGain;
console.log('\nPRDS: availHeatPerKg=', availHeatPerKg.toFixed(4), 'heatGain=', heatGain.toFixed(4), 'waterQty=', waterQty.toFixed(2));
// Note: Excel Sheet3 row23 value=658.3961391 because waterTemp is BLANK (=0) in that example
// For waterT=105: heatGain=553.396, waterQty=65.87

// Steam pipe sizes (using 3.14):
// inletDiam = SQRT(4*flow*spVol_inlet/(3.14*3600*inletV))
const spVolInlet = 0.1773518019;
const inletV = 9.6;
const inletD = Math.sqrt(4 * flowPRDS * spVolInlet / (3.14 * 3600 * inletV)) * 1000;
console.log('PRDS inletDiam (3.14)=', inletD.toFixed(2), 'mm');
// Excel shows 228.69 mm for the blank-waterTemp example
