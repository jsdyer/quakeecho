import {el,fmt,options,source,table,start} from './ui.mjs';
import {communities} from './model.mjs';
start(data=>{
  options('sort',[['reports','Most responses'],['intensity','Highest reported intensity'],['distance','Nearest first']]);
  options('minimum',[[1,'1 or more'],[5,'5 or more'],[20,'20 or more'],[100,'100 or more']]);
  source('ca',data.canadaSource);source('us',data.usSource);source('dyfi',data.areaSource);
  el('result').textContent='Earthquakes Canada '+data.canada.mag+' '+data.canada.kind+' · USGS '+data.us.mag+' '+data.us.kind;
  table('agency',['Catalogue','Magnitude','Depth','Origin (UTC)'],[['Earthquakes Canada',data.canada.mag+' '+data.canada.kind,data.canada.depth+' km',data.canada.time],['USGS preferred',data.us.mag+' '+data.us.kind,data.us.depth+' km',data.us.time]]);
  const entries=data.origins.map(s=>['Origin product · '+s.agency.toUpperCase(),s.mag+' '+s.kind+' · '+s.status,s.updated]);
  entries.push(['USGS felt report',fmt(data.reports,0)+' responses',data.dyfiDate],['USGS event record','Latest product update',data.us.updated]);
  table('updates',['Published product','Measure or status','Update (UTC)'],entries.sort((a,b)=>a[2].localeCompare(b[2])));
  function filter(){
    const rows=communities(data.areas,el('place').value,Number(el('minimum').value),el('sort').value);
    el('places').textContent=fmt(rows.length,0)+' matching published areas · '+fmt(data.reports,0)+' responses in the event-wide USGS product';
    table('rows',['USGS area or ZIP','Community','Responses','Intensity (CDI)','Distance (km)'],rows.map(r=>[r.area,r.city,fmt(r.reports,0),fmt(r.intensity,1)+(r.suspect?' · flagged':''),r.distance]));
  }
  el('place').oninput=filter;el('sort').onchange=filter;el('minimum').onchange=filter;filter();
});
