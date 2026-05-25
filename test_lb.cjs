const fs = require('fs');
const envText = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envText.match(/VITE_SUPABASE_URL=(.+)/);
const keyMatch = envText.match(/VITE_SUPABASE_ANON_KEY=(.+)/);

if(urlMatch && keyMatch) {
  const url = urlMatch[1].trim() + '/rest/v1/public_leaderboard?select=*&limit=5';
  fetch(url, {
    headers: {
      'apikey': keyMatch[1].trim(),
      'Authorization': 'Bearer ' + keyMatch[1].trim()
    }
  })
  .then(res => {
    console.log('STATUS:', res.status);
    return res.text();
  })
  .then(text => console.log('RESPONSE:', text))
  .catch(err => console.log('FETCH ERR', err));
}
