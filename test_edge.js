import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config({ path: '.env.local' });

async function testPush() {
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
  const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY';
  
  if (SUPABASE_URL === 'YOUR_SUPABASE_URL') {
    console.log('Cannot test without Supabase URL in .env.local');
    return;
  }
  
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/send-push-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ANON_KEY}`
      },
      body: JSON.stringify({
        userId: 'test-user',
        title: 'Test',
        body: 'Test',
        url: '/'
      })
    });
    
    const data = await res.json();
    console.log('STATUS:', res.status);
    console.log('RESPONSE:', data);
  } catch (e) {
    console.error('ERROR:', e.message);
  }
}

testPush();
