export const el = id => document.getElementById(id);
export const fmt = (v,d=1) => v == null ? 'Unavailable' : Number(v).toLocaleString('en-CA',{maximumFractionDigits:d});
export function options(id, values, selected) {
  const input=el(id);
  input.replaceChildren(...values.map(([value,label])=>new Option(label,value)));
  if (selected!=null && [...input.options].some(o=>o.value===String(selected))) input.value=selected;
}
export function table(id, headings, records) {
  const grid=document.createElement('table'), header=grid.createTHead().insertRow();
  for(const name of headings){ const th=document.createElement('th');th.scope='col';th.textContent=name;header.append(th); }
  const body=grid.createTBody();
  for(const row of records){const tr=body.insertRow();for(const value of row){const cell=tr.insertCell();cell.textContent=value??'Unavailable';}}
  el(id).replaceChildren(grid);
}
export function source(id,url){const a=el(id);if(new URL(url).protocol==='https:') a.href=url;}
export async function start(run) {
  try {
    const res=await fetch('./data/edition.json');
    if(!res.ok) throw Error('snapshot');
    const data=await res.json();
    el('meta').textContent=data.coverage+' · Retrieved '+data.retrieved;
    await run(data);
    el('loading').hidden=true;
  } catch(error){el('loading').textContent='The published data could not load. Reload or open the source guide.';console.error(error);}
}
