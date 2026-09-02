const supabase = require('../config/supabase');

// Saturated Steam Table Data (from Excel Sheet4)
const steamTableData = [
  { gauge_pressure: 0, boiling_point: 99.63, specific_volume: 1.694, density: 0.59, sensible_heat: 99.72, latent_heat: 539.3, total_heat: 639.02 },
  { gauge_pressure: 1, boiling_point: 120.2, specific_volume: 0.885, density: 1.13, sensible_heat: 120.77, latent_heat: 525.79, total_heat: 646.57 },
  { gauge_pressure: 2, boiling_point: 133.5, specific_volume: 0.606, density: 1.65, sensible_heat: 134.2, latent_heat: 516.72, total_heat: 651 },
  { gauge_pressure: 3, boiling_point: 143.6, specific_volume: 0.462, density: 2.165, sensible_heat: 144.58, latent_heat: 509.54, total_heat: 654.13 },
  { gauge_pressure: 3.5, boiling_point: 148, specific_volume: 0.412, density: 2.427, sensible_heat: 148.99, latent_heat: 506.4, total_heat: 655.403 },
  { gauge_pressure: 4, boiling_point: 151.8, specific_volume: 0.375, density: 2.667, sensible_heat: 153.03, latent_heat: 503.43, total_heat: 656.52 },
  { gauge_pressure: 5, boiling_point: 158.8, specific_volume: 0.315, density: 3.175, sensible_heat: 160.26, latent_heat: 498.17, total_heat: 658.44 },
  { gauge_pressure: 6, boiling_point: 165, specific_volume: 0.273, density: 3.663, sensible_heat: 166.6, latent_heat: 493.39, total_heat: 660.01 },
  { gauge_pressure: 7, boiling_point: 170.4, specific_volume: 0.24, density: 4.167, sensible_heat: 172.31, latent_heat: 489.02, total_heat: 661.34 },
  { gauge_pressure: 8, boiling_point: 175.4, specific_volume: 0.215, density: 4.651, sensible_heat: 177.49, latent_heat: 484.97, total_heat: 662.46 },
  { gauge_pressure: 10, boiling_point: 184.06, specific_volume: 0.177, density: 5.65, sensible_heat: 186.57, latent_heat: 477.35, total_heat: 663.91 },
  { gauge_pressure: 12, boiling_point: 191.6, specific_volume: 0.151, density: 6.617, sensible_heat: 194.58, latent_heat: 470.7, total_heat: 665.29 },
  { gauge_pressure: 15, boiling_point: 201.37, specific_volume: 0.124, density: 8.085, sensible_heat: 205.06, latent_heat: 461.74, total_heat: 666.79 },
  { gauge_pressure: 20, boiling_point: 214.85, specific_volume: 0.095, density: 10.539, sensible_heat: 219.72, latent_heat: 448.61, total_heat: 668.74 }
];

// Material Specifications (from Excel)
const materialSpecs = [
  {
    material_grade: 'A106 Gr. B',
    material_type: 'Carbon Steel',
    temperature_range: { min: 65, max: 593 },
    allowable_stress: {
      '65': 118, '100': 118, '150': 118, '200': 118, '250': 118, '300': 118,
      '350': 117, '400': 88.9, '450': 62.7, '500': 31.6
    },
    specifications: { type: 'seamless', standard: 'ASME B31.3' }
  },
  {
    material_grade: 'A516 Gr. 70',
    material_type: 'Carbon Steel',
    temperature_range: { min: 65, max: 593 },
    allowable_stress: {
      '65': 138, '100': 138, '150': 138, '200': 138, '250': 138, '300': 136,
      '350': 128, '400': 101, '450': 67.1, '500': 33.6
    },
    specifications: { type: 'plate', standard: 'ASME B31.3' }
  },
  {
    material_grade: 'SS304',
    material_type: 'Stainless Steel',
    temperature_range: { min: 65, max: 650 },
    allowable_stress: {
      '65': 138, '100': 137, '200': 126, '300': 116, '400': 107, '500': 99.3, '600': 80.3
    },
    specifications: { type: 'seamless', standard: 'ASME B31.3' }
  },
  {
    material_grade: 'SS316',
    material_type: 'Stainless Steel',
    temperature_range: { min: 65, max: 650 },
    allowable_stress: {
      '65': 138, '100': 138, '200': 134, '300': 119, '400': 111, '500': 107, '600': 80.3
    },
    specifications: { type: 'seamless', standard: 'ASME B31.3' }
  }
];

