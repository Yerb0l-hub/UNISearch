import {SUPABASE_URL, SUPABASE_ANON_KEY} from './auth-config.js';
import {createClient} from '@supabase/supabase-js';
let client=null;let currentUser=null;
const listeners=new Set();
export const authReady=()=>Boolean(SUPABASE_URL&&SUPABASE_ANON_KEY);
export const user=()=>currentUser;
const emit=()=>listeners.forEach(fn=>fn(currentUser));
export const onAuth=fn=>{listeners.add(fn);return ()=>listeners.delete(fn)};
export async function initializeAuth(){
 if(!authReady())return;
 try{
  client=createClient(SUPABASE_URL,SUPABASE_ANON_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  const {data}=await client.auth.getUser();currentUser=data?.user||null;emit();
  client.auth.onAuthStateChange((_event,session)=>{currentUser=session?.user||null;emit()});
 }catch(e){console.error('Supabase initialization failed:',e);throw e}
}
export async function googleLogin(){
 if(!client)throw Error('Google login requires Supabase configuration');
 const {error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin+'/#profile'}});
 if(error)throw error;
}
export async function emailRegister(email,password){
 if(!client)throw Error('Account registration requires Supabase configuration');
 const {error}=await client.auth.signUp({email,password,options:{emailRedirectTo:location.origin+'/#profile'}});
 if(error)throw error;
}
export async function emailLogin(email,password){
 if(!client)throw Error('Login requires Supabase configuration');
 const {error}=await client.auth.signInWithPassword({email,password});if(error)throw error;
}
export async function logout(){if(!client)return;const {error}=await client.auth.signOut();if(error)throw error;}
export async function readProfile(){
 if(!client||!currentUser)return null;
 const {data,error}=await client.from('student_profiles').select('profile,saved').eq('user_id',currentUser.id).maybeSingle();
 if(error)throw error;return data;
}
export async function writeProfile(profile,saved){
 if(!client||!currentUser)return false;
 const {error}=await client.from('student_profiles').upsert({user_id:currentUser.id,profile,saved,updated_at:new Date().toISOString()},{onConflict:'user_id'});
 if(error)throw error;return true;
}
