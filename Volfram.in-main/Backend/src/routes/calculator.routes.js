const express=require("express");
const router =express.Router();
const saturatedSteamTable = require("../data/saturatedSteamTable");


const {
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
  calculateFAboilerCapacity,
  calculatePRDS,
  calculateGeneralPipeWallThickness,
  calculatePipeWallThickness,
} = require("../controllers/calculator.controllers");

router.post( "/saturated-steam-pipe/diameter",calculateSteamPipeDiameter);
router.post("/saturated-steam-pipe/capacity",calculateSteamPipeCapacity);
router.get("/saturated-steam-table", (req, res) => {
  res.json({ success: true, data: saturatedSteamTable });
});
router.post("/safety-valve/orifice",calculateSafetyValveOrifice);
router.post("/condensate-flash-steam-saving",calculateCondensateFlashSteamSaving);
router.post(
  "/boiler-direct-efficiency",
  calculateBoilerDirectEfficiency
);
router.post(
  "/blow-down-saving",
  calculateBlowDownSaving
);

router.post(
  "/steam-requirement-process-heating",
  calculateSteamRequirementForProcessHeating
);
router.post(
  "/air-cooling-load",
  calculateAirCoolingLoad
);
router.post(
  "/liquid-pipe/diameter",
  calculateLiquidPipeDiameter
);

router.post(
  "/liquid-pipe/capacity",
  calculateLiquidPipeCapacity
);
router.post(
  "/steam-required-evaporation",
  calculateSteamRequiredForEvaporation
);
router.post(
  "/feed-water-tank/final-temperature",
  calculateFeedWaterTankTemperature
);
router.post(
  "/tank-dimensions-weight",
  calculateTankDimensionsAndWeight
);
router.post(
  "/heating-cooling-system",
  calculateHeatingCoolingSystem
);
router.post(
  "/weight-calculator",
  calculateWeight
);
router.post(
  "/prs-steam-saving",
  calculatePRSSteamSaving
);
router.post(
  "/superheated-steam-pipe/size",
  calculateSuperheatedSteamPipeSize
);
router.post(
  "/pipe-wall-thickness",
  calculatePipeWallThickness
);
router.post(
  "/fa-boiler-capacity",
  calculateFAboilerCapacity
);
router.post(
  "/prds",
  calculatePRDS
);
router.post(
  "/general-pipe-wall-thickness",
  calculateGeneralPipeWallThickness
);
module.exports=router;
