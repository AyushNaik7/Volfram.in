const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Pressure se steam properties fetch karo
async function getSteamProperties(pressure_bar) {
  const { data, error } = await supabase
    .from('steam_tables')
    .select('*')
    .lte('pressure_bar', pressure_bar)
    .order('pressure_bar', { ascending: false })
    .limit(1);

  if (error || !data.length) return null;
  return data[0];
}

module.exports = { getSteamProperties };