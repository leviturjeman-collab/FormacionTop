import assert from 'node:assert/strict'
import {loadEnv} from 'vite'
const env=loadEnv('production',process.cwd(),'')
const call=async(name,args)=>{
 const r=await fetch(env.VITE_SUPABASE_URL+'/rest/v1/rpc/'+name,{method:'POST',headers:{apikey:env.VITE_SUPABASE_ANON_KEY,'Content-Type':'application/json'},body:JSON.stringify(args),signal:AbortSignal.timeout(20000)})
 if(!r.ok)throw new Error(name+': HTTP '+r.status)
 const body=await r.text();return body?JSON.parse(body):null
}
let session
try{
 // Owner requirement: teacher/administrator entry must remain this fixed code.
 session=await call('academy_sign_in_code',{access_code:'5555'})
 assert.equal(session.ok,true,'Owner access code must remain valid')
 assert.equal(session.profile?.role,'admin','Owner code grants the teacher/administrator account')
 const verified=await call('academy_session',{session_token:session.token})
 assert.equal(verified.profile?.role,'admin')
 console.log('PASS owner access: fixed code authenticates the server-verified teacher/administrator account.')
} finally {if(session?.token)await call('academy_sign_out',{session_token:session.token})}