// Product Templates
const productTemplates = [
  {
    name: 'Steam Pipe Sizing',
    category: 'steam_pipe',
    description: 'Calculate optimal pipe size for saturated steam flow',
    base_specifications: {
      inputs: ['steam_flow_rate', 'steam_pressure', 'velocity'],
      outputs: ['pipe_diameter', 'pipe_size']
    }
  },
  {
    name: 'PRDS (Pressure Reducing & De-superheating Station)',
    category: 'prds',
    description: 'Complete PRDS system with pressure reduction and temperature control',
    base_specifications: {
      inputs: ['inlet_pressure', 'inlet_temp', 'outlet_pressure', 'outlet_temp', 'flow_rate'],
      outputs: ['inlet_line_size', 'outlet_line_size', 'water_quantity', 'valve_size']
    }
  },
  {
    name: 'Boiler System',
    category: 'boiler',
    description: 'Industrial boiler with efficiency calculations',
    base_specifications: {
      inputs: ['steam_generation', 'pressure', 'fuel_type', 'efficiency'],
      outputs: ['fuel_consumption', 'steam_cost']
    }
  },
  {
    name: 'Condensate Recovery System',
    category: 'condensate',
    description: 'Flash steam and condensate recovery with savings calculation',
    base_specifications: {
      inputs: ['condensate_qty', 'condensate_pressure', 'flash_pressure'],
      outputs: ['flash_steam_qty', 'savings_per_year']
    }
  }
];

// Calculator Templates (from Excel sheets)
const calculatorTemplates = [
  {
    template_name: 'Steam Pipe Size Calculator',
    template_type: 'steam_pipe',
    input_fields: {
      steam_flow_rate: { type: 'number', unit: 'kg/hr', label: 'Steam Flow Rate' },
      steam_pressure: { type: 'number', unit: 'bar (g)', label: 'Steam Pressure' },
      velocity: { type: 'number', unit: 'm/s', label: 'Velocity', default: 25 }
    },
    calculation_logic: {
      formula: 'diameter = sqrt((4 * flow_rate * specific_volume) / (3.14159 * velocity * 3600))',
      steps: [
        'Get specific volume from steam table based on pressure',
        'Convert flow rate to m³/sec',
        'Calculate diameter using formula',
        'Round up to nearest standard pipe size'
      ]
    },
    output_fields: {
      pipe_diameter: { type: 'number', unit: 'mm', label: 'Calculated Pipe Diameter' },
      recommended_size: { type: 'string', unit: 'NB', label: 'Recommended Pipe Size' }
    }
  }
];

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Seed Steam Tables
    console.log('Seeding steam tables...');
    const { error: steamError } = await supabase
      .from('steam_tables')
      .insert(steamTableData);
    
    if (steamError) console.error('Steam table error:', steamError);
    else console.log('✓ Steam tables seeded');

    // Seed Material Specs
    console.log('Seeding material specifications...');
    const { error: materialError } = await supabase
      .from('material_specs')
      .insert(materialSpecs);
    
    if (materialError) console.error('Material specs error:', materialError);
    else console.log('✓ Material specs seeded');

    // Seed Products
    console.log('Seeding products...');
    const { error: productError } = await supabase
      .from('products')
      .insert(productTemplates);
    
    if (productError) console.error('Product error:', productError);
    else console.log('✓ Products seeded');

    // Seed Calculator Templates
    console.log('Seeding calculator templates...');
    const { error: calcError } = await supabase
      .from('calculator_templates')
      .insert(calculatorTemplates);
    
    if (calcError) console.error('Calculator template error:', calcError);
    else console.log('✓ Calculator templates seeded');

    console.log('\n✅ Database seeding completed!');

  } catch (error) {
    console.error('Seeding error:', error);
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
