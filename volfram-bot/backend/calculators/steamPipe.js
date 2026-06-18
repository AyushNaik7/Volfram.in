const { getSteamProperties } = require('./steamTable');

async function calculateSteamPipe(params) {
  const {
    flowRate,    // kg/hr
    pressure,   // bar(g)
    velocity = 25 // m/s
  } = params;

  const props = await getSteamProperties(pressure);
  if (!props) return { error: 'Steam properties not found' };

  const flowM3hr = flowRate * props.sp_volume;
  const flowM3sec = flowM3hr / 3600;
  const diaMeter = Math.sqrt((4 * flowM3sec) / (Math.PI * velocity));
  const diaMm = diaMeter * 1000;

  const standardSizes = [15,20,25,32,40,50,65,80,100,125,
                         150,200,250,300,350,400,450,500,600];
  const recommended = standardSizes.find(s => s >= diaMm) 
                      || standardSizes[standardSizes.length-1];

  return {
    product: 'Steam Pipe Sizing',
    inputs: params,
    results: {
      calculatedDiameter: `${diaMm.toFixed(2)}mm`,
      recommendedSize: `${recommended}NB`,
      steamFlow: `${flowM3hr.toFixed(2)} m³/hr`,
      steamProperties: {
        temperature: `${props.temp_c}°C`,
        specificVolume: `${props.sp_volume} m³/kg`,
        latentHeat: `${props.latent_heat} kcal/kg`
      }
    }
  };
}

module.exports = { calculateSteamPipe };