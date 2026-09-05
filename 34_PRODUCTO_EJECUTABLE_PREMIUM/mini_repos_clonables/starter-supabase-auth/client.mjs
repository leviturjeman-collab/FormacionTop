// CLI for a local demonstration. Requires SUPABASE_URL, SUPABASE_ANON_KEY, EMAIL and PASSWORD.
const {SUPABASE_URL:url,SUPABASE_ANON_KEY:key,EMAIL:email,PASSWORD:password}=process.env;
if(!url||!key||!email||!password)throw new Error('Configure SUPABASE_URL, SUPABASE_ANON_KEY, EMAIL, PASSWORD');
const login=await fetch(url+'/auth/v1/token?grant_type=password',{method:'POST',headers:{apikey:key,'content-type':'application/json'},body:JSON.stringify({email,password})});
if(!login.ok)throw new Error('Login failed: '+login.status);
const session=await login.json();
const headers={apikey:key,Authorization:'Bearer '+session.access_token,'content-type':'application/json'};
const profiles=await fetch(url+'/rest/v1/profiles?select=id,display_name',{headers});
if(!profiles.ok)throw new Error('Profiles unavailable: '+profiles.status);
console.log(await profiles.json());
// The access token/password is never printed. RLS, not this query, enforces ownership.
