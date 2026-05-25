import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Checking link_click_events table...");
  const { data, error } = await supabase.from('link_click_events').select('*').limit(5);
  if (error) {
    console.error("Error fetching:", error);
  } else {
    console.log("Data:", data);
  }
}

test();
