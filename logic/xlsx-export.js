/* Offline XLSX: populate the artifact-tool-authored OOXML template, ZIP/store. */
const PLTD_XLSX = (() => {
  const names=['Laporan Harian'];
  const esc=v=>String(v??'').replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g,'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
  const col=n=>{let s='';for(n++;n;n=Math.floor((n-1)/26))s=String.fromCharCode(65+(n-1)%26)+s;return s;};
  const num=v=>PLTD_REPORTS.number(v), date=v=>PLTD_REPORTS.validDate(v)?(Date.parse(v+'T00:00:00Z')-Date.UTC(1899,11,30))/86400000:null;
  const tm=v=>PLTD_REPORTS.time(v)?(Number(v.slice(0,2))*60+Number(v.slice(3,5)))/1440:null;
  const f=(formula,value)=>({formula,value});
  function cell(v,r,c,style){let value=v&&typeof v==='object'&&'formula'in v?v.value:v,formula=v&&typeof v==='object'?v.formula:null,tag='<x:c r="'+col(c)+r+'" s="'+style+'"';
    if(formula)return tag+(typeof value==='number'?'':' t="str"')+'><x:f>'+esc(formula.replace(/^=/,''))+'</x:f><x:v>'+esc(value)+'</x:v></x:c>';
    if(value===null||value===undefined)return tag+'/>';
    return typeof value==='number'?tag+' t="n"><x:v>'+value+'</x:v></x:c>':tag+' t="inlineStr"><x:is><x:t xml:space="preserve">'+esc(value)+'</x:t></x:is></x:c>';
  }
  function sheets(model){
    const headers=['Tanggal','Jam WIB','Unit','Mesin','Stand kWh','Stand BBM (L)','Jam Kerja Mesin','Stand Oli Kumulatif (L)','Produksi KWH','Pemakaian BBM (L)','Jam Kerja Hari Ini','Pemakaian Oli (L)','Status perhitungan','Tanggal pembanding','Jam pembanding','Stand kWh kemarin','Stand BBM kemarin (L)','Jam kerja kemarin','Stand oli kemarin (L)'];
    const data=model.rows.map((r,i)=>{const n=i+7;
      const delta=(key,current,previous)=>r[key]===null?null:f('IF(COUNT('+current+n+','+previous+n+')=2,'+current+n+'-'+previous+n+',"")',r[key]);
      return [date(r.date),tm(r.time),r.unit,r.machine,num(r.kwh),num(r.fuel),num(r.hours),num(r.oilCumulative),delta('kwhDelta','E','P'),delta('fuelDelta','F','Q'),delta('hoursDelta','G','R'),delta('oilDelta','H','S'),(r.temporary?'SEMENTARA · ':'')+r.calculationStatus,r.previous?date(r.previousDate):null,tm(r.previous?.time),num(r.previous?.kwh),num(r.previous?.fuel),num(r.previous?.hours),num(r.previous?.oilCumulative)];
    });
    const last=data.length+6,totalRow=last+1,total=Array(headers.length).fill(null);total[0]='TOTAL HASIL VALID';
    ['kwh','fuel','hours','oil'].forEach((key,i)=>{const c=col(i+8),range=c+'7:'+c+last;total[i+8]=model.summary[key].count?f('IF(COUNT('+range+')=0,"",SUM('+range+'))',model.summary[key].value):null;});
    total[12]=model.incomplete?model.incomplete+' hasil harian belum lengkap':'Total seluruh hasil valid';data.push(total);
    return [{name:'Laporan Harian',headers,data,widths:[17,12,24,34,18,18,18,20,18,19,19,19,44,19,16,20,21,20,21],numeric:[4,5,6,7,8,9,10,11,15,16,17,18],dates:[0,13],times:[1,14],subtotalRows:[totalRow],filterEnd:Math.max(6,last),meta:'Unit: '+(model.details.find(r=>r.unitId===model.filters.unitId)?.unit||model.filters.unitId||'Semua unit')+' · Mesin: '+(model.details.find(r=>r.machineId===model.filters.machineId)?.machine||model.filters.machineId||'Semua mesin')+' · '+(model.temporary?'SEMENTARA':'Hasil tervalidasi')}];
  }
  function fillSheet(spec,index,model){const styles=PLTD_XLSX_TEMPLATE.styles,parts=[];
    const row=(r,values,stylesFor,height=25)=>'<x:row r="'+r+'" ht="'+height+'" customHeight="1">'+values.map((v,i)=>cell(v,r,i,typeof stylesFor==='function'?stylesFor(v,i):stylesFor)).join('')+'</x:row>';
    parts.push(row(1,[],styles.text,8),row(2,[spec.name],styles.title,26),row(3,[model.period],styles.meta,22),row(4,[spec.meta],styles.meta,22),row(5,[(model.all.some(r=>r.testFixture)?'DATA UJI · ':'')+'Selisih pada jam terakhir yang sama dalam rentang. Kosong = Data tidak tersedia.'],styles.meta,22),row(6,spec.headers,styles.header,36));
    spec.data.forEach((values,i)=>{const lines=Math.max(1,...values.map((v,c)=>typeof v==='string'?Math.ceil(v.length/Math.max(10,spec.widths[c]-3)):1));parts.push(row(i+7,values,(v,c)=>{const raw=v&&typeof v==='object'?v.value:v;if(spec.integers?.includes(c)&&typeof raw==='number')return styles.integer;if(spec.subtotalRows?.includes(i+7))return typeof raw==='number'?styles.totalNumber:styles.totalText;if(typeof raw==='number'&&raw<0)return styles.warningNumber;if(spec.dates.includes(c)&&typeof raw==='number')return styles.date;if(spec.times.includes(c)&&typeof raw==='number')return styles.time;if(spec.numeric.includes(c)&&typeof raw==='number')return styles.number;return styles.text;},Math.min(409,Math.max(24,lines*17+5))));});
    const last=Math.max(7,6+spec.data.length),endCol=col(spec.headers.length-1),filterEnd=spec.filterEnd??last;
    // Layout/styles originate in artifact-tool; population does not fetch a CDN.
    let xml=PLTD_XLSX_TEMPLATE.parts['xl/worksheets/sheet'+(index+1)+'.xml'];
    xml=xml.replace(/<x:sheetData>[\s\S]*?<\/x:sheetData>/,'<x:sheetData>'+parts.join('')+'</x:sheetData>');
    xml=xml.replace(/<x:cols>[\s\S]*?<\/x:cols>/,'<x:cols>'+spec.widths.map((w,i)=>'<x:col min="'+(i+1)+'" max="'+(i+1)+'" width="'+w+'" customWidth="1"/>').join('')+'</x:cols>');
    xml=xml.replace(/<x:pageMargins[^>]*\/>/,'<x:autoFilter ref="A6:'+endCol+filterEnd+'"/><x:pageMargins left="0.25" right="0.25" top="0.4" bottom="0.4" header="0.2" footer="0.2"/><x:pageSetup paperSize="8" orientation="landscape" fitToWidth="'+2+'" fitToHeight="0"/>');
    xml=xml.replace('</x:sheetPr>','<x:pageSetUpPr fitToPage="1"/></x:sheetPr>');
    return {xml,print:"'"+spec.name+"'!$A$1:$"+endCol+'$'+last};
  }
  const enc=new TextEncoder();
  function zip(parts){const table=Uint32Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});const crc=bytes=>{let n=0xffffffff;for(const b of bytes)n=table[(n^b)&255]^(n>>>8);return(n^0xffffffff)>>>0;};
    const chunks=[],central=[];let offset=0;const header=(length)=>{const bytes=new Uint8Array(length);return {bytes,view:new DataView(bytes.buffer)};};
    for(const [path,text]of Object.entries(parts)){const name=enc.encode(path),data=enc.encode(text),checksum=crc(data),local=header(30+name.length),v=local.view;
      v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint16(6,0x800,true);v.setUint16(12,0x5d64,true);v.setUint32(14,checksum,true);v.setUint32(18,data.length,true);v.setUint32(22,data.length,true);v.setUint16(26,name.length,true);local.bytes.set(name,30);chunks.push(local.bytes,data);
      const c=header(46+name.length),w=c.view;w.setUint32(0,0x02014b50,true);w.setUint16(4,20,true);w.setUint16(6,20,true);w.setUint16(8,0x800,true);w.setUint16(14,0x5d64,true);w.setUint32(16,checksum,true);w.setUint32(20,data.length,true);w.setUint32(24,data.length,true);w.setUint16(28,name.length,true);w.setUint32(42,offset,true);c.bytes.set(name,46);central.push(c.bytes);offset+=local.bytes.length+data.length;
    }
    const size=central.reduce((a,b)=>a+b.length,0),end=header(22);end.view.setUint32(0,0x06054b50,true);end.view.setUint16(8,central.length,true);end.view.setUint16(10,central.length,true);end.view.setUint32(12,size,true);end.view.setUint32(16,offset,true);const out=new Uint8Array(offset+size+22);let at=0;for(const b of [...chunks,...central,end.bytes]){out.set(b,at);at+=b.length;}return out;
  }
  function workbook(model,fields){if(model.error)throw Error(model.error);const parts={...PLTD_XLSX_TEMPLATE.parts},specs=sheets(model,fields),prints=[];
    specs.forEach((spec,i)=>{const s=fillSheet(spec,i,model);parts['xl/worksheets/sheet'+(i+1)+'.xml']=s.xml;prints.push('<x:definedName name="_xlnm.Print_Area" localSheetId="'+i+'">'+esc(s.print)+'</x:definedName><x:definedName name="_xlnm.Print_Titles" localSheetId="'+i+'">'+esc("'"+spec.name+"'!$1:$6")+'</x:definedName>');});
    parts['xl/workbook.xml']=parts['xl/workbook.xml'].replace('</x:workbook>','<x:definedNames>'+prints.join('')+'</x:definedNames><x:calcPr calcId="191029" fullCalcOnLoad="1"/></x:workbook>');return zip(parts);
  }
  const filename=m=>'PLTD_Logsheet_'+m.filters.startDate+(m.filters.endDate!==m.filters.startDate?'_'+m.filters.endDate:'')+'.xlsx';
  return {workbook,sheets,filename};
})();
if(typeof module!=='undefined')module.exports=PLTD_XLSX;
