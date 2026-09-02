require('dotenv').config();
const XLSX = require('xlsx');
const { createClient } = require('@supabase/supabase-js');

// Debug: Check if environment variables are loaded
console.log('Environment check:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✓ Loaded' : '✗ Missing');
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✓ Loaded' : '✗ Missing');
console.log('');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error('❌ Error: Missing environment variables!');
  console.error('Make sure .env file exists in the same directory as seed.js');
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const workbook = XLSX.readFile('../Volfram_Calculator.xlsx');

// STEAM TABLES
async function seedSteamTables() {
  console.log('Seeding steam tables...');
  try {
    const sheet = workbook.Sheets['Sheet4'];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const data = [];

    for (let i = 5; i < rows.length; i++) {
      const row = rows[i];
      const pressure = parseFloat(row[0]);
      if (isNaN(pressure)) continue;
      data.push({
        pressure_bar: pressure,
        temp_c: parseFloat(row[1]) || null,
        sp_volume: parseFloat(row[2]) || null,
        density: parseFloat(row[3]) || null,
        sensible_heat: parseFloat(row[4]) || null,
        latent_heat: parseFloat(row[5]) || null,
        total_heat: parseFloat(row[6]) || null,
      });
    }

    const { data: result, error } = await supabase.from('steam_tables').insert(data);
    if (error) {
      console.error('❌ Error details:', error);
      throw error;
    }
    console.log(`✓ Steam tables: ${data.length} rows inserted`);
  } catch (err) {
    console.error('❌ Steam tables failed:', err.message);
    if (err.code) console.error('Error code:', err.code);
  }
}

// PIPE DATA
async function seedPipeData() {
  console.log('Seeding pipe data...');
  try {
    const sheet = workbook.Sheets['Pipe_Data'];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const data = [];

    for (let i = 2; i < rows.length; i++) {
      const row = rows[i];
      if (!row[1] || isNaN(parseFloat(row[1]))) continue;
      data.push({
        size_nb: parseInt(row[1]),
        schedule: String(row[2] || ''),
        outer_dia_mm: parseFloat(row[3]) || null,
        wall_thickness_mm: parseFloat(row[4]) || null,
        material: 'A106 Gr. B'
      });
      if (row[7] && !isNaN(parseFloat(row[7]))) {
        data.push({
          size_nb: parseInt(row[7]),
          schedule: String(row[8] || ''),
          outer_dia_mm: parseFloat(row[9]) || null,
          wall_thickness_mm: parseFloat(row[10]) || null,
          material: 'SS304/SS316'
        });
      }
    }

    for (let i = 0; i < data.length; i += 500) {
      const { error } = await supabase
        .from('pipe_data')
        .insert(data.slice(i, i + 500));
      if (error) {
        console.error('❌ Error details:', error);
        throw error;
      }
    }
    console.log(`✓ Pipe data: ${data.length} rows inserted`);
  } catch (err) {
    console.error('❌ Pipe data failed:', err.message);
    if (err.code) console.error('Error code:', err.code);
  }
}

// MATERIAL STRESS
async function seedMaterialStress() {
  console.log('Seeding material stress...');
  try {
    const sheet = workbook.Sheets['Material_Stress'];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const data = [];

    for (let i = 3; i < rows.length; i++) {
      const row = rows[i];
      const temp = parseFloat(row[1]);
      if (isNaN(temp)) continue;
      data.push({
        temperature_c: temp,
        a106_grb: parseFloat(row[2]) || null,
        a516_gr70: parseFloat(row[3]) || null,
        ss304: parseFloat(row[6]) || null,
        ss316: parseFloat(row[7]) || null,
      });
    }

    const { data: result, error } = await supabase.from('material_stress').insert(data);
    if (error) {
      console.error('❌ Error details:', error);
      throw error;
    }
    console.log(`✓ Material stress: ${data.length} rows inserted`);
  } catch (err) {
    console.error('❌ Material stress failed:', err.message);
    if (err.code) console.error('Error code:', err.code);
  }
}

async function main() {
  console.log('Starting seed...\n');
  await seedSteamTables();
  await seedPipeData();
  await seedMaterialStress();
  console.log('\n✓ Database ready!');
}

main().catch(console.error);