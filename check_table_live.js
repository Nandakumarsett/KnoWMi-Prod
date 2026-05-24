import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://jwsoutcwgwwfovrdrmjk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3c291dGN3Z3d3Zm92cmRybWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3OTgxOTksImV4cCI6MjA5MjM3NDE5OX0.zlJG1ZJKjE4VtBAFGPMvRWb4hmSTAMjeKEExNFk7C0E'
);

async function check() {
  console.log('Querying qr_scan_events...');
  const { data, error } = await supabase.from('qr_scan_events').select('*').limit(1);
  if (error) {
    console.error('ERROR querying qr_scan_events:', error.message);
  } else {
    console.log('qr_scan_events first row:', data);
  }

  console.log('Querying profile_view_events...');
  const { data: viewsData, error: viewsError } = await supabase.from('profile_view_events').select('*').limit(1);
  if (viewsError) {
    console.error('ERROR querying profile_view_events:', viewsError.message);
  } else {
    console.log('profile_view_events first row:', viewsData);
  }

  console.log('Querying scans...');
  const { data: scansData, error: scansError } = await supabase.from('scans').select('*').limit(1);
  if (scansError) {
    console.error('ERROR querying scans:', scansError.message);
  } else {
    console.log('scans first row:', scansData);
  }

  console.log('Testing anonymous insert into qr_scan_events...');
  const { error: insertError } = await supabase.from('qr_scan_events').insert({
    profile_id: '62f37271-fece-4d19-812c-4d4644039c65', // a valid profile_id from views
    device_type: 'mobile',
    browser: 'Test Browser',
    os: 'Test OS',
    scanner_fp: 'test_fp',
    city: 'Test City'
  });
  if (insertError) {
    console.error('ERROR inserting into qr_scan_events anonymously:', insertError.message);
  } else {
    console.log('SUCCESS: Inserted into qr_scan_events anonymously!');
  }
}

check();
