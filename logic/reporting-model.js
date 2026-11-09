/* V05 revision 2026-11-08. Shared pure calculation model for UI and exports. */
const PLTD_REPORTS = (() => {
  const TZ='Asia/Jakarta', OFFSET='+07:00';
  const blank=v=>v===null||v===undefined||(typeof v==='string'&&!v.trim());
  function number(v){if(blank(v)||!['number','string'].includes(typeof v))return null;const s=String(v).trim().replace(',','.');return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(s)&&Number.isFinite(Number(s))?Number(s):null;}
  const round=x=>Math.round((x+Number.EPSILON)*1e9)/1e9;
  const format=v=>v===null||v===undefined?'—':Number(v).toLocaleString('id-ID',{maximumFractionDigits:3});
  function validDate(v){return typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&!isNaN(Date.parse(v+'T00:00:00Z'))&&new Date(v+'T00:00:00Z').toISOString().slice(0,10)===v;}
  function time(v){const s=String(v??'').replace('.',':');return /^([01]\d|2[0-3]):[0-5]\d$/.test(s)?s:'';}
  function clock(now=new Date()){const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now).map(x=>[x.type,x.value]));return {date:p.year+'-'+p.month+'-'+p.day,time:p.hour+':'+p.minute};}
  const today=()=>clock().date;
  function addDays(d,n){return validDate(d)?new Date(Date.parse(d+'T00:00:00Z')+n*86400000).toISOString().slice(0,10):'';}
  const stamp=(d,t)=>validDate(d)&&time(t)?d+'T'+time(t)+':00'+OFFSET:null;
  const dateLabel=d=>validDate(d)?new Intl.DateTimeFormat('id-ID',{timeZone:TZ,day:'numeric',month:'long',year:'numeric'}).format(new Date(d+'T00:00:00+07:00')):'Tanggal belum terverifikasi';
  const monthEnd=m=>/^\d{4}-(0[1-9]|1[0-2])$/.test(m)?new Date(Date.UTC(Number(m.slice(0,4)),Number(m.slice(5,7)),0)).toISOString().slice(0,10):'';
  const dayKey=r=>[r.unitId,r.machineId,r.date].join('|');
  const slotKey=r=>dayKey(r)+'|'+r.time;
  const rank=r=>Date.parse(r.updatedAt||r.submittedAt||'')||0;
  function newer(a,b){const d=rank(a)-rank(b);return d!==0?d>0:(Number(a.revision)||0)!==(Number(b.revision)||0)?(Number(a.revision)||0)>(Number(b.revision)||0):String(a.id)>=String(b.id);}
  function migrate(records,masters=[]){return (Array.isArray(records)?records:[]).map((r,index)=>{
    const p=r.params||{},rename=v=>typeof v==='string'?v.replace(/\bPERIKANAN\b/gi,'Bawean'):v;
    let unit=rename(r.unit||p.unit||''),machine=rename(r.machine||p.machine||'');
    const m=masters.find(x=>x.id===(r.machineId||p.machineId)&&(!unit||x.unit===unit))||masters.find(x=>x.unit===unit&&x.name===machine);
    unit=unit||m?.unit||'';machine=machine||m?.name||'';
    // Only a verifiable operational timestamp can supply an otherwise absent date.
    const iso=r.recordedAt||p.recordedAt,canReadISO=typeof iso==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/.test(iso)&&!isNaN(Date.parse(iso));
    const op=canReadISO?clock(new Date(iso)):null;
    const d=validDate(r.date)?r.date:validDate(p.date)?p.date:op?.date||'';
    const t=time(r.time??p.time)||op?.time||'',unitId=String(r.unitId??p.unitId??m?.unitId??''),machineId=String(r.machineId??p.machineId??m?.id??'');
    // oil is pressure; dailyOil/oilUsage are not cumulative stands. Never infer them.
    const oilCumulative=r.oilCumulative??p.oilCumulative??'';
    const identityConflict=!!m&&((unitId&&unitId!==String(m.unitId))||(machineId&&machineId!==String(m.id)));
    return {...r,id:r.id||'legacy-'+index,unit,machine,unitId,machineId,date:d,time:t,identityConflict,recordedAt:stamp(d,t),submittedAt:r.submittedAt||null,
      legacyRecordedAt:r.legacyRecordedAt||(r.recordedAt!==stamp(d,t)?r.recordedAt:null),dateStatus:d?'verified':'unverified',schemaVersion:9,
      params:{...p,unit,machine,unitId,machineId,date:d,time:t,oilCumulative}};
  });}
  function snapshot(r){const p=r.params||{};return {...p,...r,params:undefined,machineStatus:r.machineStatus||p.status||'',oilCumulative:r.oilCumulative??p.oilCumulative??'',note:p.note??r.note??'',load:r.load??p.load??'',frequency:r.frequency??p.frequency??''};}
  function latestIds(records){const map=new Map();for(const r of records){const old=map.get(r.id);if(!old||newer(r,old))map.set(r.id,r);}return [...map.values()].filter(r=>!r.deleted&&!r.deletedAt);}
  const verified=r=>!r.identityConflict&&validDate(r.date)&&!!time(r.time)&&!!r.unitId&&!!r.machineId;
  const final=r=>r.status==='Disetujui';
  const temporary=r=>['Menunggu','Pending','Tersinkron','Abnormal'].includes(r.status);
  const eligible=(r,includePending)=>verified(r)&&(final(r)||(includePending&&temporary(r)));
  function slots(records){const map=new Map();for(const r of records){const key=verified(r)?slotKey(r):'unverified|'+r.id,old=map.get(key);if(!old||newer(r,old))map.set(key,r);}return [...map.values()];}
  function defaults(){const d=today();return {preset:'Hari ini',startDate:d,endDate:d,startTime:'00:00',endTime:'23:59',unitId:'',machineId:'',includePending:true,status:'Semua'};}
  function preset(f,value){const d=today();return {...f,preset:value,startDate:value==='7 hari terakhir'?addDays(d,-6):value==='Bulan ini'?d.slice(0,7)+'-01':value==='Hari ini'?d:f.startDate,endDate:value==='Rentang tanggal khusus'?f.endDate:d};}
  function filterError(f){if(!validDate(f.startDate)||!validDate(f.endDate)||!time(f.startTime)||!time(f.endTime))return 'Lengkapi tanggal dan jam filter.';if(f.endDate<f.startDate)return 'Tanggal selesai harus sama atau setelah tanggal mulai.';if(f.endTime<f.startTime)return 'Jam selesai harus sama atau setelah jam mulai. Rentang jam diterapkan pada setiap tanggal.';return '';}
  const scope=(r,f)=>(!f.unitId||r.unitId===f.unitId)&&(!f.machineId||r.machineId===f.machineId);
  const inTime=(r,f)=>!!time(r.time)&&r.time>=f.startTime&&r.time<=f.endTime;
  const interval=(r,f)=>verified(r)&&r.date>=f.startDate&&r.date<=f.endDate&&inTime(r,f);
  function metric(current,previous,key){
    if(!previous)return {value:null,status:'Data tidak tersedia: tidak ada pasangan jam yang sama'};
    const a=number(current[key]),b=number(previous[key]);
    if(a===null||b===null)return {value:null,status:'Data tidak tersedia: pembacaan meter kosong / tidak valid'};
    if(a<0||b<0)return {value:null,status:'Data tidak tersedia: stand meter tidak valid'};
    const value=round(a-b);return {value,status:value<0?'Anomali: selisih negatif / reset meter':'Valid'};
  }
  function aggregate(rows,key){const values=rows.map(r=>r[key]).filter(x=>x!==null&&x!==undefined&&Number.isFinite(x));return {value:values.length?round(values.reduce((a,b)=>a+b,0)):null,count:values.length,total:rows.length,negative:values.some(x=>x<0)};}
  const sort=(a,b)=>a.date.localeCompare(b.date)||a.unit.localeCompare(b.unit)||a.machine.localeCompare(b.machine)||(a.time||'').localeCompare(b.time||'');
  function build(records,f,masters=[]){
    f={...defaults(),...f};const error=filterError(f),all=latestIds(migrate(records,masters)).map(snapshot);
    const statusMatch=r=>f.status==='Semua'||r.status===f.status;
    const details=error?[]:slots(all).filter(r=>scope(r,f)&&interval(r,f)&&statusMatch(r)).sort(sort);
    const validSlots=slots(all.filter(r=>eligible(r,f.includePending))),lookup=new Map(validSlots.map(r=>[slotKey(r),r]));
    const current=error?[]:validSlots.filter(r=>scope(r,f)&&interval(r,f)&&statusMatch(r));
    const groups=new Map();for(const r of details){const key=dayKey(r);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(r);}
    const eligibleGroups=new Map();for(const r of current){const key=dayKey(r);if(!eligibleGroups.has(key))eligibleGroups.set(key,[]);eligibleGroups.get(key).push(r);}
    const rows=[];
    for(const [key,entries]of groups){
      const candidates=(eligibleGroups.get(key)||[]).sort((a,b)=>b.time.localeCompare(a.time));
      const previousDate=addDays(entries[0].date,-1);
      const previousOf=r=>lookup.get([r.unitId,r.machineId,previousDate,r.time].join('|'))||null;
      // One shared HH:mm for all four meters; no fallback per metric and no double sum.
      const paired=candidates.find(r=>previousOf(r)&&inTime(previousOf(r),f));
      const r=paired||candidates[0]||entries.slice().sort((a,b)=>b.time.localeCompare(a.time))[0];
      const previous=paired?previousOf(paired):null;
      const readings=Object.fromEntries(['kwh','fuel','hours','oilCumulative'].map(k=>[k,metric(r,previous,k)]));
      const calculationStatus=[...new Set(Object.values(readings).map(x=>x.status))].join('; ')+(candidates.length?'':' · '+r.status+' tidak dihitung');
      rows.push({...r,sourceTime:r.time,time:paired?r.time:'',previous,previousDate,comparisonAt:previous?.recordedAt||null,readings,
        kwhDelta:readings.kwh.value,fuelDelta:readings.fuel.value,hoursDelta:readings.hours.value,oilDelta:readings.oilCumulative.value,
        temporary:!!paired&&(!final(r)||!final(previous)),calculationStatus,counted:!!paired});
    }
    rows.sort(sort);
    const summary=Object.fromEntries([['kwh','kwhDelta'],['fuel','fuelDelta'],['hours','hoursDelta'],['oil','oilDelta']].map(([k,v])=>[k,aggregate(rows,v)]));
    return {filters:f,error,all,details,rows,summary,unverified:all.filter(r=>!verified(r)).length,excluded:details.filter(r=>!eligible(r,f.includePending)).length,
      incomplete:rows.filter(r=>Object.values(r.readings).some(x=>x.value===null)).length,temporary:rows.some(r=>r.temporary),
      period:f.startDate+' — '+f.endDate+' · '+f.startTime+'–'+f.endTime+' WIB setiap hari',
      units:[...new Set(details.map(r=>r.unit))].sort().map(unit=>({unit,count:details.filter(r=>r.unit===unit).length})),
      trend:[...new Set(details.map(r=>r.date))].sort().map(date=>({date,count:details.filter(r=>r.date===date).length}))};
  }
  function save(form,existing,status,masters,now=new Date()){
    const d=form.date,t=time(form.time),m=masters.find(x=>x.unit===form.unit&&x.name===form.machine);
    if(!validDate(d)||!t)throw Error('Isi tanggal dan jam laporan yang valid.');
    if(!m)throw Error('Pilih unit dan mesin yang terdaftar.');
    if(!blank(form.oilCumulative)&&(number(form.oilCumulative)===null||number(form.oilCumulative)<0))throw Error('Stand Pemakaian Oli Kumulatif harus nol atau lebih.');
    const iso=now.toISOString(),params={...form,date:d,time:t,unitId:m.unitId,machineId:m.id};delete params._editing;
    return {...existing,id:existing?.id||'LS-'+now.getTime()+'-'+Math.random().toString(36).slice(2,7),schemaVersion:9,revision:(existing?.revision||0)+1,
      unit:form.unit,unitId:m.unitId,machine:form.machine,machineId:m.id,date:d,time:t,recordedAt:stamp(d,t),dateStatus:'verified',
      submittedAt:status==='Draft'?existing?.submittedAt||null:iso,updatedAt:iso,status,load:form.load,frequency:form.frequency,operator:form.operator,machineStatus:form.status,params,
      ...Object.fromEntries(['kwh','fuel','hours','oil','temp','voltage','phaseR','phaseS','phaseT','cosPhi','production','fuelUsage'].map(k=>[k,form[k]??''])),
      oilCumulative:form.oilCumulative??'',revisionHistory:existing?[...(existing.revisionHistory||[]),{...existing,revisionHistory:undefined}]:[]};
  }
  function csv(model,fields){
    const cols=['ID Logsheet','Tanggal','Jam WIB','Unit','ID Unit','Mesin','ID internal Mesin','Operator','Status laporan',...fields.map(f=>f.label),'Produksi KWH hitung','BBM hitung (L)','Jam kerja hitung','Pemakaian Oli hitung (L)','Pembanding','Status perhitungan','recordedAt','submittedAt'];
    const byId=new Map(model.rows.filter(r=>r.counted).map(r=>[r.id,r]));
    const values=model.details.map(r=>{const c=byId.get(r.id);return [r.id,r.date,r.time,r.unit,r.unitId,r.machine,r.machineId,r.operator,r.status,...fields.map(f=>r[f.key]??''),c?.kwhDelta,c?.fuelDelta,c?.hoursDelta,c?.oilDelta,c?.comparisonAt,c?(c.temporary?'SEMENTARA · ':'')+c.calculationStatus:'Tidak dipilih sebagai pasangan harian',r.recordedAt,r.submittedAt];});
    const total=Array(cols.length).fill('');total[0]='TOTAL HASIL VALID';['kwh','fuel','hours','oil'].forEach((k,i)=>total[9+fields.length+i]=model.summary[k].value);
    const cell=v=>'"'+(typeof v==='number'?String(v):String(v??'').replace(/^[=+@-]/,"'$&")).replace(/"/g,'""')+'"';
    return '\uFEFF'+[cols,...values,total,['Periode',model.period]].map(row=>row.map(cell).join(',')).join('\r\n');
  }
  return {TZ,blank,number,format,validDate,time,clock,today,addDays,stamp,dateLabel,monthEnd,dayKey,slotKey,migrate,snapshot,latestIds,verified,final,temporary,eligible,slots,defaults,preset,filterError,scope,interval,metric,aggregate,build,save,csv};
})();
if(typeof module!=='undefined')module.exports=PLTD_REPORTS;
