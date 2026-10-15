import {universities} from './universities.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const demo={qualification:'National Diploma',gpa:'5.0',ielts:'7.0',listening:'8.0',reading:'7.0',writing:'6.0',speaking:'6.0',sat:'1500',satMath:'720',satEnglish:'780',major:'Computer Science',achievements:'National history olympiad medals; school parliament leadership; teaching and volunteering experience.',countries:['China','Hong Kong'],budget:'',scholarship:true};
const labels=['Education','Exams','Major','Achievements','Preferences'];
const numeric=(v,min,max,step)=>{if(v==='')return true;const n=Number(String(v).replace(',','.'));return Number.isFinite(n)&&n>=min&&n<=max&&Math.abs(n/step-Math.round(n/step))<0.00001};
export function initialPathway(existing){
 const p=existing?.pathway;
 return p&&typeof p==='object'?{...demo,...p,countries:Array.isArray(p.countries)?p.countries:demo.countries}:{...demo};
}
export function validatePathway(p,step){
 if(step===0&&!numeric(p.gpa,0,5,0.01))return 'GPA must be between 0 and 5';
 if(step===1){
  for(const k of ['ielts','listening','reading','writing','speaking'])if(!numeric(p[k],0,9,.5))return 'IELTS scores must be between 0 and 9 in 0.5 increments';
  for(const k of ['sat','satMath','satEnglish'])if(!numeric(p[k],k==='sat'?400:200,k==='sat'?1600:800,10))return 'SAT scores are outside the allowed range';
  if(p.sat&&p.satMath&&p.satEnglish&&Number(p.sat)!==Number(p.satMath)+Number(p.satEnglish))return 'SAT total must equal Math + Reading/Writing';
 }
 if(step===2&&!String(p.major||'').trim())return 'Choose your intended major';
 return '';
}
const field=(label,name,value,extra='')=>'<label class="path-field">'+esc(label)+'<input data-path-field="'+name+'" value="'+esc(value)+'" '+extra+'></label>';
const option=(text,value,selected)=>'<option value="'+esc(value)+'" '+(selected===value?'selected':'')+'>'+esc(text)+'</option>';
export function pathwayView(p,step=0){
 const s=Math.max(0,Math.min(4,step));
 let content='';
 if(s===0)content='<h2>Your education</h2><p>Choose your qualification and GPA. These are editable sample values.</p><label class="path-field">Qualification<select data-path-field="qualification">'+['National Diploma','IB','A-Levels','AP','Other'].map(x=>option(x,x,p.qualification)).join('')+'</select></label>'+field('GPA on a five-point scale','gpa',p.gpa,'inputmode="decimal"');
 if(s===1)content='<h2>Exams & scores</h2><p>Use actual results when available. Sample SAT total: 1500.</p><div class="path-grid">'+[['IELTS overall','ielts'],['Listening','listening'],['Reading','reading'],['Writing','writing'],['Speaking','speaking'],['SAT total','sat'],['SAT Math','satMath'],['SAT Reading & Writing','satEnglish']].map(([label,k])=>field(label,k,p[k],'inputmode="decimal"')).join('')+'</div>';
 if(s===2)content='<h2>Choose your major</h2><p>Choose your intended field of study.</p><label class="path-field">Major<select data-path-field="major">'+['Computer Science','Software Engineering','Data Science','Engineering','Business','Mathematics','Architecture','Medicine','Media','Social Sciences'].map(x=>option(x,x,p.major)).join('')+'</select></label>';
 if(s===3)content='<h2>Achievements & activities</h2><p>Summarize academic awards, leadership, projects and service. Do not include your phone number, email or home address.</p><label class="path-field">Activities summary<textarea data-path-field="achievements" rows="7" maxlength="2500">'+esc(p.achievements)+'</textarea></label>';
 if(s===4)content='<h2>Your preferences</h2><p>Choose countries and funding priorities.</p><div class="path-countries">'+['China','Hong Kong','Singapore','South Korea','Kazakhstan','USA','Canada','United Kingdom','Germany'].map(c=>'<label><input type="checkbox" data-path-country="'+esc(c)+'" '+(p.countries.includes(c)?'checked':'')+'> '+esc(c)+'</label>').join('')+'</div>'+field('Annual tuition budget (USD, optional)','budget',p.budget,'inputmode="numeric"')+'<label class="path-check"><input type="checkbox" data-path-field="scholarship" '+(p.scholarship?'checked':'')+'> I need scholarship options</label>';
 return '<div class="pathway"><div class="path-steps">'+labels.map((x,i)=>'<span class="'+(i===s?'current':i<s?'done':'')+'">'+(i+1)+'. '+x+'</span>').join('')+'</div><div class="path-panel"><div class="path-progress">Step '+(s+1)+' of 5</div>'+content+'<div class="path-actions"><button type="button" data-path-back '+(s===0?'disabled':'')+'>Back</button><button type="button" data-path-next>'+ (s===4?'Show university matches →':'Continue →') +'</button></div><p class="path-caption">This is a planning tool, not an admissions decision. Sample values are not verified student data.</p></div></div>';
}
export function getPathwayMatches(p){
 return universities.map(u=>{
  const reasons=[], cautions=[];let rank=0;
  const majorOk=u.majors.includes(p.major);
  if(majorOk){rank+=3;reasons.push('Major listed in catalog')}else cautions.push('Verify availability of this major');
  if(p.countries?.includes(u.country)){rank+=2;reasons.push('Preferred country')}else cautions.push('Outside selected countries');
  if(p.scholarship&&/scholarship|grant|aid/i.test(u.scholarships||'')){rank+=1;reasons.push('Scholarship information to explore')}
  const usd=u.tuition?.currency==='USD'?u.tuition.amount:u.tuition?.currency==='HKD'?u.tuition.amount/7.8:null;
  if(p.budget&&usd!==null){if(usd<=Number(p.budget)){rank+=1;reasons.push('Published tuition within approximate budget')}else cautions.push('Published tuition may exceed budget')}else if(p.budget)cautions.push('Tuition not verified or not comparable');
  cautions.push('Official admissions eligibility has not been verified');
  return {university:u,rank,reasons,cautions};
 }).sort((a,b)=>b.rank-a.rank||a.university.name.localeCompare(b.university.name));
}
export function matchesView(p){
 const results=getPathwayMatches(p).slice(0,16);
 return '<div class="pathway"><div class="path-panel"><h2>Your university pathway</h2><p>Ranked by selected major and country, with limited tuition and funding data. These rankings <strong>do not predict admission</strong>; GPA/IELTS/SAT thresholds and scholarship eligibility require official programme-level sources.</p><button type="button" data-path-edit>Edit answers</button><div class="path-results">'+results.map(({university:u,reasons,cautions})=>'<article class="path-result"><h3>'+esc(u.name)+'</h3><p>'+esc(u.country)+' · '+esc(u.majors.join(', '))+'</p><p><strong>Tuition:</strong> '+(u.tuition?esc(u.tuition.currency+' '+u.tuition.amount.toLocaleString('en-US')+' / year ('+u.tuition.year+')'):'Not verified')+'</p><p><strong>Matching reasons:</strong> '+esc(reasons.join('; ')||'General exploration')+'</p><p><strong>Check:</strong> '+esc(cautions.join('; '))+'</p><a target="_blank" rel="noopener noreferrer" href="'+esc(u.website)+'">Official university website ↗</a>'+(u.tuition?'<a target="_blank" rel="noopener noreferrer" href="'+esc(u.tuition.url)+'">Tuition source ↗</a>':'')+'</article>').join('')+'</div></div></div>';
}
