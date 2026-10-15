// Optional *real* LLM endpoint. No credential = no paid AI requests.
// Explicitly does not reveal API keys to browsers.
const known='Pilot catalog institutions: HKUST, CityUHK, CUHK, SUSTech, Tsinghua, Peking University, Nazarbayev University, KAIST, NYU Abu Dhabi, HKU, NTU Singapore, UBC. Confirmed international annual 2026/27 tuition: HKUST 215000 HKD (registry.hkust.edu.hk/resource-library/tuition-rates-ug), CityUHK 190000 HKD (cityu.edu.hk/fo/htm/degree_fees.htm), CUHK 214000 HKD (iso.cuhk.edu.hk 2026-27 Calendar). Any other tuition, eligibility cutoff, major availability, accommodation, deadlines, admissions probability and scholarship award details are unverified; tell the student to check the institution website. Do not fabricate sourced data.';
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Method not allowed'})}
  if(!String(req.headers['content-type']||'').startsWith('application/json'))return res.status(415).json({error:'JSON required'});
  const size=Number(req.headers['content-length']||0);if(size>3500)return res.status(413).json({error:'Request too large'});
  const key=process.env.AI_GATEWAY_API_KEY||process.env.VERCEL_OIDC_TOKEN;
  const model=process.env.AI_GATEWAY_MODEL;
  if(!key||!model)return res.status(503).json({error:'AI Gateway is not configured. Local guidance is still available.'});
  let body;try{body=typeof req.body==='string'?JSON.parse(req.body||'{}'):req.body}catch{return res.status(400).json({error:'Invalid JSON'})}
  if(!body||typeof body.question!=='string'||!body.question.trim()||body.question.length>650)return res.status(400).json({error:'Invalid question'});
  const input=body.profile||{};
  const p={gpa:String(input.gpa||'').slice(0,6),ielts:String(input.ielts||'').slice(0,6),sat:String(input.sat||'').slice(0,6),major:String(input.major||'').slice(0,60),countries:Array.isArray(input.countries)?input.countries.slice(0,8).map(c=>String(c).slice(0,35)):[],budget:String(input.budget||'').slice(0,12),scholarship:!!input.scholarship};
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),11000);
  try{
    const r=await fetch('https://ai-gateway.vercel.sh/v1/chat/completions',{method:'POST',headers:{'content-type':'application/json',authorization:`Bearer ${key}`},signal:controller.signal,body:JSON.stringify({model,max_tokens:480,temperature:0.2,messages:[{role:'system',content:`You are UNISearch, a careful college guidance assistant for high school students in Kazakhstan. Recommend options using profile and verified facts only. Do not promise admission, make up acceptance probabilities, fees, test cutoffs or scholarships. University requirements differ for international applicants. Explain uncertainties briefly, and suggest specific next research steps. Never request sensitive personal data. Keep responses concise, approachable and aligned with the student's language. ${known}`},{role:'user',content:`Profile: ${JSON.stringify(p)}\nQuestion: ${body.question}`}]})});
    if(!r.ok)return res.status(502).json({error:'AI Gateway temporarily unavailable'});
    const out=await r.json();const answer=out?.choices?.[0]?.message?.content;
    if(typeof answer!=='string'||!answer.trim())return res.status(502).json({error:'Empty AI response'});
    return res.status(200).json({answer:answer.slice(0,5000)});
  }catch{return res.status(502).json({error:'AI temporarily unavailable'})}finally{clearTimeout(timeout)}
}
