import {loadEnv} from 'vite'
const env=loadEnv('production',process.cwd(),'')
const required=['VITE_SUPABASE_URL','VITE_SUPABASE_ANON_KEY']
const missing=required.filter(key=>!env[key]?.trim())
if(missing.length)throw new Error('Production access is not configured. Set '+missing.join(', ')+' in this Vercel project before building.')
const url=new URL(env.VITE_SUPABASE_URL)
if(url.protocol!=='https:')throw new Error('Production access requires an HTTPS Supabase URL.')
console.log('PASS production access configuration: URL and public client key are present; values omitted.')
