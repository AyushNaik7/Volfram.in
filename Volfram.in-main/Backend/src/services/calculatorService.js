const saturatedSteamTable = require('../data/saturatedSteamTable');

class CalculatorService {
  
  // Get steam properties from table based on pressure
  async getSteamProperties(pressure) {
    const exact = saturatedSteamTable.find(row => row.pressure === Number(pressure));
    return exact ? this.normalizeSteamProperties(exact) : null;
  }

  normalizeSteamProperties(row) {
    return {
      gauge_pressure: row.gauge_pressure ?? row.pressure,
      boiling_point: row.boiling_point ?? row.temperature,
      specific_volume: row.specific_volume ?? row.specificVolume,
      density: row.density,
      sensible_heat: row.sensible_heat ?? row.sensibleHeat,
      latent_heat: row.latent_heat ?? row.latentHeat,
      total_heat: row.total_heat ?? row.totalHeat
    };
  }

  // Calculate Steam Pipe Size (from Excel "Steam Pipe Size" sheet)
  async calculateSteamPipeSize(flowRate, pressure, velocity = 25) {
    try {
      // Get steam properties
      const steamProps = await this.getSteamProperties(pressure);
      
      // Flow rate in m³/hr
      const volumetricFlow = flowRate * steamProps.specific_volume;
      
      // Convert to m³/sec
      const flowM3Sec = volumetricFlow / 3600;
      
      // Calculate diameter: D = sqrt((4 * Q) / (π * v))
      const diameter = Math.sqrt((4 * flowM3Sec) / (Math.PI * velocity));
      
      // Convert to mm
      const diameterMm = diameter * 1000;
      
      // Find nearest standard pipe size
      const standardSize = this.getNearestPipeSize(diameterMm);
      
      return {
        calculatedDiameter: diameterMm.toFixed(2),
        recommendedSize: standardSize,
        volumetricFlow: volumetricFlow.toFixed(2),
        velocity: velocity,
        steamProperties: steamProps
      };
    } catch (error) {
      throw new Error(`Pipe size calculation error: ${error.message}`);
    }
  }

  // Get nearest standard pipe size
  getNearestPipeSize(diameter) {
    const standardSizes = [
      { nb: 6, od: 10.3 },
      { nb: 8, od: 13.7 },
      { nb: 10, od: 17.1 },
      { nb: 15, od: 21.3 },
      { nb: 20, od: 26.7 },
      { nb: 25, od: 33.4 },
      { nb: 32, od: 42.2 },
      { nb: 40, od: 48.3 },
      { nb: 50, od: 60.3 },
      { nb: 65, od: 73 },
      { nb: 80, od: 88.9 },
      { nb: 100, od: 114.3 },
      { nb: 125, od: 141.3 },
      { nb: 150, od: 168.3 },
      { nb: 200, od: 219.1 },
      { nb: 250, od: 273 },
      { nb: 300, od: 323.8 }
    ];

    // Find the smallest size that's larger than calculated diameter
    for (let size of standardSizes) {
      if (size.od >= diameter) {
        return `${size.nb} NB (${size.od} mm OD)`;
      }
    }

    return standardSizes[standardSizes.length - 1].nb + ' NB';
  }

  // Calculate Boiler Efficiency (from Excel "Sheet5")
  async calculateBoilerEfficiency(steamGeneration, pressure, fuelType, gcv, fuelConsumption, feedWaterTemp) {
    try {
      const steamProps = await this.getSteamProperties(pressure);
      
      // Total heat of steam
      const totalHeatSteam = steamProps.total_heat;
      
      // Heat input
      const heatInput = fuelConsumption * gcv;
      
      // Heat output
      const heatOutput = steamGeneration * (totalHeatSteam - feedWaterTemp);
      
      // Efficiency
      const efficiency = (heatOutput / heatInput) * 100;
      
      // Steam cost
      const steamCost = (fuelConsumption * this.getFuelPrice(fuelType)) / steamGeneration;
      
      return {
        efficiency: efficiency.toFixed(2),
        steamCost: steamCost.toFixed(3),
        heatOutput: heatOutput.toFixed(2),
        heatInput: heatInput.toFixed(2),
        totalHeatSteam: totalHeatSteam
      };
    } catch (error) {
      throw new Error(`Boiler efficiency calculation error: ${error.message}`);
    }
  }

