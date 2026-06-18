const { getSteamProperties } = require('./steamTable');

async function calculatePRDS(params) {
  const {
    flowRate,      // kg/hr
    inletPressure, // bar(g)
    inletTemp,     // °C
    outletPressure,// bar(g)
    outletTemp,    // °C
    velocity = 25  // m/s default
  } = params;

  // Steam properties fetch karo
  const inletProps = await getSteamProperties(inletPressure);
  const outletProps = await getSteamProperties(outletPressure);

  if (!inletProps || !outletProps) {
    return { error: 'Steam properties not found' };
  }

  // Specific volume
  const inletSpVol = inletProps.sp_volume;
  const outletSpVol = outletProps.sp_volume;

  // Flow in m3/hr
  const inletFlow = flowRate * inletSpVol;
  const outletFlow = flowRate * outletSpVol;

  // Flow in m3/sec
  const inletFlowSec = inletFlow / 3600;
  const outletFlowSec = outletFlow / 3600;

  // Pipe diameter (meters)
  const inletDia = Math.sqrt((4 * inletFlowSec) / (Math.PI * velocity));
  const outletDia = Math.sqrt((4 * outletFlowSec) / (Math.PI * velocity));

  // Convert to mm
  const inletDiaMm = inletDia * 1000;
  const outletDiaMm = outletDia * 1000;

  // Recommended pipe size (standard NB sizes)
  const standardSizes = [15,20,25,32,40,50,65,80,100,125,150,
                         200,250,300,350,400,450,500,600];
  
  const recommendedInlet = standardSizes.find(s => s >= inletDiaMm) 
                           || standardSizes[standardSizes.length-1];
  const recommendedOutlet = standardSizes.find(s => s >= outletDiaMm) 
                            || standardSizes[standardSizes.length-1];

  // MOC based on pressure class
  const getMOC = (pressure) => {
    if (pressure <= 20) return {
      flange: 'A105',
      valve: 'A216 WCB',
      pipe: 'A106 Grade B',
      class: 'FL 150'
    };
    if (pressure <= 50) return {
      flange: 'A182 Gr. F11',
      valve: 'ASTM A217 WC6',
      pipe: 'A335 Gr. P11',
      class: 'FL 300'
    };
    return {
      flange: 'A182 Gr. F22',
      valve: 'ASTM A217 WC9',
      pipe: 'A335 Gr. P22',
      class: 'FL 600'
    };
  };

  return {
    product: 'PRDS Station',
    inputs: params,
    results: {
      inlet: {
        lineSize: `${recommendedInlet}NB`,
        calculatedDia: `${inletDiaMm.toFixed(2)}mm`,
        flow: `${inletFlow.toFixed(2)} m³/hr`,
        moc: getMOC(inletPressure)
      },
      outlet: {
        lineSize: `${recommendedOutlet}NB`,
        calculatedDia: `${outletDiaMm.toFixed(2)}mm`,
        flow: `${outletFlow.toFixed(2)} m³/hr`,
        moc: getMOC(outletPressure)
      },
      inletSteamProps: {
        temp: `${inletProps.temp_c}°C`,
        latentHeat: `${inletProps.latent_heat} kcal/kg`,
        spVolume: `${inletProps.sp_volume} m³/kg`
      },
      outletSteamProps: {
        temp: `${outletProps.temp_c}°C`,
        latentHeat: `${outletProps.latent_heat} kcal/kg`,
        spVolume: `${outletProps.sp_volume} m³/kg`
      }
    }
  };
}

module.exports = { calculatePRDS };