  // Get fuel price (simplified - should come from database)
  getFuelPrice(fuelType) {
    const prices = {
      'Coal': 8,
      'Gas': 8,
      'Wood': 5,
      'Diesel': 80,
      'FO': 50
    };
    return prices[fuelType] || 8;
  }

  // Calculate Steam Required for Process Heating (from Excel "Sheet7")
  async calculateSteamForHeating(mediaFlowRate, initialTemp, finalTemp, specificHeat, steamPressure) {
    try {
      const steamProps = await this.getSteamProperties(steamPressure);
      
      // Heat required
      const heatRequired = mediaFlowRate * specificHeat * (finalTemp - initialTemp);
      
      // Steam required
      const steamRequired = heatRequired / steamProps.latent_heat;
      
      return {
        steamRequired: steamRequired.toFixed(2),
        heatRequired: heatRequired.toFixed(2),
        latentHeat: steamProps.latent_heat
      };
    } catch (error) {
      throw new Error(`Steam heating calculation error: ${error.message}`);
    }
  }

  // Calculate Condensate Recovery Savings (from Excel "Sheet2")
  async calculateCondensateSavings(condensateQty, condensatePressure, flashPressure, fuelType, gcv, fuelPrice, boilerEfficiency, operatingHours, operatingDays) {
    try {
      const condensateProps = await this.getSteamProperties(condensatePressure);
      const flashProps = await this.getSteamProperties(flashPressure);
      
      // Temperature difference
      const tempDiff = condensateProps.boiling_point - flashProps.boiling_point;
      
      // Flash steam percentage
      const flashPercentage = (tempDiff / flashProps.latent_heat) * 100;
      
      // Flash steam quantity
      const flashSteam = (condensateQty * flashPercentage) / 100;
      
      // Heat recovered in flash steam
      const flashHeatRecovered = flashSteam * flashProps.latent_heat;
      
      // Equivalent fuel saving
      const fuelSavingFlash = flashHeatRecovered / (gcv * (boilerEfficiency / 100));
      
      // Savings per hour
      const savingsPerHour = fuelSavingFlash * fuelPrice;
      
      // Annual savings
      const annualSavings = savingsPerHour * operatingHours * operatingDays;
      
      // Balance condensate
      const balanceCondensate = condensateQty - flashSteam;
      
      // Total heat in condensate
      const condensateHeat = balanceCondensate * condensateProps.sensible_heat;
      
      // Fuel saving from condensate
      const fuelSavingCondensate = condensateHeat / (gcv * (boilerEfficiency / 100));
      
      // Condensate savings
      const condensateSavingsPerHour = fuelSavingCondensate * fuelPrice;
      const condensateAnnualSavings = condensateSavingsPerHour * operatingHours * operatingDays;
      
      // Total savings
      const totalAnnualSavings = annualSavings + condensateAnnualSavings;
      
      return {
        flashSteamPercentage: flashPercentage.toFixed(2),
        flashSteamQty: flashSteam.toFixed(2),
        balanceCondensate: balanceCondensate.toFixed(2),
        flashSavingsPerYear: annualSavings.toFixed(2),
        condensateSavingsPerYear: condensateAnnualSavings.toFixed(2),
        totalSavingsPerYear: totalAnnualSavings.toFixed(2)
      };
    } catch (error) {
      throw new Error(`Condensate savings calculation error: ${error.message}`);
    }
  }
}

module.exports = new CalculatorService();
